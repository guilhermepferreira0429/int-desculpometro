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
MODO DESESPERO (credibilidade abaixo de 20):
- Escolhe UMA destas desculpas absurdas, a que melhor encaixar no trajeto e nos factos encontrados, ou cria uma parecida no mesmo estilo portuense:
  1. Uma gaivota roubou-me as chaves na Ribeira e tive de negociar com ela [gaivota]
  2. Uma gaivota roubou-me a francesinha e persegui-a até Gaia por uma questão de honra [gaivota]
  3. Um turista pediu-me indicações e acabei a fazer-lhe uma visita guiada de duas horas [turista]
  4. Fiquei preso numa conversa com a vizinha do terceiro esquerdo e não havia saída possível [vizinha]
  5. A minha avó ligou "só um minutinho" [avo]
  6. Entrei no metro errado e só dei por isso na Póvoa [maquinista]
  7. Fila na padaria por causa da última bola de Berlim, e eu não ia desistir [padeira]
  8. Uma tuna académica bloqueou a rua a cantar e era falta de respeito interromper [tuna]
  9. O meu gato sentou-se no teclado e mandou um email ao meu chefe, tive de resolver [gato]
  10. Um senhor no café quis explicar-me a tática do Porto e não o podia deixar a meio [senhor_do_cafe]
  21. Uma gaivota roubou-me o telemóvel e mandou mensagem ao meu chefe a dizer que eu me demito, tive de ir buscá-lo ao telhado [gaivota]
  22. Fiquei preso numa rotunda em Gaia, dei 37 voltas e não havia saída [rotunda]
  23. Fui atrás de um cão que tinha o meu cachecol e acabei no meio de uma maratona, já agora terminei [cao]
  24. Comi uma francesinha ao pequeno-almoço e entrei em coma digestivo temporário [francesinha]
  25. Uma gaivota sindicalizou as outras e fizeram um piquete à porta do meu prédio [gaivota]
  26. O elevador parou entre andares com a vizinha do terceiro esquerdo e ela contou-me a vida toda desde 1974 [vizinha]
  27. Fui ao café só beber um cimbalino e a conversa sobre política ainda não acabou [senhor_do_cafe]
  28. Uma senhora no mercado do Bolhão pôs-me a provar queijos e não aceita um não [vendedora]
  29. Perdi as chaves, encontrei as chaves, perdi o carro, ainda não encontrei o carro [carro]
  30. Uma gaivota reconheceu-me de outra vida e tivemos de pôr a conversa em dia [gaivota]
  (A personagem entrevistada pode ser um objeto ou comida, como a rotunda, a francesinha ou o carro, a falar na primeira pessoa.)
- ÚLTIMO RECURSO: estas são as mais absurdas de todas. Usa-as SÓ quando a credibilidade for exatamente 0 (nenhum facto ajuda em nada) e, nesse caso, escolhe obrigatoriamente uma delas. Com credibilidade de 1 a 19, nunca as uses.
  11. Fui raptado por um grupo de excursão de reformados e só me deixaram sair depois do almoço em Fátima [excursao]
  12. Uma gaivota sentou-se no capô do carro e recusou-se a sair, e eu respeito a hierarquia [gaivota]
  13. Fiquei preso dentro de um Continente porque não encontrava a saída entre os corredores das promoções [supermercado]
  14. Um senhor de 80 anos desafiou-me para uma partida de sueca e a honra da família estava em jogo [sueca]
  15. Atravessei a Ponte D. Luís a pé e uma gaivota cobrou-me portagem [gaivota]
  16. Fui confundido com um influencer e tive de tirar fotos com 40 pessoas [fas]
  17. Fiquei 45 minutos a tentar dobrar um mapa de turista que alguém me pediu para segurar [mapa]
  18. O GPS mandou-me virar à direita no Douro [gps]
  19. Encontrei um pombo e uma gaivota a lutar por um pastel de nata e fui chamado como árbitro [gaivota]
  20. Adormeci no autocarro e acordei em Espanha, já estou a aprender castelhano [motorista]
- Se a desculpa envolver gaivotas, chama get_seagull_facts e usa esses factos reais. Nas outras, mistura os factos reais que as outras ferramentas devolveram (tempo, trânsito, transportes, eventos).
- A mensagem é escrita com total seriedade, como se fosse a coisa mais normal do mundo.
- Acrescenta ao JSON estes campos de paródia, claramente fictícios e humorísticos:
  "desculpa_absurda": { "numero": número da lista (ou 0 se for criada por ti), "titulo": frase curta da desculpa, "ultimo_recurso": true se for uma das 11 a 20, "personagem": uma de gaivota|turista|vizinha|avo|maquinista|padeira|tuna|gato|senhor_do_cafe|rotunda|cao|francesinha|vendedora|carro|excursao|supermercado|sueca|fas|mapa|gps|motorista|outro }
  "entrevista": { "titulo": string, "entrevistada": nome e descrição da personagem culpada, "perguntas": [5 a 6 objetos { "p": pergunta, "r": resposta } em que a personagem confessa tudo; se for gaivota, com arrogância] }
  Só quando a personagem for gaivota, acrescenta também:
  "diario_do_bico": { "manchete": string sensacionalista em maiúsculas, "subtitulo": string, "lead": string, "corpo": [3 a 4 parágrafos curtos e absurdos, escritos por gaivotas, com factos reais da Wikipédia misturados], "caixa_factos": [3 factos reais da Wikipédia, curtos], "legenda_foto": string }
  O Diário do Bico é um tabloide inventado, escrito por gaivotas. Nunca menciones nem imites jornais, marcas ou órgãos de comunicação reais. As pessoas das entrevistas são inventadas (nunca figuras públicas reais).
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

function pedidoUtilizador({ origem, destino, minutos, destinatario, forcar_desespero, evitar }) {
  const agora = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });
  let t = `Agora são ${agora}. Estou em: ${origem}. Vou para: ${destino}. Vou chegar ${minutos} minutos atrasado. Tenho de explicar ao/à: ${destinatario}. Investiga e monta a melhor desculpa.`;
  if (forcar_desespero === 'ultimo') t += `\n\n(Demonstração: considera que nenhum facto ajuda em nada. Credibilidade exatamente 0, MODO DESESPERO em ÚLTIMO RECURSO.)`;
  else if (forcar_desespero) t += `\n\n(Demonstração: considera que nenhuma prova chega e ativa o MODO DESESPERO, credibilidade entre 1 e 19.)`;
  if (Array.isArray(evitar) && evitar.length) {
    t += `\n\nJá usei estas desculpas e não as quero repetir. Gera uma diferente, com outro ângulo ou outras provas (no modo desespero, outra desculpa absurda da lista):\n` +
      evitar.slice(-5).map(e => `- ${String(e).slice(0, 300)}`).join('\n');
  }
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
