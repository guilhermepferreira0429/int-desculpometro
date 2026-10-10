// Bico Messenger: simulação animada do envio da desculpa, com o destinatário a responder (outra chamada à IA).
// App inventada e genérica: sem logótipos nem cores de apps de mensagens reais.

import { mostrarVideo } from './video.js';

const TXT = {
  pt: {
    app: 'Bico Messenger', online: 'online', escrever: 'a escrever...', mensagem: 'Mensagem', hoje: 'HOJE',
    abrir: 'toca para abrir', fechar: 'Fechar', repetir: '↻ Repetir', erro: 'Sem rede. A pessoa ficou sem saber de nada.',
    aviso: 'Diário do Bico, jornal oficial das gaivotas do Porto · publicação fictícia', exclusivo: 'EXCLUSIVO',
    desfecho: { acredita: '✅ Acreditou!', desiste: '🏳️ Desistiu de discutir', quer_falar: '📞 Quer falar diretamente com a personagem', confirmado: '✅ O culpado confirmou. Caso encerrado.' },
    entrou: 'entrou na conversa', visto: 'visto por último agora', enviando: 'a enviar desculpa...',
    entrevista: 'Entrevista exclusiva',
  },
  en: {
    app: 'Bico Messenger', online: 'online', escrever: 'typing...', mensagem: 'Message', hoje: 'TODAY',
    abrir: 'tap to open', fechar: 'Close', repetir: '↻ Replay', erro: 'No signal. They never found out.',
    aviso: 'Diário do Bico (The Beak Gazette), official newspaper of the seagulls of Porto · fictional publication', exclusivo: 'EXCLUSIVE',
    desfecho: { acredita: '✅ They bought it!', desiste: '🏳️ They gave up arguing', quer_falar: '📞 They demand to speak to the culprit directly', confirmado: '✅ The culprit confirmed it. Case closed.' },
    entrou: 'joined the chat', visto: 'last seen just now', enviando: 'sending excuse...',
    entrevista: 'Exclusive interview',
  },
};

const CSS = `
  #bm-fundo { position:fixed; inset:0; background:#1d1b4bcc; z-index:100; display:flex; align-items:center; justify-content:center; animation: bm-in .3s both; }
  @keyframes bm-in { from { opacity:0; } }
  .bm-tel { position:relative; width: 380px; height: min(760px, 94vh); background:#111; border-radius: 46px; padding: 12px; box-shadow: 0 30px 80px #000a, inset 0 0 0 3px #333; animation: bm-sobe .5s cubic-bezier(.2,1.3,.4,1) both; }
  @keyframes bm-sobe { from { transform: translateY(60px) scale(.9); } }
  .bm-ecra { position:relative; height:100%; border-radius: 36px; overflow:hidden; background:#f1ede4; display:flex; flex-direction:column; font-family: system-ui, "Segoe UI", sans-serif; }
  .bm-notch { position:absolute; top:8px; left:50%; transform:translateX(-50%); width:110px; height:26px; background:#111; border-radius: 20px; z-index:5; }
  .bm-status { display:flex; justify-content:space-between; padding: 12px 26px 4px; font-size:.75rem; font-weight:700; color:#fff; background:#5b4b8a; }
  .bm-topo { display:flex; align-items:center; gap:10px; padding: 8px 12px 10px; background:#5b4b8a; color:#fff; }
  .bm-av { width:40px; height:40px; border-radius:50%; background:#ffd23f; display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex:none; }
  .bm-nome { font-weight:700; font-size:1rem; line-height:1.1; }
  .bm-sub { font-size:.75rem; opacity:.85; }
  .bm-marca { margin-left:auto; font-size:.65rem; font-weight:800; letter-spacing:1px; background:#fff3; padding:2px 8px; border-radius:99px; }
  .bm-chat { flex:1; overflow-y:auto; padding: 12px 10px; display:flex; flex-direction:column; gap:6px; scroll-behavior:smooth;
             background-image: radial-gradient(#5b4b8a1a 1.5px, transparent 1.5px); background-size: 18px 18px; }
  .bm-chat > * { flex-shrink: 0; }
  .bm-chat { scrollbar-width: none; } .bm-chat::-webkit-scrollbar { display: none; }
  .bm-dia { align-self:center; font-size:.68rem; font-weight:700; background:#fff; color:#666; padding: 3px 10px; border-radius: 8px; margin-bottom: 6px; }
  .bm-b { max-width: 82%; padding: 7px 10px 18px; border-radius: 14px; font-size:.9rem; line-height:1.35; position:relative; box-shadow: 0 1px 1px #0002; animation: bm-pop .3s cubic-bezier(.2,1.5,.4,1) both; white-space: pre-wrap; word-wrap: break-word; }
  @keyframes bm-pop { from { transform: scale(.6); opacity:0; } }
  .bm-eu { align-self:flex-end; background:#ffe680; border-bottom-right-radius: 4px; transform-origin: bottom right; }
  .bm-ele { align-self:flex-start; background:#fff; border-bottom-left-radius: 4px; transform-origin: bottom left; }
  .bm-autor { display:block; font-size:.72rem; font-weight:800; color:#8338ec; margin-bottom:2px; }
  .bm-hora { position:absolute; right:8px; bottom:3px; font-size:.62rem; color:#777; }
  .bm-vistos { margin-left:3px; letter-spacing:-3px; }
  .bm-vistos.lido { color:#ff4f8b; font-weight:800; }
  .bm-escrevendo { align-self:flex-start; background:#fff; border-radius:14px; padding: 10px 14px; display:flex; gap:4px; animation: bm-pop .3s both; }
  .bm-escrevendo i { width:7px; height:7px; border-radius:50%; background:#999; animation: bm-ponto 1s infinite; }
  .bm-escrevendo i:nth-child(2) { animation-delay:.15s; } .bm-escrevendo i:nth-child(3) { animation-delay:.3s; }
  @keyframes bm-ponto { 30% { transform: translateY(-5px); background:#5b4b8a; } }
  .bm-link { cursor:pointer; padding: 0 0 18px; overflow:hidden; max-width: 86%; }
  .bm-link .bm-prev { background:#f4efe1; border-bottom: 2px solid #d10f1f; padding: 8px 10px; font-family: Georgia, serif; }
  .bm-link .bm-prev b { display:block; font-family: Impact, "Arial Black", sans-serif; color:#d10f1f; font-size:1rem; text-transform:uppercase; }
  .bm-link .bm-prev span { font-size:.8rem; color:#222; }
  .bm-link .bm-url { padding: 5px 10px 0; font-size:.78rem; color:#3a5bd9; text-decoration: underline; }
  .bm-link .bm-toca { padding: 0 10px; font-size:.65rem; color:#999; }
  .bm-link.pulsa { animation: bm-pop .3s both, bm-pulsa 1s 0.4s ease-in-out infinite; }
  @keyframes bm-pulsa { 50% { box-shadow: 0 0 0 6px #ff4f8b66; } }
  .bm-barra { display:flex; gap:8px; align-items:center; padding: 8px 10px 14px; background:#f1ede4; }
  .bm-campo { flex:1; background:#fff; border-radius: 20px; padding: 9px 14px; font-size:.85rem; color:#999; }
  .bm-enviar { width:40px; height:40px; border-radius:50%; background:#5b4b8a; color:#fff; display:flex; align-items:center; justify-content:center; }
  .bm-nav { position:absolute; inset: 0; background:#fff; z-index:4; display:flex; flex-direction:column; transform: translateY(100%); transition: transform .45s cubic-bezier(.2,1,.3,1); }
  .bm-nav.aberto { transform: translateY(0); }
  .bm-urlbar { display:flex; align-items:center; gap:8px; padding: 40px 12px 8px; background:#eee; font-size:.8rem; color:#333; }
  .bm-urlbar .x { cursor:pointer; font-weight:800; }
  .bm-urlbar .u { flex:1; background:#fff; border-radius: 10px; padding: 6px 10px; }
  .bm-pag { flex:1; overflow-y:auto; padding: 12px 16px 30px; background:#f4efe1; color:#111; font-family: Georgia, serif; scroll-behavior: smooth; }
  .bm-pag .av { font-family: system-ui, sans-serif; font-size:.55rem; text-transform:uppercase; letter-spacing:1px; text-align:center; border-bottom:1px solid #111; padding-bottom:4px; }
  .bm-pag .tit { font-family: Impact, "Arial Black", sans-serif; font-size: 2rem; color:#d10f1f; text-align:center; text-transform:uppercase; border-bottom: 5px double #111; }
  .bm-pag .exc { display:inline-block; margin-top:10px; background:#d10f1f; color:#fff; font-family: system-ui, sans-serif; font-size:.65rem; font-weight:800; letter-spacing:2px; padding: 2px 8px; }
  .bm-pag .man { font-family: Impact, "Arial Black", sans-serif; font-size: 1.5rem; line-height:1.05; margin: 6px 0; text-transform:uppercase; }
  .bm-pag .lead { font-style: italic; font-size:.9rem; }
  .bm-pag .foto { background:#d8d1bd; border: 2px solid #111; height: 120px; display:flex; align-items:center; justify-content:center; font-size: 4rem; margin: 10px 0; }
  .bm-pag .foto svg { width: 150px; height: 112px; }
  .bm-pag .video-bm { margin: 10px 0; }
  .bm-pag h4 { font-family: system-ui, sans-serif; margin: 12px 0 4px; font-size:.85rem; text-transform: uppercase; }
  .bm-pag .p { font-weight:700; font-size:.85rem; margin: 8px 0 2px; }
  .bm-pag .r { font-size:.85rem; margin:0; padding-left: 8px; border-left: 3px solid #d10f1f; }
  .bm-fim { position:absolute; left:12px; right:12px; bottom: 70px; z-index:3; background:#1d1b4b; color:#ffd23f; border-radius: 16px; padding: 14px; text-align:center; font-weight:800; font-size:1.05rem; animation: bm-carimbo .5s cubic-bezier(.2,1.8,.4,1) both; box-shadow: 0 8px 20px #0006; }
  @keyframes bm-carimbo { from { transform: scale(2.4) rotate(-6deg); opacity:0; } }
  .bm-fim .acoes { display:flex; gap:8px; justify-content:center; margin-top:10px; }
  .bm-fim button { font-size:.85rem; padding: 6px 14px; }
  .bm-tel::before, .bm-tel::after { content:''; position:absolute; left:-5px; width:5px; border-radius:3px 0 0 3px; background:#2a2a2a; }
  .bm-tel::before { top:130px; height:46px; box-shadow: 0 60px 0 #2a2a2a; }
  .bm-tel::after { top:110px; left:auto; right:-5px; height:70px; border-radius:0 3px 3px 0; }
  .bm-tel { background: linear-gradient(145deg, #2b2b2b, #0d0d0d 60%); }
  .bm-ecra::after { content:''; position:absolute; inset:0; border-radius:36px; pointer-events:none; background: linear-gradient(120deg, #ffffff14 0 18%, transparent 30%); z-index:7; }
  .bm-notch { width: 96px; height: 28px; top: 10px; }
  .bm-status { padding: 14px 24px 4px; align-items:center; }
  .bm-status svg { height: 11px; margin-left: 4px; fill: #fff; }
  .bm-chat { background-color:#f1ede4; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%235b4b8a' stroke-opacity='.10' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M14 28 q8 -10 16 0 q8 -10 16 0'/%3E%3Ccircle cx='86' cy='22' r='7'/%3E%3Cpath d='M86 29 v14 m0 -6 h6 m-6 4 h4'/%3E%3Crect x='20' y='76' width='26' height='18' rx='5'/%3E%3Cpath d='M20 82 h26 M33 70 l0 6'/%3E%3Cpath d='M78 84 q10 -14 22 0 q-11 12 -22 0 z'/%3E%3C/g%3E%3C/svg%3E"); background-size: 120px 120px; }
  .bm-b.cauda.bm-eu::after, .bm-b.cauda.bm-ele::after { content:''; position:absolute; bottom:0; width:12px; height:14px; }
  .bm-b.cauda.bm-eu::after { right:-6px; background: radial-gradient(circle at 0 0, transparent 11px, #ffe680 12px); }
  .bm-b.cauda.bm-ele::after { left:-6px; background: radial-gradient(circle at 100% 0, transparent 11px, #fff 12px); }
  .bm-b.cauda.bm-eu { border-bottom-right-radius: 2px; } .bm-b.cauda.bm-ele { border-bottom-left-radius: 2px; }
  .bm-b:not(.cauda).bm-eu, .bm-b:not(.cauda).bm-ele { border-radius: 14px; }
  .bm-campo.escreve { color:#222; white-space:nowrap; overflow:hidden; direction:rtl; text-align:left; }
  .bm-campo.escreve span { direction:ltr; unicode-bidi: plaintext; }
  .bm-campo.escreve::after { content:'|'; color:#5b4b8a; animation: bm-cursor .6s steps(2) infinite; }
  @keyframes bm-cursor { 50% { opacity:0; } }
  .bm-enviar.carrega { animation: bm-carrega .35s ease-out; }
  @keyframes bm-carrega { 40% { transform: scale(.8) rotate(-20deg); } 100% { transform: scale(1); } }
  .bm-reacao { position:absolute; bottom:-12px; left:-10px; background:#fff; border-radius: 99px; padding: 0 6px; font-size: .9rem; box-shadow: 0 1px 3px #0003; animation: bm-pop .35s cubic-bezier(.2,1.8,.4,1) both; }
  .bm-b.tem-reacao { margin-bottom: 10px; }
  .bm-sistema { align-self:center; background:#5b4b8a22; color:#4a3d75; font-size:.75rem; font-weight:700; padding: 4px 12px; border-radius: 99px; animation: bm-pop .3s both; }
  .bm-linha-av { display:flex; gap:6px; align-items:flex-end; align-self:flex-start; max-width: 88%; }
  .bm-linha-av .bm-b { max-width: none; }
  .bm-mini { width: 30px; height: 30px; flex:none; border-radius: 50%; background:#ffd23f; overflow:hidden; display:flex; align-items:center; justify-content:center; border: 2px solid #5b4b8a; }
  .bm-mini svg { width: 34px; height: 40px; margin-top: 8px; }
  .bm-autor.culpado { color:#ef233c; }
  .bm-fim { bottom: auto; top: 50%; transform: translateY(-50%); padding: 22px 16px 16px; border: 3px solid #ffd23f; }
  .bm-fim .grande { display:block; font-size: 3.2rem; line-height: 1; margin-bottom: 8px; }
  @keyframes bm-carimbo { from { transform: translateY(-50%) scale(2.4) rotate(-6deg); opacity:0; } to { transform: translateY(-50%); } }
  .bm-notif { position:absolute; top: 44px; left: 10px; right: 10px; z-index: 8; background: #ffffffee; color:#222; border-radius: 16px; padding: 8px 12px; display:flex; gap: 10px; align-items:center; box-shadow: 0 6px 20px #0004; font-size: .8rem; animation: bm-notif 1.6s ease-in-out both; }
  .bm-notif b { display:block; font-size:.72rem; color:#5b4b8a; }
  .bm-notif .ic { width: 30px; height: 30px; border-radius: 8px; background:#5b4b8a; color:#fff; display:flex; align-items:center; justify-content:center; }
  @keyframes bm-notif { 0% { transform: translateY(-120%); } 15%, 75% { transform: translateY(0); } 100% { transform: translateY(-140%); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .bm-notif, .bm-fim, .bm-reacao { animation: none; } }
  .bm-fechar { position:absolute; top:-14px; right:-14px; width:40px; height:40px; border-radius:50%; background:#ff4f8b; color:#fff; border: 3px solid #1d1b4b; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; box-shadow:none; z-index:6; }
`;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const espera = ms => new Promise(r => setTimeout(r, ms));
const hora = () => new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

let corrida = 0;

// Divide a mensagem em até 3 bolhas, pelas frases
function partir(texto) {
  const frases = texto.split(/(?<=[.!?…])\s+/).filter(Boolean);
  if (texto.length < 140 || frases.length < 2) return [texto];
  const n = Math.min(3, frases.length), alvo = texto.length / n, out = [];
  let atual = '';
  for (const f of frases) {
    if (atual && (atual.length + f.length) > alvo * 1.15 && out.length < n - 1) { out.push(atual); atual = f; }
    else atual = atual ? atual + ' ' + f : f;
  }
  if (atual) out.push(atual);
  return out;
} // cada abertura tem um id; se o utilizador fechar, a sequência antiga pára

// dados: { lang, resultado (JSON do agente), pedido (o que foi enviado ao agente), destinatario (rótulo), destinatario_id, emoji, gaivotaSVG, fotoHTML }
export function abrirMessenger(dados) {
  if (!document.getElementById('bm-css')) {
    const st = document.createElement('style'); st.id = 'bm-css'; st.textContent = CSS; document.head.appendChild(st);
  }
  fecharMessenger();
  const id = ++corrida;
  const T = TXT[dados.lang] || TXT.pt;
  const fundo = document.createElement('div');
  fundo.id = 'bm-fundo';
  fundo.innerHTML = `
    <div class="bm-tel">
      <button class="bm-fechar" title="${esc(T.fechar)}">✕</button>
      <div class="bm-ecra">
        <div class="bm-notch"></div>
        <div class="bm-status"><span>${hora()}</span><span></span><span><svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 16 12"><path d="M8 11.5 L5.5 8.6 a3.6 3.6 0 0 1 5 0 Z M2.6 5.8 a7.6 7.6 0 0 1 10.8 0 l-1.5 1.6 a5.5 5.5 0 0 0 -7.8 0 Z M0 3 a11.3 11.3 0 0 1 16 0 l-1.4 1.5 a9.2 9.2 0 0 0 -13.2 0 Z"/></svg><svg viewBox="0 0 26 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="#fff"/><rect x="2" y="2" width="15" height="8" rx="2"/><rect x="23.5" y="4" width="2" height="4" rx="1"/></svg></span></div>
        <div class="bm-topo">
          <span>‹</span>
          <div class="bm-av">${esc(dados.emoji || '🙂')}</div>
          <div><div class="bm-nome" id="bm-nome">${esc(dados.destinatario)}</div><div class="bm-sub" id="bm-sub">${esc(T.online)}</div></div>
          <span class="bm-marca">🐦 BICO</span>
        </div>
        <div class="bm-notif"><div class="ic">🐦</div><div><b>${esc(T.app)}</b>${esc(T.enviando)}</div></div>
        <div class="bm-chat" id="bm-chat"><div class="bm-dia">${esc(T.hoje)}</div></div>
        <div class="bm-barra"><div class="bm-campo" id="bm-campo">${esc(T.mensagem)}</div><div class="bm-enviar" id="bm-enviar">➤</div></div>
        <div class="bm-nav" id="bm-nav"></div>
      </div>
    </div>`;
  document.body.appendChild(fundo);
  fundo.querySelector('.bm-fechar').onclick = fecharMessenger;
  fundo.addEventListener('click', e => { if (e.target === fundo) fecharMessenger(); });
  correr(id, dados, T);
}

export function fecharMessenger() { corrida++; document.getElementById('bm-fundo')?.remove(); }

async function correr(id, dados, T) {
  const vivo = () => id === corrida;
  const chat = document.getElementById('bm-chat');
  const rolar = () => { chat.scrollTop = chat.scrollHeight; };
  const sub = txt => { const s = document.getElementById('bm-sub'); if (s) s.textContent = txt; };
  const bolha = (quem, html, antes = '') => {
    const lado = quem === 'eu' ? 'bm-eu' : 'bm-ele';
    const ult = chat.lastElementChild;
    if (ult?.classList?.contains(lado)) ult.classList.remove('cauda');
    if (antes) { chat.insertAdjacentHTML('beforeend', `<div class="bm-linha-av">${antes}<div class="bm-b ${lado} cauda">${html}</div></div>`); rolar(); return chat.lastElementChild.lastElementChild; }
    chat.insertAdjacentHTML('beforeend', `<div class="bm-b ${lado} cauda">${html}</div>`);
    rolar(); return chat.lastElementChild;
  };
  // o texto é escrito letra a letra no campo de baixo antes de ser enviado
  const escrever = async texto => {
    const campo = document.getElementById('bm-campo'), btn = document.getElementById('bm-enviar');
    if (!campo) return;
    campo.classList.add('escreve');
    const passos = Math.min(texto.length, 40), t0 = performance.now(), dur = Math.min(1200, 300 + texto.length * 12);
    for (let k = 1; k <= passos && vivo(); k++) {
      campo.innerHTML = `<span>${esc(texto.slice(0, Math.ceil(texto.length * k / passos)))}</span>`;
      await espera(dur / passos);
    }
    btn.classList.remove('carrega'); void btn.offsetWidth; btn.classList.add('carrega');
    await espera(250);
    campo.classList.remove('escreve'); campo.textContent = T.mensagem;
  };
  const daPessoa = async lista => {
    for (const m of lista || []) {
      if (!vivo()) return;
      sub(T.escrever);
      chat.insertAdjacentHTML('beforeend', '<div class="bm-escrevendo"><i></i><i></i><i></i></div>'); rolar();
      await espera(900 + Math.min(1600, (m.texto || '').length * 18));
      chat.querySelector('.bm-escrevendo')?.remove();
      if (!vivo()) return;
      sub(T.online);
      bolha('ele', `${m.autor ? `<span class="bm-autor">${esc(m.autor)}</span>` : ''}${esc(m.texto)}<span class="bm-hora">${hora()}</span>`);
      await espera(700);
    }
  };
  const minha = async (html, texto) => {
    if (texto) await escrever(texto);
    const el = bolha('eu', `${html}<span class="bm-hora">${hora()} <span class="bm-vistos">🕓</span></span>`);
    const v = el.querySelector('.bm-vistos');
    setTimeout(() => { v.textContent = '✓'; }, 500);
    setTimeout(() => { v.textContent = '✓✓'; }, 1000);
    await espera(650);
    return { el, lido: () => { v.classList.add('lido'); } };
  };

  // 1. a mensagem vai e é lida; ao mesmo tempo, pede à IA a resposta do destinatário
  const r = dados.resultado;
  const pedidoConversa = r._conversa ? Promise.resolve(r._conversa) : fetch('/conversa', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lang: dados.lang, destinatario: dados.destinatario, destinatario_id: dados.destinatario_id,
      mensagem: r.mensagem, credibilidade: r.credibilidade, modo_desespero: r.modo_desespero,
      desculpa: r.desculpa_absurda?.titulo, personagem: r.desculpa_absurda?.personagem,
      entrevista: r.entrevista ? JSON.stringify(r.entrevista).slice(0, 1500) : '', culpado_nome: r.entrevista?.entrevistada || '',
    }),
  }).then(x => x.json()).catch(e => ({ erro: e.message }));

  // a desculpa vai em 2 ou 3 bolhas curtas, como se escreve no telemóvel
  const bolhas = partir(r.mensagem || '');
  const enviadas = [];
  await espera(1300); // a notificação de envio
  for (const b of bolhas) { enviadas.push(await minha(esc(b), b)); if (!vivo()) return; }
  await espera(900); if (!vivo()) return;
  enviadas.forEach(m => m.lido());

  // 2. "a escrever..." enquanto a IA pensa
  sub(T.escrever);
  chat.insertAdjacentHTML('beforeend', '<div class="bm-escrevendo"><i></i><i></i><i></i></div>'); rolar();
  const [conversa] = await Promise.all([pedidoConversa, espera(2200)]);
  chat.querySelector('.bm-escrevendo')?.remove();
  if (!vivo()) return;
  if (!conversa || conversa.erro) { sub(T.online); bolha('ele', `⚠️ ${esc(T.erro)}`); return fim(null); }
  if (conversa.nome_contacto) document.getElementById('bm-nome').textContent = conversa.nome_contacto;
  const ultimaMinha = enviadas[enviadas.length - 1]?.el;
  if (ultimaMinha) { ultimaMinha.classList.add('tem-reacao'); ultimaMinha.insertAdjacentHTML('beforeend', `<span class="bm-reacao">${esc(conversa.reacao || (conversa.duvida ? '🤨' : '👍'))}</span>`); }

  // 3. primeira reação, no estilo da pessoa
  await daPessoa(conversa.resposta1);
  if (!vivo()) return;

  // 4 a 6. se duvida: link para o Diário do Bico, página dentro da app e nova reação
  if (conversa.duvida) {
    await espera(900); if (!vivo()) return;
    if (conversa.texto_link) { const m = await minha(esc(conversa.texto_link), conversa.texto_link); m.lido(); }
    const manchete = r.diario_do_bico?.manchete || conversa.noticia_link?.manchete || '';
    const link = await minha(`<div class="bm-prev"><b>Diário do Bico</b><span>${esc(manchete)}</span></div><div class="bm-url">diariodobico.pt/exclusivo</div><div class="bm-toca">${esc(T.abrir)}</div>`);
    link.el.classList.add('bm-link', 'pulsa');
    await espera(500); link.lido();
    // abre ao toque, ou sozinho ao fim de 3,5 s para a demo não parar
    await Promise.race([new Promise(res => link.el.addEventListener('click', res, { once: true })), espera(3500)]);
    if (!vivo()) return;
    link.el.classList.remove('pulsa');
    await abrirPagina(dados, conversa, T, vivo);
    if (!vivo()) return;
    await espera(600);
    await daPessoa(conversa.reacao_link);
  }
  let desfecho = conversa.desfecho || 'acredita';
  if (vivo() && desfecho === 'quer_falar' && conversa.culpado?.mensagens?.length) {
    await espera(900); if (!vivo()) return;
    const nome = conversa.culpado.nome || r.desculpa_absurda?.personagem || '?';
    chat.insertAdjacentHTML('beforeend', `<div class="bm-sistema">${esc(nome)} ${esc(T.entrou)}</div>`); rolar();
    await espera(900);
    const av = `<div class="bm-mini">${dados.fotoHTML || dados.gaivotaSVG(40)}</div>`;
    for (const m of conversa.culpado.mensagens) {
      if (!vivo()) return;
      sub(T.escrever);
      chat.insertAdjacentHTML('beforeend', '<div class="bm-escrevendo"><i></i><i></i><i></i></div>'); rolar();
      await espera(900 + Math.min(1400, (m.texto || '').length * 16));
      chat.querySelector('.bm-escrevendo')?.remove();
      sub(T.online);
      bolha('ele', `<span class="bm-autor culpado">${esc(nome)}</span>${esc(m.texto)}<span class="bm-hora">${hora()}</span>`, av);
      await espera(700);
    }
    await daPessoa(conversa.reacao_final);
    desfecho = 'confirmado';
  }
  sub(T.visto);
  if (vivo()) fim(desfecho);

  function fim(desfecho) {
    const ecra = document.querySelector('.bm-ecra'); if (!ecra) return;
    const txt = desfecho ? T.desfecho[desfecho] || desfecho : '📵', [emo, ...resto] = [...txt.split(' ')];
    ecra.insertAdjacentHTML('beforeend', `<div class="bm-fim"><span class="grande">${esc(emo)}</span>${esc(resto.join(' '))}
      <div class="acoes"><button class="bm-rep">${esc(T.repetir)}</button><button class="bm-x">${esc(T.fechar)}</button></div></div>`);
    ecra.querySelector('.bm-rep').onclick = () => abrirMessenger(dados);
    ecra.querySelector('.bm-x').onclick = fecharMessenger;
  }
}

// Página do Diário do Bico dentro do browser da app: abre, desce devagar e fecha sozinha
async function abrirPagina(dados, conversa, T, vivo) {
  const r = dados.resultado, j = r.diario_do_bico, e = r.entrevista;
  const nav = document.getElementById('bm-nav');
  const foto = dados.fotoHTML || dados.gaivotaSVG(150);
  nav.innerHTML = `
    <div class="bm-urlbar"><span class="x">✕</span><span class="u">diariodobico.pt/exclusivo</span></div>
    <div class="bm-pag" id="bm-pag">
      <div class="av">${esc(T.aviso)}</div>
      <div class="tit">Diário do Bico</div>
      <span class="exc">${esc(T.exclusivo)}</span>
      <div class="man">${esc(j?.manchete || conversa.noticia_link?.manchete || '')}</div>
      <p class="lead">${esc(j?.lead || conversa.noticia_link?.lead || '')}</p>
      <div class="foto" id="bm-foto">${foto}</div>
      ${e ? `<h4>${esc(T.entrevista)}: ${esc(e.entrevistada)}</h4>${(e.perguntas || []).slice(0, 4).map(q => `<div class="p">— ${esc(q.p)}</div><p class="r">${esc(q.r)}</p>`).join('')}` : ''}
      ${!e && j?.corpo ? j.corpo.map(p => `<p>${esc(p)}</p>`).join('') : ''}
    </div>`;
  if (dados.videoOpcoes) { const fv = document.getElementById('bm-foto'); fv.className = 'video-bm'; mostrarVideo(fv, dados.videoOpcoes); }
  let fechada = false;
  const fechar = () => { fechada = true; nav.classList.remove('aberto'); };
  nav.querySelector('.x').onclick = fechar;
  await espera(50); nav.classList.add('aberto');
  const pag = document.getElementById('bm-pag');
  for (let i = 0; i < 12 && !fechada && vivo(); i++) { await espera(500); pag.scrollTop += 70; }
  if (!fechada) fechar();
  await espera(500);
}
