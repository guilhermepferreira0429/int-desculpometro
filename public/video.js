// "Vídeo" da desculpa: reconstituição animada estilo câmara de vigilância, feita com os bonecos SVG.
// O agente escreve um guião de 3 a 5 cenas (cenário + ação + legenda); cada cena dura CENA segundos.
// Claramente fictícia: tem sempre o aviso de reconstituição.
import { boneco } from './bonecos.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CENA = 4;     // segundos por cena
const FIM = 1.8;    // segundos do carimbo final
const VOADORES = new Set(['gaivota', 'pombo', 'guarda_chuva']);
const VEICULOS = new Set(['maquinista', 'excursao', 'motorista', 'carro', 'supermercado', 'rabelo']);
const ACOES = new Set(['aproxima', 'rouba', 'rapta', 'viagem', 'come', 'conversa', 'persegue', 'preso', 'festa', 'chega']);

const TXT = {
  pt: { aviso: 'Reconstituição animada · ficção', cam: 'CAM', play: '▶', pausa: '❚❚', min: 'MIN DE ATRASO', falta: 'NÃO FOI', bla: 'bla bla bla', nham: 'nham!' },
  en: { aviso: 'Animated reconstruction · fiction', cam: 'CAM', play: '▶', pausa: '❚❚', min: 'MIN LATE', falta: 'NO-SHOW', bla: 'blah blah blah', nham: 'yum!' },
};
const NOMES = { ribeira: 'RIBEIRA', ponte: 'PONTE D. LUÍS', rua: 'RUA DE SANTA CATARINA', estrada: 'A1 · SUL', cafe: 'CAFÉ CENTRAL', casa: 'PRÉDIO · 3.º ESQ', metro: 'METRO · LINHA B', mercado: 'BOLHÃO', supermercado: 'CORREDOR 7', fatima: 'FÁTIMA', restaurante: 'TASCA DO ZÉ' };

// Cenários em SVG 640x360
const ceu = (a = '#9bd3ff', b = '#e8f6ff') => `<defs><linearGradient id="vc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="640" height="360" fill="url(#vc)"/>`;
const casas = (y = 120) => {
  const cores = ['#ff8c42', '#ffd23f', '#ef6f6c', '#7bdff2', '#b8f2e6', '#f4a261', '#e9c46a', '#ff4f8b'];
  return cores.map((c, i) => { const x = i * 82 - 8, h = 110 + (i % 3) * 22;
    return `<rect x="${x}" y="${y + 130 - h}" width="80" height="${h}" fill="${c}" stroke="#1d1b4b" stroke-width="3"/><path d="M${x} ${y + 130 - h} l40 -22 l40 22" fill="#c0392b" stroke="#1d1b4b" stroke-width="3"/>` +
      [0, 1].map(r => [0, 1, 2].map(k => `<rect x="${x + 10 + k * 22}" y="${y + 150 - h + r * 34}" width="14" height="20" fill="#fff6e0" stroke="#1d1b4b" stroke-width="2"/>`).join('')).join('');
  }).join('');
};
const chao = (cor = '#c9b79c', y = 290) => `<rect y="${y}" width="640" height="${360 - y}" fill="${cor}" stroke="#1d1b4b" stroke-width="3"/>`;
const rio = y => `<rect y="${y}" width="640" height="${360 - y}" fill="#3a86ff"/><path d="M0 ${y + 18} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`;
const interior = (parede, placa) => `<rect width="640" height="360" fill="${parede}"/><rect y="290" width="640" height="70" fill="#8d6e63" stroke="#1d1b4b" stroke-width="3"/>
  <rect x="200" y="40" width="240" height="60" rx="10" fill="#1d1b4b"/><text x="320" y="82" font-size="30" font-weight="800" fill="#ffd23f" text-anchor="middle" font-family="Baloo 2, sans-serif">${placa}</text>`;

const CENARIOS = {
  ribeira: () => `${ceu()}${casas(90)}<rect y="220" width="640" height="40" fill="#c9b79c" stroke="#1d1b4b" stroke-width="3"/>${rio(300)}<rect y="258" width="640" height="44" fill="#a1887f" stroke="#1d1b4b" stroke-width="3"/>`,
  ponte: () => `${ceu('#ffb385', '#ffe8d6')}${rio(250)}<path d="M-20 250 Q320 10 660 250" fill="none" stroke="#3b3b3b" stroke-width="16"/><path d="M-20 250 Q320 30 660 250" fill="none" stroke="#5a5a5a" stroke-width="4" stroke-dasharray="6 14"/>${[60, 140, 220, 300, 380, 460, 540].map(x => `<path d="M${x} ${250 - Math.max(0, 230 - Math.abs(x - 320) * 0.9)} V140" stroke="#3b3b3b" stroke-width="4"/>`).join('')}<rect y="130" width="640" height="14" fill="#3b3b3b"/><rect y="270" width="640" height="90" fill="#a1887f" stroke="#1d1b4b" stroke-width="3"/>`,
  rua: () => `${ceu()}${casas(110)}${chao('#bdbdbd', 250)}<rect y="300" width="640" height="60" fill="#555"/><path d="M0 330 h640" stroke="#fff" stroke-width="5" stroke-dasharray="30 24"/>`,
  estrada: () => `${ceu('#cfe8ff', '#f5fbff')}<path d="M0 230 Q160 190 320 220 T640 210 V360 H0 Z" fill="#8bc34a" stroke="#1d1b4b" stroke-width="3"/><rect y="270" width="640" height="90" fill="#555" stroke="#1d1b4b" stroke-width="3"/><path class="tracos" d="M-60 315 h760" stroke="#ffd23f" stroke-width="5" stroke-dasharray="34 26"/>`,
  cafe: () => `${interior('#ffe0b2', '☕ CAFÉ')}<rect x="20" y="200" width="600" height="92" fill="#6d4c41" stroke="#1d1b4b" stroke-width="3"/><rect x="40" y="150" width="60" height="50" fill="#bbb" stroke="#1d1b4b" stroke-width="3"/>`,
  casa: () => `${interior('#d1c4e9', '🛗 3.º ESQ')}<rect x="250" y="120" width="140" height="170" fill="#9e9e9e" stroke="#1d1b4b" stroke-width="3"/><path d="M320 120 V290" stroke="#1d1b4b" stroke-width="3"/>`,
  metro: () => `${interior('#fff3c4', 'METRO · B')}${[30, 190, 350, 510].map(x => `<rect x="${x}" y="120" width="110" height="80" rx="10" fill="#8ecdff" stroke="#1d1b4b" stroke-width="3"/>`).join('')}<path d="M0 230 h640" stroke="#ffd23f" stroke-width="10"/>`,
  mercado: () => `${interior('#c8e6c9', '🧀 BOLHÃO')}${[40, 240, 440].map(x => `<rect x="${x}" y="200" width="160" height="90" fill="#a1887f" stroke="#1d1b4b" stroke-width="3"/><path d="M${x} 200 l20 -30 h120 l20 30" fill="#ef233c" stroke="#1d1b4b" stroke-width="3"/>`).join('')}`,
  supermercado: () => `${interior('#e3f2fd', '🛒 PROMOÇÕES')}${[20, 230, 440].map(x => `<rect x="${x}" y="130" width="180" height="160" fill="#fff" stroke="#1d1b4b" stroke-width="3"/>${[0, 1, 2].map(r => `<path d="M${x} ${170 + r * 40} h180" stroke="#1d1b4b" stroke-width="3"/>`).join('')}<text x="${x + 90}" y="160" font-size="22" font-weight="900" fill="#ef233c" text-anchor="middle" font-family="sans-serif">-50%</text>`).join('')}`,
  fatima: () => `${ceu('#bde0fe', '#fff8e7')}<rect y="250" width="640" height="110" fill="#e9e4d4" stroke="#1d1b4b" stroke-width="3"/>
    <rect x="230" y="120" width="180" height="130" fill="#fffdf6" stroke="#1d1b4b" stroke-width="3"/><path d="M300 250 v-50 q20 -24 40 0 v50" fill="#d6cfc0" stroke="#1d1b4b" stroke-width="3"/>
    <rect x="300" y="30" width="40" height="90" fill="#fffdf6" stroke="#1d1b4b" stroke-width="3"/><path d="M296 30 L320 6 L344 30 Z" fill="#fffdf6" stroke="#1d1b4b" stroke-width="3"/>
    ${[60, 120, 520, 580].map(x => `<rect x="${x - 4}" y="160" width="8" height="90" fill="#fffdf6" stroke="#1d1b4b" stroke-width="2"/>`).join('')}<path d="M40 160 H230 M410 160 H600" stroke="#1d1b4b" stroke-width="3"/>
    <text x="320" y="345" font-size="20" font-weight="800" fill="#6b6893" text-anchor="middle" font-family="Baloo 2, sans-serif">FÁTIMA · 190 km</text>`,
  restaurante: () => `${interior('#ffd6a5', '🍽️ TASCA DO ZÉ')}<path d="M0 130 h640" stroke="#c0392b" stroke-width="10" stroke-dasharray="20 20"/>${[90, 550].map(x => `<rect x="${x - 40}" y="130" width="80" height="70" fill="#8ecdff" stroke="#1d1b4b" stroke-width="3"/>`).join('')}`,
};

const CSS = `
  .vid { position: relative; aspect-ratio: 16 / 9; width: 100%; border: 3px solid #1d1b4b; border-radius: 16px; overflow: hidden; background: #000; box-shadow: 6px 6px 0 #1d1b4b; }
  .vid .palco { position: absolute; inset: 0; }
  .vid .palco > svg.fundo { position: absolute; inset: 0; width: 100%; height: 100%; }
  .vid .ator { position: absolute; bottom: 21%; width: 15%; animation-duration: ${CENA}s; animation-fill-mode: both; animation-timing-function: linear; }
  .vid .ator.veic { width: 27%; bottom: 17%; }
  .vid .ator.grande { width: 24%; }
  .vid .ator svg { width: 100%; height: auto; display: block; overflow: visible; }
  .vid .ator.vira svg { transform: scaleX(-1); }
  .vid .fx { position: absolute; font-family: "Baloo 2", sans-serif; font-weight: 900; animation-duration: ${CENA}s; animation-fill-mode: both; }
  .vid .obj { font-size: clamp(1.3rem, 3.6vw, 2.4rem); bottom: 40%; }
  .vid .espanto { font-size: clamp(1.6rem, 5vw, 3.2rem); color: #ef233c; bottom: 52%; }
  .vid .fala { background: #fff; color: #1d1b4b; border: 3px solid #1d1b4b; border-radius: 14px; padding: 2px 10px; font-size: clamp(.7rem, 1.8vw, 1.1rem); white-space: nowrap; }
  .vid .noite { position: absolute; inset: 0; background: linear-gradient(#0b1440ee, #1d1b4b99); pointer-events: none; }
  .vid .noite::before { content: '🌙'; position: absolute; top: 12%; right: 10%; font-size: clamp(1.6rem, 5vw, 3rem); }
  .vid .noite::after { content: '✦  ✧     ✦    ✧   ✦'; position: absolute; top: 8%; left: 8%; color: #fff6a0; font-size: clamp(.7rem, 2vw, 1.2rem); letter-spacing: 6px; }
  .vid .tracos { animation: v-tracos .5s linear infinite; }
  @keyframes v-tracos { to { transform: translateX(-60px); } }
  .vid .mesa { position: absolute; left: 34%; width: 32%; bottom: 18%; height: auto; }
  .vid .carimbo-v { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: "Baloo 2", sans-serif; font-weight: 800; font-size: clamp(1.6rem, 6vw, 3.6rem); color: #fff; text-shadow: 3px 3px 0 #1d1b4b; background: #1d1b4b88; animation: v-carimbo .5s cubic-bezier(.2,1.8,.4,1) both; }
  @keyframes v-carimbo { from { transform: scale(2.2); opacity: 0; } to { transform: rotate(-6deg); } }

  /* ações (cada uma dura uma cena) */
  @keyframes v-entra-esq { from { left: -18%; } to { left: 26%; } }
  @keyframes v-entra-dir { from { left: 110%; } to { left: 52%; } }
  @keyframes v-parado-treme { 0%, 30% { transform: none; } 35%, 45%, 55% { transform: translateX(-5px); } 40%, 50%, 60% { transform: translateX(5px); } 65% { left: 26%; } 100% { left: 75%; } }
  @keyframes v-foge { 0%, 38% { left: 52%; bottom: 21%; } 100% { left: 125%; bottom: 21%; } }
  @keyframes v-foge-voa { 0%, 38% { left: 52%; bottom: 21%; } 100% { left: 118%; bottom: 85%; } }
  @keyframes v-obj-rouba { 0%, 15% { left: 38%; opacity: 0; } 20% { left: 38%; opacity: 1; } 35% { left: 55%; } 38% { left: 55%; bottom: 40%; } 100% { left: 128%; opacity: 1; } }
  @keyframes v-obj-rouba-voa { 0%, 15% { left: 38%; bottom: 40%; opacity: 0; } 20% { left: 38%; opacity: 1; } 35% { left: 55%; bottom: 40%; } 38% { left: 55%; bottom: 40%; } 100% { left: 122%; bottom: 100%; opacity: 1; } }
  @keyframes v-pop { 0%, 30% { opacity: 0; transform: scale(.3); } 36% { opacity: 1; transform: scale(1.2); } 55% { opacity: 1; transform: scale(1); } 62%, 100% { opacity: 0; } }
  @keyframes v-rapta-tu { 0%, 40% { left: 30%; transform: none; } 48% { transform: translateY(-14%) rotate(-12deg); } 85% { left: 72%; transform: translateY(-14%) rotate(-12deg); opacity: 1; } 90%, 100% { left: 74%; opacity: 0; transform: translateY(-14%) rotate(-12deg); } }
  @keyframes v-rapta-aj { 0% { left: var(--x0); } 40% { left: var(--x1); } 85% { left: var(--x2); opacity: 1; } 90%, 100% { left: var(--x2); opacity: 0; } }
  @keyframes v-estaciona-parte { 0%, 86% { left: 68%; } 100% { left: 130%; } }
  @keyframes v-atravessa { from { left: -32%; } to { left: 108%; } }
  @keyframes v-solavanco { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
  @keyframes v-corre-1 { from { left: 22%; } to { left: 125%; } }
  @keyframes v-corre-2 { from { left: -22%; } to { left: 100%; } }
  @keyframes v-salta { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-22%); } }
  @keyframes v-orbita { from { transform: rotate(0deg) translateX(min(18vw, 150px)) rotate(0deg); } to { transform: rotate(-720deg) translateX(min(18vw, 150px)) rotate(720deg); } }
  @keyframes v-chega { from { left: -18%; } to { left: 44%; } }
  @keyframes v-fala-a { 0%, 8% { opacity: 0; } 12%, 40% { opacity: 1; } 45%, 100% { opacity: 0; } }
  @keyframes v-fala-b { 0%, 45% { opacity: 0; } 50%, 85% { opacity: 1; } 90%, 100% { opacity: 0; } }
  @keyframes v-relogio { to { transform: rotate(1080deg); } }
  @keyframes v-cai { from { transform: translateY(-120%) rotate(0); } to { transform: translateY(400%) rotate(540deg); } }
  @keyframes v-comida { 0%, 20% { opacity: 0; transform: scale(0); } 30%, 100% { opacity: 1; transform: scale(1); } }

  .vid .hud { position: absolute; top: 10px; left: 12px; right: 12px; display: flex; justify-content: space-between; font: 700 clamp(.6rem, 1.6vw, .9rem) ui-monospace, Consolas, monospace; color: #fff; text-shadow: 1px 1px 0 #000; z-index: 3; }
  .vid .rec::before { content: '●'; color: #ef233c; margin-right: 5px; animation: v-pisca 1s steps(2) infinite; }
  @keyframes v-pisca { 50% { opacity: 0; } }
  .vid .cctv { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, #0000 0 3px, #0002 3px 4px); z-index: 2; }
  .vid .cctv::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 0 80px #000a; }
  .vid .aviso-v { position: absolute; top: 34px; left: 12px; font: 700 clamp(.5rem, 1.3vw, .72rem) system-ui, sans-serif; color: #ffd23f; background: #0008; padding: 2px 6px; border-radius: 4px; z-index: 3; }
  .vid .cena-n { position: absolute; top: 34px; right: 12px; font: 700 clamp(.5rem, 1.3vw, .72rem) ui-monospace, monospace; color: #fff; background: #0008; padding: 2px 6px; border-radius: 4px; z-index: 3; }
  .vid .legenda-v { position: absolute; left: 8%; right: 8%; bottom: 11%; text-align: center; font: 700 clamp(.8rem, 2.3vw, 1.25rem) system-ui, sans-serif; color: #fff; z-index: 3; }
  .vid .legenda-v span { background: #000b; padding: 3px 10px; border-radius: 6px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
  .vid .barra-v { position: absolute; left: 0; right: 0; bottom: 0; height: 34px; background: linear-gradient(#0000, #000c); display: flex; align-items: center; gap: 10px; padding: 0 12px; z-index: 3; }
  .vid .barra-v button { all: unset; cursor: pointer; color: #fff; font-size: 1rem; width: 22px; text-align: center; }
  .vid .prog { flex: 1; height: 5px; background: #fff4; border-radius: 3px; overflow: hidden; position: relative; }
  .vid .prog i { position: absolute; inset: 0; background: #ff4f8b; transform-origin: left; transform: scaleX(0); }
  .vid .prog b { position: absolute; top: 0; bottom: 0; width: 2px; background: #fff8; }
  .vid.pausa * { animation-play-state: paused !important; }
`;
function css() {
  if (document.getElementById('vid-css')) return;
  const st = document.createElement('style'); st.id = 'vid-css'; st.textContent = CSS; document.head.appendChild(st);
}

const MESA = `<svg class="mesa" viewBox="0 0 200 90"><rect x="4" y="20" width="192" height="16" rx="4" fill="#fff" stroke="#1d1b4b" stroke-width="3"/><path d="M4 30 h192 v8 h-192 Z" fill="#ef233c" opacity=".7"/><path d="M24 36 v52 M176 36 v52" stroke="#1d1b4b" stroke-width="6"/></svg>`;

// Monta uma cena: devolve o HTML dos atores e efeitos para a ação pedida
function montarCena(c, culpado, T) {
  const veic = VEICULOS.has(culpado), voa = VOADORES.has(culpado);
  const cul = (anim, extra = '', estilo = '') => `<div class="ator${veic ? ' veic' : ' vira'} ${extra}" style="animation-name:${anim};${estilo}">${boneco(culpado)}</div>`;
  const tu = (anim, estilo = '', extra = '') => `<div class="ator ${extra}" style="animation-name:${anim};${estilo}">${boneco('tu')}</div>`;
  const fx = (cls, txt, estilo) => `<div class="fx ${cls}" style="${estilo}">${esc(txt)}</div>`;
  const obj = esc(c.objeto || '🔑');
  const aj = c.ajudantes && c.ajudantes !== culpado ? c.ajudantes : null;
  const nAj = Math.max(0, Math.min(4, Number(c.n_ajudantes) || (aj ? 3 : 0)));
  const ajudantes = (fn) => aj ? Array.from({ length: nAj }, (_, i) => fn(i)).join('') : '';
  switch (c.acao) {
    case 'rouba':
      return tu('v-parado-treme', 'left:26%') + cul(voa ? 'v-foge-voa' : 'v-foge', '', 'left:52%') +
        fx('obj', obj, `animation-name:${voa ? 'v-obj-rouba-voa' : 'v-obj-rouba'}; left:38%`) + fx('espanto', '!?', 'animation-name:v-pop; left:28%');
    case 'rapta': {
      // os ajudantes (ou o culpado) chegam pela direita, levantam-te e levam-te; se o culpado for um veículo, entram nele e ele parte
      const quem = aj || (veic ? 'avo' : culpado), n = aj ? nAj : (veic ? 3 : 1);
      const grupo = Array.from({ length: n }, (_, i) => `<div class="ator vira" style="animation-name:v-rapta-aj; --x0:${105 + i * 12}%; --x1:${40 + i * 9}%; --x2:${70 + i * 4}%; z-index:${5 - i}">${boneco(quem)}</div>`).join('');
      return (veic ? cul('v-estaciona-parte', '', 'left:68%; z-index:0; ' + 'animation-name:v-estaciona-parte') : '') + tu('v-rapta-tu', 'left:30%') + grupo + fx('espanto', '!?', 'animation-name:v-pop; left:30%');
    }
    case 'viagem': {
      const v = veic ? culpado : 'carro';
      return `<div class="ator veic" style="animation-name:v-atravessa">${boneco(v)}</div>`;
    }
    case 'come': {
      const pratos = [c.objeto || '🍲', '🐟', '🍮', '🍷'];
      return MESA + tu('v-salta', 'left:18%; animation-duration:.8s; animation-iteration-count:infinite') +
        (aj ? ajudantes(i => `<div class="ator vira" style="left:${62 + i * 9}%; animation-name:v-salta; animation-duration:${.7 + i * .1}s; animation-iteration-count:infinite">${boneco(aj)}</div>`)
            : cul('v-salta', '', 'left:64%; animation-duration:.9s; animation-iteration-count:infinite')) +
        pratos.map((p, i) => fx('obj', p, `animation-name:v-comida; animation-delay:${i * 0.5}s; left:${38 + i * 6}%; bottom:33%`)).join('') +
        fx('fala', T.nham, 'animation-name:v-fala-b; left:20%; bottom:58%');
    }
    case 'conversa':
      return tu('', 'left:24%') + (aj ? ajudantes(i => `<div class="ator vira" style="left:${52 + i * 10}%">${boneco(aj)}</div>`) : cul('', '', 'left:54%')) +
        fx('fala', T.bla, 'animation-name:v-fala-b; left:54%; bottom:62%') + fx('fala', '...', 'animation-name:v-fala-a; left:24%; bottom:62%') +
        fx('obj', '🕐', 'animation-name:v-relogio; left:45%; bottom:75%');
    case 'persegue':
      return `<div class="ator${veic ? ' veic' : ''}" style="animation-name:v-corre-1">${boneco(culpado)}</div>` + tu('v-corre-2') +
        (c.objeto ? fx('obj', obj, 'animation-name:v-corre-1; bottom:44%') : '');
    case 'preso':
      return `<div class="ator grande${veic ? ' veic' : ''}" style="left:38%; bottom:20%">${boneco(culpado)}</div>` +
        `<div class="ator" style="left:43%; bottom:24%; animation-name:v-orbita; animation-iteration-count:1">${boneco('tu')}</div>` +
        fx('fala', '↻ ×37', 'left:44%; bottom:72%');
    case 'festa':
      return tu('v-salta', 'left:30%; animation-duration:.6s; animation-iteration-count:infinite') +
        cul('v-salta', '', 'left:54%; animation-duration:.7s; animation-iteration-count:infinite') +
        ajudantes(i => `<div class="ator vira" style="left:${68 + i * 8}%; animation-name:v-salta; animation-duration:${.6 + i * .1}s; animation-iteration-count:infinite">${boneco(aj)}</div>`) +
        ['🎉', '🎊', '✨', '🎉', '🎊'].map((e, i) => fx('obj', e, `animation-name:v-cai; animation-duration:${1.6 + i * .3}s; animation-iteration-count:infinite; left:${10 + i * 18}%; top:0; bottom:auto`)).join('');
    case 'chega':
      return tu('v-chega') + fx('fala', '😮‍💨', 'animation-name:v-fala-b; left:46%; bottom:60%') +
        (aj ? ajudantes(i => `<div class="ator vira" style="left:${70 + i * 7}%">${boneco(aj)}</div>`) : '');
    default: // aproxima
      return tu('v-entra-esq') + cul(veic ? 'v-entra-dir' : 'v-entra-dir', '', 'left:52%');
  }
}

// Guião antigo (cenario + legendas) convertido em cenas
function normalizar(video, personagem) {
  if (Array.isArray(video.cenas) && video.cenas.length) {
    return video.cenas.slice(0, 5).map(c => ({ ...c, cenario: CENARIOS[c.cenario] ? c.cenario : 'rua', acao: ACOES.has(c.acao) ? c.acao : 'aproxima' }));
  }
  const cen = CENARIOS[video.cenario] ? video.cenario : (VOADORES.has(personagem) ? 'ribeira' : 'rua');
  const leg = Array.isArray(video.legendas) ? video.legendas : [];
  return ['aproxima', 'rouba', 'persegue', 'chega'].map((acao, i) => ({ cenario: cen, acao, legenda: leg[i] || '', objeto: video.objeto }));
}

// onde: elemento; opcoes: { lang, personagem, video: {cenas} ou {cenario, objeto, legendas}, minutos, fuga }
export function mostrarVideo(onde, { lang = 'pt', personagem = 'gaivota', video = {}, minutos, fuga = false, cenaInicial = 0, origem = '', destino = '' } = {}) {
  css();
  const T = TXT[lang] || TXT.pt;
  const cenas = normalizar(video || {}, personagem);
  const total = cenas.length * CENA + FIM;
  const fim = fuga ? T.falta : `+${Number(minutos) || '??'} ${T.min}`;
  onde.innerHTML = `
    <div class="vid">
      <div class="palco"></div>
      <div class="cctv"></div>
      <div class="hud"><span class="rec">REC</span><span class="camnome"></span><span class="tc">00:00:00</span></div>
      <div class="aviso-v">${esc(T.aviso)}</div>
      <div class="cena-n"></div>
      <div class="legenda-v"><span></span></div>
      <div class="barra-v"><button type="button" class="pp">${T.pausa}</button><div class="prog"><i></i>${cenas.slice(1).map((_, i) => `<b style="left:${((i + 1) * CENA / total) * 100}%"></b>`).join('')}</div></div>
    </div>`;
  const el = onde.querySelector('.vid'), palco = el.querySelector('.palco'), leg = el.querySelector('.legenda-v span');
  const tc = el.querySelector('.tc'), cam = el.querySelector('.camnome'), num = el.querySelector('.cena-n'), barra = el.querySelector('.prog i'), pp = el.querySelector('.pp');
  const h0 = new Date();
  let decorrido = cenaInicial * CENA * 1000, ultimo = performance.now(), pausa = false, atual = -1;

  const mostrar = i => {
    atual = i;
    if (i >= cenas.length) { palco.insertAdjacentHTML('beforeend', `<div class="carimbo-v">${esc(fim)}</div>`); leg.textContent = ''; return; }
    const c = cenas[i];
    palco.innerHTML = `<svg class="fundo" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">${CENARIOS[c.cenario]()}</svg>${montarCena(c, personagem, T)}${c.noite ? '<div class="noite"></div>' : ''}`;
    leg.textContent = c.legenda || '';
    const rota = origem && destino && origem !== destino ? `${origem} → ${destino}` : (destino || origem);
    const local = c.local || (['estrada', 'rua'].includes(c.cenario) && rota ? rota : NOMES[c.cenario]) || '';
    cam.textContent = `${T.cam} 0${(i % 9) + 1} · ${String(local).toUpperCase().slice(0, 34)}`;
    num.textContent = `${i + 1}/${cenas.length}`;
  };
  const passo = () => {
    if (!document.body.contains(el)) return; // o vídeo foi substituído
    const agora = performance.now();
    if (!pausa) decorrido += agora - ultimo;
    ultimo = agora;
    const s = (decorrido / 1000) % total;
    const i = Math.min(cenas.length, Math.floor(s / CENA));
    if (i !== atual) mostrar(i);
    barra.style.transform = `scaleX(${s / total})`;
    tc.textContent = new Date(h0.getTime() + decorrido * 20).toLocaleTimeString('pt-PT', { hour12: false }); // o relógio da câmara corre mais depressa
    requestAnimationFrame(passo);
  };
  mostrar(Math.min(cenas.length, cenaInicial));
  requestAnimationFrame(passo);
  pp.onclick = () => { pausa = !pausa; el.classList.toggle('pausa', pausa); pp.textContent = pausa ? T.play : T.pausa; };
}
