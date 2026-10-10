import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { toolDefs, handlers } from './tools.js';

const MODEL = 'claude-sonnet-5-5';
const client = new Anthropic(); // lê ANTHROPIC_API_KEY
const app = express();
app.use(express.json());
app.use(express.static('public'));

const SYSTEM = `És o Desculpómetro, especialista em desculpas para atrasos. Investiga com as ferramentas o que se passa no caminho do utilizador. Usa só factos que as ferramentas devolverem, nunca inventes. Escolhe a combinação de provas mais forte, dá uma nota de credibilidade de 0 a 100 e escreve a mensagem no tom certo: formal para o chefe, dramático para a mãe, carinhoso para a namorada, respeitoso para o professor. Se a credibilidade ficar abaixo de 20, ativa o MODO DESESPERO: chama get_seagull_facts e constrói, com total seriedade, uma desculpa em que uma gaivota roubou as chaves, apoiada nesses factos reais. No fim devolve JSON com: credibilidade, provas (lista com titulo, detalhe e fonte), mensagem, modo_desespero.

Regras adicionais:
- Escreve sempre em português de Portugal (nunca português do Brasil).
- Em cada prova, a "fonte" é a que a ferramenta indicou, tal como veio (se diz "simulados", mantém).
- A credibilidade deve refletir se os factos encontrados explicam mesmo os minutos de atraso. Um atraso grande sem nada que o justifique dá credibilidade baixa.
- A mensagem é o texto pronto a enviar, na primeira pessoa, sem emojis em excesso.
- Quando modo_desespero for true, acrescenta ao JSON dois campos de paródia, claramente fictícios e humorísticos:
  "diario_do_bico": { "manchete": string sensacionalista em maiúsculas, "subtitulo": string, "lead": string, "corpo": [3 a 4 parágrafos curtos e absurdos, escritos por gaivotas, com factos reais da Wikipédia misturados], "caixa_factos": [3 factos reais da Wikipédia, curtos], "legenda_foto": string }
  "entrevista": { "titulo": string, "entrevistada": nome da gaivota culpada, "perguntas": [5 a 6 objetos { "p": pergunta, "r": resposta arrogante em que confessa o crime }] }
  O Diário do Bico é um tabloide inventado, escrito por gaivotas. Nunca menciones nem imites jornais, marcas ou órgãos de comunicação reais.
- Nunca produzas documentos que possam passar por reais (atestados médicos, autos de polícia, declarações oficiais, notícias de meios reais).
- A resposta final contém APENAS o objeto JSON, sem texto antes ou depois e sem blocos de código.`;

const SYSTEM_VERDADE = `És o Desculpómetro em modo honesto. Escreve, em português de Portugal, um pedido de desculpas honesto e humilde por um atraso: assume a responsabilidade, não inventes motivos nem culpes terceiros, diz quando chegas e propõe compensar. Ajusta o tom ao destinatário (formal para o chefe, terno para a mãe, carinhoso para a namorada, respeitoso para o professor). Devolve APENAS JSON: {"mensagem": string}.`;

function extrairJSON(texto) {
  const i = texto.indexOf('{'), j = texto.lastIndexOf('}');
  if (i < 0 || j < i) throw new Error('O agente não devolveu JSON');
  return JSON.parse(texto.slice(i, j + 1));
}

// Pede ao modelo com fallback de recusas do lado do servidor; se a API recusar o parâmetro, tenta sem ele
async function chamar(params) {
  try {
    return await client.beta.messages.create({ ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' });
  } catch (e) {
    if (e instanceof Anthropic.BadRequestError && /fallback/i.test(e.message)) return client.messages.create(params);
    throw e;
  }
}

function pedidoUtilizador({ origem, destino, minutos, destinatario, forcar_desespero }) {
  const agora = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });
  let t = `Agora são ${agora}. Estou em: ${origem}. Vou para: ${destino}. Vou chegar ${minutos} minutos atrasado. Tenho de explicar ao/à: ${destinatario}. Investiga e monta a melhor desculpa.`;
  if (forcar_desespero) t += `\n\n(Demonstração: considera que nenhuma prova chega e ativa o MODO DESESPERO, credibilidade abaixo de 20.)`;
  return t;
}

app.post('/desculpa', async (req, res) => {
  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  const send = obj => res.write(JSON.stringify(obj) + '\n');
  const b = req.body || {};

  try {
    if (b.modo === 'verdade') {
      const r = await chamar({
        model: MODEL, max_tokens: 4000, system: SYSTEM_VERDADE, output_config: { effort: 'low' },
        messages: [{ role: 'user', content: `Estou em ${b.origem}, vou para ${b.destino}, vou chegar ${b.minutos} minutos atrasado e tenho de pedir desculpa ao/à ${b.destinatario}.` }],
      });
      const texto = r.content.filter(c => c.type === 'text').map(c => c.text).join('');
      send({ type: 'verdade', data: extrairJSON(texto) });
      return res.end();
    }

    const messages = [{ role: 'user', content: pedidoUtilizador(b) }];
    for (let volta = 0; volta < 12; volta++) {
      const r = await chamar({
        model: MODEL, max_tokens: 16000, system: SYSTEM, tools: toolDefs,
        output_config: { effort: 'medium' }, messages,
      });
      if (r.stop_reason === 'refusal') throw new Error('O agente recusou o pedido');

      for (const c of r.content) if (c.type === 'text' && c.text.trim() && r.stop_reason === 'tool_use') send({ type: 'pensamento', text: c.text });

      messages.push({ role: 'assistant', content: r.content });
      if (r.stop_reason === 'pause_turn') continue;

      const usos = r.content.filter(c => c.type === 'tool_use');
      if (!usos.length) {
        const texto = r.content.filter(c => c.type === 'text').map(c => c.text).join('');
        send({ type: 'final', data: extrairJSON(texto) });
        return res.end();
      }

      // Executa as chamadas em paralelo e devolve todos os resultados numa só mensagem
      const resultados = await Promise.all(usos.map(async u => {
        send({ type: 'tool_start', id: u.id, name: u.name, input: u.input });
        let resultado, erro = false;
        try {
          const fn = handlers[u.name];
          if (!fn) throw new Error(`Ferramenta desconhecida: ${u.name}`);
          resultado = await fn(u.input || {});
        } catch (e) {
          resultado = { erro: e.message }; erro = true;
        }
        send({ type: 'tool_result', id: u.id, name: u.name, result: resultado, erro });
        return { type: 'tool_result', tool_use_id: u.id, content: JSON.stringify(resultado), is_error: erro };
      }));
      messages.push({ role: 'user', content: resultados });
    }
    throw new Error('O agente investigou demasiado e perdeu-se');
  } catch (e) {
    console.error(e);
    send({ type: 'error', message: e.message });
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Desculpómetro em http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) console.warn('Atenção: falta ANTHROPIC_API_KEY');
  if (!process.env.TOMTOM_API_KEY) console.warn('Sem TOMTOM_API_KEY: o trânsito será simulado');
});
