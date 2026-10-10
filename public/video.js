// "Vídeo" da desculpa: reconstituição animada estilo câmara de vigilância, feita com os bonecos SVG.
// Claramente fictícia: tem sempre o aviso de reconstituição.
import { boneco } from './bonecos.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DUR = 12; // segundos por ciclo
const VOADORES = new Set(['gaivota', 'pombo']);

const TXT = {
  pt: { aviso: 'Reconstituição animada · ficção', cam: 'CAM', play: '▶', pausa: '❚❚', min: 'MIN DE ATRASO', falta: 'NÃO FOI' },
  en: { aviso: 'Animated reconstruction · fiction', cam: 'CAM', play: '▶', pausa: '❚❚', min: 'MIN LATE', falta: 'NO-SHOW' },
};
const NOMES = { ribeira: 'RIBEIRA', ponte: 'PONTE D. LUÍS', rua: 'RUA DE SANTA CATARINA', estrada: 'VCI', cafe: 'CAFÉ CENTRAL', casa: 'PRÉDIO · 3.º ESQ', metro: 'METRO · LINHA B', mercado: 'BOLHÃO', supermercado: 'CORREDOR 7' };

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
  estrada: () => `${ceu('#cfe8ff', '#f5fbff')}<path d="M0 230 Q160 190 320 220 T640 210 V360 H0 Z" fill="#8bc34a" stroke="#1d1b4b" stroke-width="3"/><rect y="270" width="640" height="90" fill="#555" stroke="#1d1b4b" stroke-width="3"/><path d="M0 315 h640" stroke="#ffd23f" stroke-width="5" stroke-dasharray="34 26"/>`,
  cafe: () => `${interior('#ffe0b2', '☕ CAFÉ')}<rect x="20" y="200" width="600" height="92" fill="#6d4c41" stroke="#1d1b4b" stroke-width="3"/><rect x="40" y="150" width="60" height="50" fill="#bbb" stroke="#1d1b4b" stroke-width="3"/>`,
  casa: () => `${interior('#d1c4e9', '🛗 3.º ESQ')}<rect x="250" y="120" width="140" height="170" fill="#9e9e9e" stroke="#1d1b4b" stroke-width="3"/><path d="M320 120 V290" stroke="#1d1b4b" stroke-width="3"/>`,
  metro: () => `${interior('#fff3c4', 'METRO · B')}${[30, 190, 350, 510].map(x => `<rect x="${x}" y="120" width="110" height="80" rx="10" fill="#8ecdff" stroke="#1d1b4b" stroke-width="3"/>`).join('')}<path d="M0 230 h640" stroke="#ffd23f" stroke-width="10"/>`,
  mercado: () => `${interior('#c8e6c9', '🧀 BOLHÃO')}${[40, 240, 440].map(x => `<rect x="${x}" y="200" width="160" height="90" fill="#a1887f" stroke="#1d1b4b" stroke-width="3"/><path d="M${x} 200 l20 -30 h120 l20 30" fill="#ef233c" stroke="#1d1b4b" stroke-width="3"/>`).join('')}`,
  supermercado: () => `${interior('#e3f2fd', '🛒 PROMOÇÕES')}${[20, 230, 440].map(x => `<rect x="${x}" y="130" width="180" height="160" fill="#fff" stroke="#1d1b4b" stroke-width="3"/>${[0, 1, 2].map(r => `<path d="M${x} ${170 + r * 40} h180" stroke="#1d1b4b" stroke-width="3"/>`).join('')}<text x="${x + 90}" y="160" font-size="22" font-weight="900" fill="#ef233c" text-anchor="middle" font-family="sans-serif">-50%</text>`).join('')}`,
};

const CSS = `
  .vid { position: relative; aspect-ratio: 16 / 9; width: 100%; border: 3px solid #1d1b4b; border-radius: 16px; overflow: hidden; background: #000; box-shadow: 6px 6px 0 #1d1b4b; }
  .vid .palco { position: absolute; inset: 0; }
  .vid .palco > svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .vid .ator { position: absolute; bottom: 21%; width: 17%; animation-duration: ${DUR}s; animation-iteration-count: infinite; animation-timing-function: linear; }
  .vid .ator svg { width: 100%; height: auto; display: block; }
  .vid .tu { animation-name: v-tu; }
  .vid .culpado { animation-name: v-culpado; }
  .vid .culpado.voa { animation-name: v-voa; }
  .vid .culpado svg, .vid .vira svg { transform: scaleX(-1); }
  .vid .objeto { position: absolute; bottom: 38%; font-size: clamp(1.4rem, 4vw, 2.6rem); animation: v-objeto ${DUR}s linear infinite; }
  .vid .objeto.voa { animation-name: v-objeto-voa; }
  .vid .espanto { position: absolute; bottom: 52%; left: 36%; font-size: clamp(1.6rem, 5vw, 3.2rem); font-weight: 900; color: #ef233c; opacity: 0; animation: v-espanto ${DUR}s linear infinite; font-family: "Baloo 2", sans-serif; }
  .vid .carimbo-v { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: "Baloo 2", sans-serif; font-weight: 800; font-size: clamp(1.6rem, 6vw, 3.6rem); color: #fff; text-shadow: 3px 3px 0 #1d1b4b; opacity: 0; animation: v-fim ${DUR}s linear infinite; }
  @keyframes v-tu { 0% { left: -18%; } 25% { left: 30%; } 55% { left: 30%; transform: none; } 47% { transform: translateX(-6px); } 50% { transform: translateX(6px); } 85% { left: 105%; } 100% { left: 105%; } }
  @keyframes v-culpado { 0% { left: 110%; } 25% { left: 50%; } 55% { left: 50%; } 75% { left: 120%; } 100% { left: 120%; } }
  @keyframes v-voa { 0% { left: 110%; bottom: 45%; } 25% { left: 50%; bottom: 21%; } 55% { left: 50%; bottom: 21%; } 75% { left: 115%; bottom: 80%; } 100% { left: 115%; bottom: 80%; } }
  @keyframes v-objeto { 0%, 28% { left: 42%; opacity: 0; } 30% { left: 42%; opacity: 1; } 42% { left: 54%; opacity: 1; } 55% { left: 54%; } 75% { left: 124%; } 100% { left: 124%; opacity: 0; } }
  @keyframes v-objeto-voa { 0%, 28% { left: 42%; bottom: 38%; opacity: 0; } 30% { left: 42%; bottom: 38%; opacity: 1; } 42% { left: 54%; bottom: 30%; opacity: 1; } 55% { left: 54%; bottom: 30%; } 75% { left: 119%; bottom: 90%; } 100% { left: 119%; bottom: 90%; opacity: 0; } }
  @keyframes v-espanto { 0%, 42% { opacity: 0; transform: scale(.4); } 45% { opacity: 1; transform: scale(1.2); } 60% { opacity: 1; transform: scale(1); } 64%, 100% { opacity: 0; } }
  @keyframes v-fim { 0%, 86% { opacity: 0; transform: scale(2); } 90% { opacity: 1; transform: scale(1) rotate(-6deg); } 100% { opacity: 1; transform: scale(1) rotate(-6deg); } }
  .vid .cctv { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, #0000 0 3px, #0002 3px 4px); }
  .vid .cctv::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 0 80px #000a; }
  .vid .hud { position: absolute; top: 10px; left: 12px; right: 12px; display: flex; justify-content: space-between; font: 700 clamp(.6rem, 1.6vw, .9rem) ui-monospace, Consolas, monospace; color: #fff; text-shadow: 1px 1px 0 #000; }
  .vid .rec::before { content: '●'; color: #ef233c; margin-right: 5px; animation: v-pisca 1s steps(2) infinite; }
  @keyframes v-pisca { 50% { opacity: 0; } }
  .vid .aviso-v { position: absolute; top: 34px; left: 12px; font: 700 clamp(.5rem, 1.3vw, .72rem) system-ui, sans-serif; color: #ffd23f; background: #0008; padding: 2px 6px; border-radius: 4px; }
  .vid .legenda-v { position: absolute; left: 8%; right: 8%; bottom: 11%; text-align: center; font: 700 clamp(.8rem, 2.3vw, 1.25rem) system-ui, sans-serif; color: #fff; }
  .vid .legenda-v span { background: #000b; padding: 3px 10px; border-radius: 6px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
  .vid .barra-v { position: absolute; left: 0; right: 0; bottom: 0; height: 34px; background: linear-gradient(#0000, #000c); display: flex; align-items: center; gap: 10px; padding: 0 12px; }
  .vid .barra-v button { all: unset; cursor: pointer; color: #fff; font-size: 1rem; width: 22px; text-align: center; }
  .vid .prog { flex: 1; height: 5px; background: #fff4; border-radius: 3px; overflow: hidden; }
  .vid .prog i { display: block; height: 100%; width: 100%; background: #ff4f8b; transform-origin: left; animation: v-prog ${DUR}s linear infinite; }
  @keyframes v-prog { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  .vid.pausa .ator, .vid.pausa .objeto, .vid.pausa .espanto, .vid.pausa .carimbo-v, .vid.pausa .prog i, .vid.pausa .bn * { animation-play-state: paused !important; }
`;
function css() {
  if (document.getElementById('vid-css')) return;
  const st = document.createElement('style'); st.id = 'vid-css'; st.textContent = CSS; document.head.appendChild(st);
}

// onde: elemento; opcoes: { lang, personagem, video: {cenario, objeto, legendas}, minutos, fuga }
export function mostrarVideo(onde, { lang = 'pt', personagem = 'gaivota', video = {}, minutos, fuga = false } = {}) {
  css();
  const T = TXT[lang] || TXT.pt;
  const cenario = CENARIOS[video.cenario] ? video.cenario : (VOADORES.has(personagem) ? 'ribeira' : 'rua');
  const legendas = (Array.isArray(video.legendas) && video.legendas.length ? video.legendas : ['...']).slice(0, 4);
  const voa = VOADORES.has(personagem) ? ' voa' : '';
  const fim = fuga ? T.falta : `+${Number(minutos) || '??'} ${T.min}`;
  onde.innerHTML = `
    <div class="vid">
      <div class="palco">
        <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">${CENARIOS[cenario]()}</svg>
        <div class="ator tu">${boneco('tu')}</div>
        <div class="ator culpado${voa}">${boneco(personagem)}</div>
        <div class="objeto${voa}">${esc(video.objeto || '🔑')}</div>
        <div class="espanto">!?</div>
        <div class="carimbo-v">${esc(fim)}</div>
      </div>
      <div class="cctv"></div>
      <div class="hud"><span class="rec">REC</span><span>${esc(T.cam)} 03 · ${esc(NOMES[cenario])}</span><span class="tc">00:00:00</span></div>
      <div class="aviso-v">${esc(T.aviso)}</div>
      <div class="legenda-v"><span></span></div>
      <div class="barra-v"><button type="button" class="pp">${T.pausa}</button><div class="prog"><i></i></div></div>
    </div>`;
  const el = onde.querySelector('.vid'), leg = el.querySelector('.legenda-v span'), tc = el.querySelector('.tc'), pp = el.querySelector('.pp');
  const h0 = new Date();
  let decorrido = 0, ultimo = performance.now(), pausa = false;
  const passo = () => {
    if (!document.body.contains(el)) return; // o vídeo foi substituído
    const agora = performance.now();
    if (!pausa) decorrido += agora - ultimo;
    ultimo = agora;
    const s = (decorrido / 1000) % DUR;
    leg.textContent = legendas[Math.min(legendas.length - 1, Math.floor(s / (DUR / legendas.length)))];
    const h = new Date(h0.getTime() + decorrido);
    tc.textContent = h.toLocaleTimeString('pt-PT', { hour12: false });
    requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
  pp.onclick = () => { pausa = !pausa; el.classList.toggle('pausa', pausa); pp.textContent = pausa ? T.play : T.pausa; };
}
