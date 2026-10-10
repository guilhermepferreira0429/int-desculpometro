// Grava as demos dos exemplos (investigação, conversa do Bico Messenger e tribunal) com o agente real.
// Uso, com o servidor a correr: node scripts/gravar-demos.mjs [índices...]   ex.: node scripts/gravar-demos.mjs 0 3
// Escreve public/demos/<índice>-<lang>.json
import fs from 'node:fs';
import { EXEMPLOS, DESTINATARIOS } from '../public/catalogo.js';

const BASE = process.env.BASE || 'http://localhost:3000';
const pasta = new URL('../public/demos/', import.meta.url);
fs.mkdirSync(pasta, { recursive: true });

const indices = process.argv.slice(2).map(Number);
const alvo = indices.length ? indices : EXEMPLOS.map((_, i) => i);

async function gravar(i, lang) {
  const e = EXEMPLOS[i];
  const dest = DESTINATARIOS.find(d => d.id === e.destinatario);
  const pedido = {
    lang, tipo: e.tipo, origem: e.origem, destino: e.destino,
    minutos: e.tipo === 'atraso' ? e.minutos : undefined,
    evento: e['evento_' + lang], quando: e['quando_' + lang],
    destinatario_id: e.destinatario, destinatario: dest[lang],
    contexto: e['contexto_' + lang], forcar_desespero: e.modo || false,
  };
  const r = await fetch(`${BASE}/desculpa`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pedido) });
  const eventos = (await r.text()).split('\n').filter(Boolean).map(l => JSON.parse(l));
  const final = eventos.find(x => x.type === 'final');
  if (!final) throw new Error(`${i}-${lang}: sem resultado (${JSON.stringify(eventos.at(-1)).slice(0, 200)})`);
  const d = final.data;
  const post = (url, corpo) => fetch(BASE + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) }).then(x => x.json());
  const [conversa, tribunal] = await Promise.all([
    post('/conversa', {
      lang, destinatario: pedido.destinatario, destinatario_id: pedido.destinatario_id,
      mensagem: d.mensagem, credibilidade: d.credibilidade, modo_desespero: d.modo_desespero,
      desculpa: d.desculpa_absurda?.titulo, personagem: d.desculpa_absurda?.personagem,
      entrevista: d.entrevista ? JSON.stringify(d.entrevista).slice(0, 1500) : '', culpado_nome: d.entrevista?.entrevistada || '',
    }),
    post('/tribunal', {
      lang, mensagem: d.mensagem, credibilidade: d.credibilidade, modo_desespero: d.modo_desespero,
      desculpa: d.desculpa_absurda?.titulo, provas: (d.provas || []).map(p => `${p.titulo}: ${p.detalhe} (${p.fonte})`),
    }),
  ]);
  const ficheiro = new URL(`${i}-${lang}.json`, pasta);
  fs.writeFileSync(ficheiro, JSON.stringify({ pedido, eventos, conversa, tribunal }, null, 1));
  console.log(`${i}-${lang}: ${d.modo} ${d.credibilidade} · ${d.resumo} · desfecho ${conversa.desfecho} · tribunal ${tribunal.votos?.map(v => v.voto).join('/')}`);
}

const LANGS = (process.env.LANGS || 'pt,en').split(',');
await Promise.all(alvo.flatMap(i => LANGS.map(lang => gravar(i, lang).catch(err => console.error('ERRO', err.message)))));
