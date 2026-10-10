// Cronómetro de culpa e Tribunal das Desculpas.

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const espera = ms => new Promise(r => setTimeout(r, ms));

const TXT = {
  pt: {
    cron: '⏱️ Cronómetro de culpa', atraso: 'Atraso total', sem_resposta: 'Sem dar notícias há', perdao: 'Índice de perdão',
    enviado: '✅ Desculpa enviada. O cronómetro parou.',
    avisos: ['Envia já, cada segundo conta.', 'Estás a perder o momento.', 'O silêncio também é uma resposta. E é pior.', 'Neste ponto, só a gaivota te salva.'],
    toques: [['📞', 'Chamada perdida', 1], ['💬', 'Nova mensagem: "???"', 0], ['📞', 'Chamada perdida', 2], ['💬', 'Nova mensagem: "Estás vivo?"', 0], ['📞', 'Chamada perdida', 3], ['🔔', 'Visto por último há 1 minuto', 0]],
    trib: '⚖️ Tribunal das Desculpas', sessao: 'A sessão vai começar. Todos de pé!', delibera: 'a deliberar...',
    passa: 'PASSA', chumba: 'CHUMBA', veredito_passa: '🔨 VEREDITO: A DESCULPA PASSA', veredito_chumba: '🔨 VEREDITO: A DESCULPA CHUMBA',
    erro: 'O tribunal foi adiado por falta de quórum.', nota: 'nota',
    juizes: { avo: ['👵', 'Avó Rosa', 'Juíza do Coração'], gaivota: ['🐦', 'Juíza Gertrudes', 'Gaivota da Ribeira'], chefe: ['👔', 'Dr. Fernandes', 'Juiz dos Factos'] },
  },
  en: {
    cron: '⏱️ Guilt timer', atraso: 'Total delay', sem_resposta: 'No word from you for', perdao: 'Forgiveness index',
    enviado: '✅ Excuse sent. The timer has stopped.',
    avisos: ['Send it now, every second counts.', 'You are missing the moment.', 'Silence is also an answer. A worse one.', 'At this point only the gull can save you.'],
    toques: [['📞', 'Missed call', 1], ['💬', 'New message: "???"', 0], ['📞', 'Missed call', 2], ['💬', 'New message: "Are you alive?"', 0], ['📞', 'Missed call', 3], ['🔔', 'Last seen 1 minute ago', 0]],
    trib: '⚖️ The Court of Excuses', sessao: 'The court is now in session. All rise!', delibera: 'deliberating...',
    passa: 'PASSES', chumba: 'FAILS', veredito_passa: '🔨 VERDICT: THE EXCUSE PASSES', veredito_chumba: '🔨 VERDICT: THE EXCUSE FAILS',
    erro: 'The court was adjourned for lack of quorum.', nota: 'score',
    juizes: { avo: ['👵', 'Granny Rosa', 'Judge of the Heart'], gaivota: ['🐦', 'Judge Gertrudes', 'Gull of the Ribeira'], chefe: ['👔', 'Dr. Fernandes', 'Judge of the Facts'] },
  },
};

const CSS = `
  .cron { margin-top: 16px; padding: 14px 16px; }
  .cron h3 { margin: 0 0 6px; font-size: 1.05rem; }
  .cron .rot { font-size: .8rem; color: var(--mut); font-weight: 700; }
  .cron .relogio { font-size: 2.6rem; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
  .cron .relogio.aflito { color: var(--vermelho); animation: cron-treme .3s linear infinite; }
  @keyframes cron-treme { 25% { transform: translateX(-1px); } 75% { transform: translateX(1px); } }
  .cron .barra { height: 16px; border: 3px solid var(--ink); border-radius: 10px; overflow: hidden; background: #fff; margin: 4px 0 6px; }
  .cron .barra i { display: block; height: 100%; background: linear-gradient(90deg, #ef233c, #ff8c42, #06d6a0); transition: width 1s linear; }
  .cron .aviso { font-size: .85rem; font-weight: 700; min-height: 1.3em; }
  .cron.parado { opacity: .75; }
  #toques { position: fixed; right: 18px; bottom: 18px; z-index: 60; display: flex; flex-direction: column-reverse; gap: 8px; pointer-events: none; }
  .toque { background: #1d1b4b; color: #fff; border-radius: 14px; padding: 10px 14px; font-size: .9rem; font-weight: 700; box-shadow: 0 8px 20px #0005; animation: toque-entra .4s cubic-bezier(.2,1.5,.4,1) both; max-width: 320px; }
  .toque small { display: block; color: #ffd23f; font-size: .72rem; }
  @keyframes toque-entra { from { transform: translateX(120%); } }
  .tribunal { padding: 20px; background: #3b2a1a; color: #fff6e0; border-color: #1d1b4b; background-image: repeating-linear-gradient(90deg, #ffffff08 0 2px, transparent 2px 60px); }
  .tribunal .sessao { text-align: center; font-weight: 800; font-size: 1.1rem; margin-bottom: 14px; color: var(--amarelo); }
  .bancada { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .juiz { background: #fff6e0; color: var(--ink); border: var(--borda); border-radius: 16px; padding: 14px; text-align: center; position: relative; animation: juiz-entra .5s cubic-bezier(.2,1.5,.4,1) both; }
  .juiz:nth-child(2) { animation-delay: .15s; } .juiz:nth-child(3) { animation-delay: .3s; }
  @keyframes juiz-entra { from { transform: translateY(30px); opacity: 0; } }
  .juiz .cara { font-size: 3.4rem; line-height: 1; }
  .juiz .toga { width: 70px; height: 18px; margin: -4px auto 6px; background: #1d1b4b; border-radius: 0 0 30px 30px; }
  .juiz .nome { font-weight: 800; font-size: 1.05rem; }
  .juiz .cargo { font-size: .75rem; color: var(--mut); }
  .juiz .com { font-size: .9rem; margin-top: 8px; min-height: 3.2em; font-style: italic; }
  .juiz .pensa { color: var(--mut); font-style: italic; margin-top: 8px; }
  .juiz .voto { position: absolute; top: 10px; right: -8px; transform: rotate(12deg); font-weight: 800; font-size: 1.1rem; padding: 2px 10px; border: 4px double; border-radius: 8px; background: #fff; animation: voto-carimba .4s cubic-bezier(.2,1.8,.4,1) both; }
  .juiz .voto.passa { color: #06a77d; border-color: #06a77d; }
  .juiz .voto.chumba { color: #ef233c; border-color: #ef233c; }
  .juiz .nota { font-weight: 800; margin-top: 4px; }
  @keyframes voto-carimba { from { transform: rotate(12deg) scale(3); opacity: 0; } }
  .veredito-final { margin-top: 18px; text-align: center; font-size: 1.6rem; font-weight: 800; padding: 12px; border-radius: 14px; animation: voto-carimba .5s cubic-bezier(.2,1.6,.4,1) both; }
  .veredito-final.passa { background: var(--verde); color: var(--ink); }
  .veredito-final.chumba { background: var(--vermelho); color: #fff; }
  .martelo { display: inline-block; animation: martela .35s ease-in 3; transform-origin: bottom right; }
  @keyframes martela { 50% { transform: rotate(-35deg); } }
  @media (max-width: 760px) { .bancada { grid-template-columns: 1fr; } }
`;
function css() {
  if (document.getElementById('extras-css')) return;
  const st = document.createElement('style'); st.id = 'extras-css'; st.textContent = CSS; document.head.appendChild(st);
}

/* ---------- Cronómetro de culpa ---------- */
let cron = null;

// onde: elemento onde o cartão é inserido; o perdão começa na credibilidade e cai com o tempo
export function iniciarCronometro({ onde, lang, tipo, minutos, credibilidade, destinatario }) {
  css(); pararCronometro(true);
  const T = TXT[lang] || TXT.pt;
  const el = document.createElement('div');
  el.className = 'cron card'; el.id = 'cron';
  el.innerHTML = `<h3>${esc(T.cron)}</h3>
    <div class="rot">${esc(tipo === 'fuga' ? T.sem_resposta : T.atraso)}</div>
    <div class="relogio" id="cron-rel">0:00</div>
    <div class="rot">${esc(T.perdao)} <b id="cron-pct"></b></div>
    <div class="barra"><i id="cron-bar"></i></div>
    <div class="aviso" id="cron-aviso"></div>`;
  onde.appendChild(el);
  if (!document.getElementById('toques')) document.body.insertAdjacentHTML('beforeend', '<div id="toques"></div>');
  const base = tipo === 'fuga' ? 0 : (Number(minutos) || 0) * 60;
  const inicio = Date.now(), perdao0 = Math.max(5, Number(credibilidade) || 0);
  let toque = 0;
  const tique = () => {
    const s = Math.floor((Date.now() - inicio) / 1000), total = base + s;
    document.getElementById('cron-rel').textContent = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
    const perdao = Math.max(0, Math.round(perdao0 * Math.exp(-s / 90)));
    document.getElementById('cron-pct').textContent = `${perdao}%`;
    document.getElementById('cron-bar').style.width = `${perdao}%`;
    document.getElementById('cron-aviso').textContent = T.avisos[Math.min(T.avisos.length - 1, Math.floor(s / 20))];
    document.getElementById('cron-rel').classList.toggle('aflito', s > 45);
    // notificações a cair: a cada 15 s, a pessoa insiste
    if (s > 0 && s % 15 === 0 && toque < T.toques.length) {
      const [ico, txt, n] = T.toques[toque++];
      const caixa = document.getElementById('toques');
      caixa.insertAdjacentHTML('beforeend', `<div class="toque">${ico} ${esc(txt)}${n ? ` (${n})` : ''}<small>${esc(destinatario)}</small></div>`);
      while (caixa.children.length > 3) caixa.firstElementChild.remove();
    }
  };
  tique();
  cron = { timer: setInterval(tique, 1000), el, T };
}

// remover = true apaga o cartão (nova investigação); senão marca como enviado
export function pararCronometro(remover = false) {
  if (!cron) return;
  clearInterval(cron.timer);
  document.getElementById('toques')?.replaceChildren();
  if (remover) cron.el.remove();
  else { cron.el.classList.add('parado'); cron.el.querySelector('#cron-rel').classList.remove('aflito'); cron.el.querySelector('#cron-aviso').textContent = cron.T.enviado; }
  cron = null;
}

/* ---------- Tribunal das Desculpas ---------- */
export async function abrirTribunal({ onde, lang, resultado }) {
  css();
  const T = TXT[lang] || TXT.pt;
  onde.innerHTML = `<h2>${esc(T.trib)}</h2>
    <div class="tribunal card">
      <div class="sessao">${esc(T.sessao)}</div>
      <div class="bancada">${Object.entries(T.juizes).map(([id, [cara, nome, cargo]]) => `
        <div class="juiz" id="juiz-${id}">
          <div class="cara">${cara}</div><div class="toga"></div>
          <div class="nome">${esc(nome)}</div><div class="cargo">${esc(cargo)}</div>
          <div class="pensa">${esc(T.delibera)}</div>
        </div>`).join('')}</div>
      <div id="veredito-final"></div>
    </div>`;
  onde.classList.remove('hidden');
  onde.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const [resp] = await Promise.all([
    fetch('/tribunal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lang, mensagem: resultado.mensagem, credibilidade: resultado.credibilidade, modo_desespero: resultado.modo_desespero,
        desculpa: resultado.desculpa_absurda?.titulo, provas: (resultado.provas || []).map(p => `${p.titulo}: ${p.detalhe} (${p.fonte})`),
      }),
    }).then(r => r.json()).catch(e => ({ erro: e.message })),
    espera(1500),
  ]);
  if (!resp.votos) { document.getElementById('veredito-final').innerHTML = `<div class="veredito-final chumba">${esc(T.erro)}</div>`; return; }

  // os votos aparecem um a um, com suspense
  for (const v of resp.votos) {
    const el = document.getElementById(`juiz-${v.id}`); if (!el) continue;
    await espera(1300);
    el.querySelector('.pensa').outerHTML = `<div class="com">“${esc(v.comentario)}”</div><div class="nota">${esc(T.nota)}: ${v.nota}/10</div>`;
    el.insertAdjacentHTML('beforeend', `<div class="voto ${v.voto}">${esc(T[v.voto])}</div>`);
  }
  await espera(1200);
  const sim = resp.votos.filter(v => v.voto === 'passa').length, passa = sim >= 2;
  document.getElementById('veredito-final').innerHTML =
    `<div class="veredito-final ${passa ? 'passa' : 'chumba'}"><span class="martelo">🔨</span> ${esc((passa ? T.veredito_passa : T.veredito_chumba).replace('🔨 ', ''))} (${sim}-${resp.votos.length - sim})</div>`;
}
