// Bonecos SVG animados das personagens, no mesmo traço da gaivota (contorno escuro grosso, cores planas).
// boneco(id) devolve o SVG; o CSS das animações é injetado uma vez.

const INK = '#1d1b4b';
const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

const CSS = `
  .bn { overflow: visible; }
  .bn * { transform-box: view-box; }
  .bn .pa { animation: bn-passo .45s ease-in-out infinite alternate; }
  .bn .pb { animation: bn-passo .45s ease-in-out infinite alternate-reverse; }
  @keyframes bn-passo { from { transform: rotate(-20deg); } to { transform: rotate(20deg); } }
  .bn .ba { animation: bn-braco .45s ease-in-out infinite alternate-reverse; }
  .bn .bb { animation: bn-braco .45s ease-in-out infinite alternate; }
  @keyframes bn-braco { from { transform: rotate(-28deg); } to { transform: rotate(28deg); } }
  .bn .acena { animation: bn-acena .35s ease-in-out infinite alternate; }
  @keyframes bn-acena { from { transform: rotate(-150deg); } to { transform: rotate(-110deg); } }
  .bn .corpo { animation: bn-salta .225s ease-in-out infinite alternate; }
  @keyframes bn-salta { to { transform: translateY(-3px); } }
  .bn .cauda { animation: bn-abana .3s ease-in-out infinite alternate; }
  @keyframes bn-abana { from { transform: rotate(-18deg); } to { transform: rotate(22deg); } }
  .bn .roda { animation: bn-gira .6s linear infinite; }
  @keyframes bn-gira { to { transform: rotate(360deg); } }
  .bn .bica { animation: bn-bica .45s ease-in-out infinite alternate; }
  @keyframes bn-bica { to { transform: translate(5px, 3px); } }
  .bn .olhos { animation: bn-pisca 3.2s infinite; transform-box: fill-box; transform-origin: center; }
  @keyframes bn-pisca { 0%, 93%, 100% { transform: scaleY(1); } 96% { transform: scaleY(.1); } }
  .bn .asa-b { animation: bn-asa .28s ease-in-out infinite alternate; }
  @keyframes bn-asa { to { transform: rotate(-35deg); } }
  .bn .flash { animation: bn-flash .8s steps(2) infinite; }
  @keyframes bn-flash { 50% { opacity: 0; } }
  .bn .vapor { animation: bn-vapor 1.2s ease-out infinite; }
  @keyframes bn-vapor { from { transform: translateY(0); opacity: .9; } to { transform: translateY(-12px); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .bn * { animation: none !important; } }
`;
export function cssBonecos() {
  if (typeof document === 'undefined' || document.getElementById('bn-css')) return;
  const st = document.createElement('style'); st.id = 'bn-css'; st.textContent = CSS; document.head.appendChild(st);
}

const svg = (corpo, vb = '0 0 120 140') => `<svg class="bn" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${corpo}</svg>`;
const org = (x, y) => `style="transform-origin:${x}px ${y}px"`;
const olhos = (x1, x2, y, r = 3) => `<g class="olhos"><circle cx="${x1}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x2}" cy="${y}" r="${r}" fill="${INK}"/></g>`;
const pernas = (x, y, cor = INK, comp = 30) => `
  <g class="pa" ${org(x, y)}><path d="M${x - 5} ${y} L${x - 7} ${y + comp}" ${S} stroke-width="6" stroke="${cor}"/><path d="M${x - 13} ${y + comp + 2} h12" ${S} stroke-width="6"/></g>
  <g class="pb" ${org(x, y)}><path d="M${x + 5} ${y} L${x + 7} ${y + comp}" ${S} stroke-width="6" stroke="${cor}"/><path d="M${x + 3} ${y + comp + 2} h12" ${S} stroke-width="6"/></g>`;

// Pessoa genérica: pele, cabelo, roupa, e um acessório que vai na mão da frente (e balança com o braço)
function pessoa({ pele = '#ffd7b0', cabelo = 'curto', corCabelo = '#5a3b22', roupa = '#3a86ff', calcas = '#1d1b4b', mao = '', extra = '', acena = false, capa = '' }) {
  const cab = {
    curto: `<path d="M44 34 Q46 16 60 16 Q76 16 76 34 Q70 24 60 25 Q50 24 44 34 Z" fill="${corCabelo}" ${S}/>`,
    coque: `<circle cx="60" cy="14" r="8" fill="${corCabelo}" ${S}/><path d="M44 36 Q44 18 60 18 Q76 18 76 36 Q72 26 60 26 Q48 26 44 36 Z" fill="${corCabelo}" ${S}/>`,
    longo: `<path d="M42 50 Q38 18 60 16 Q82 18 78 50 L72 50 Q74 30 60 27 Q46 30 48 50 Z" fill="${corCabelo}" ${S}/>`,
    careca: `<path d="M45 30 Q47 26 50 28 M70 28 Q73 26 75 30" fill="none" ${S}/>`,
    bone: `<path d="M44 30 Q46 15 60 15 Q74 15 76 30 Z" fill="${corCabelo}" ${S}/><path d="M74 29 h16" ${S} stroke-width="5" stroke="${corCabelo}"/>`,
    chapeu: `<path d="M38 28 h44" ${S} stroke-width="5"/><path d="M46 28 Q46 10 60 10 Q74 10 74 28 Z" fill="${corCabelo}" ${S}/>`,
  }[cabelo] || '';
  return svg(`
    ${capa}
    ${pernas(60, 96, calcas)}
    <g class="corpo">
      <g class="bb" ${org(46, 60)}><path d="M46 60 L36 90" ${S} stroke-width="7" stroke="${roupa}"/><circle cx="35" cy="92" r="4" fill="${pele}" ${S} stroke-width="2"/></g>
      <rect x="44" y="52" width="32" height="46" rx="10" fill="${roupa}" ${S}/>
      ${extra}
      <circle cx="60" cy="36" r="16" fill="${pele}" ${S}/>
      ${cab}
      ${olhos(54, 66, 36)}
      <path d="M54 44 Q60 49 66 44" fill="none" ${S} stroke-width="2.5"/>
      <g class="${acena ? 'acena' : 'ba'}" ${org(74, 60)}><path d="M74 60 L84 90" ${S} stroke-width="7" stroke="${roupa}"/><circle cx="85" cy="92" r="4" fill="${pele}" ${S} stroke-width="2"/>${mao}</g>
    </g>`);
}

// Objeto com olhos e pernas
function objeto(corpo, { pernasX = 60, pernasY = 100, comp = 26, olhosXY = [52, 68, 62] } = {}) {
  return svg(`${pernas(pernasX, pernasY, INK, comp)}<g class="corpo">${corpo}${olhos(...olhosXY)}</g>`);
}

// Veículo com rodas a girar e faróis como olhos
function veiculo(cor, janelas = '', { comprido = false, letreiro = '' } = {}) {
  const w = comprido ? 110 : 90, x = (120 - w) / 2;
  return svg(`
    <g class="corpo">
      <rect x="${x}" y="58" width="${w}" height="44" rx="12" fill="${cor}" ${S}/>
      ${janelas}
      ${letreiro}
      <circle cx="${x + w - 6}" cy="90" r="5" fill="#fff6a0" ${S} stroke-width="2"/>
      ${olhos(x + w - 22, x + w - 10, 74, 3)}
    </g>
    <g class="roda" ${org(x + 22, 106)}><circle cx="${x + 22}" cy="106" r="11" fill="#444" ${S}/><path d="M${x + 22} 97 v18 M${x + 13} 106 h18" stroke="#ccc" stroke-width="3"/></g>
    <g class="roda" ${org(x + w - 22, 106)}><circle cx="${x + w - 22}" cy="106" r="11" fill="#444" ${S}/><path d="M${x + w - 22} 97 v18 M${x + w - 31} 106 h18" stroke="#ccc" stroke-width="3"/></g>`);
}

const B = {
  gaivota: () => svg(`
    ${pernas(56, 98, '#ffd23f', 24)}
    <g class="corpo">
      <path d="M30 80 L8 70 L14 92 Z" fill="#8d99a6" ${S}/>
      <ellipse cx="54" cy="82" rx="34" ry="20" fill="#fff" ${S}/>
      <g class="asa-b" ${org(48, 72)}><path d="M48 72 Q40 52 18 58 Q34 70 46 88 Z" fill="#b9c2ca" ${S}/></g>
      <circle cx="86" cy="58" r="15" fill="#fff" ${S}/>
      ${olhos(90, 90, 54, 3)}
      <path d="M84 47 L96 46" ${S}/>
      <path d="M99 58 L118 62 L99 67 Z" fill="#ffd23f" ${S}/>
      <circle cx="113" cy="63" r="2.2" fill="#ef233c"/>
      <g transform="translate(112,66)"><circle cx="0" cy="12" r="5" fill="none" stroke="#e0a800" stroke-width="3"/><rect x="-2" y="16" width="4" height="13" fill="#e0a800"/></g>
    </g>`),
  pombo: () => svg(`
    ${pernas(58, 98, '#ff8c42', 22)}
    <g class="corpo">
      <path d="M26 86 L6 80 L12 98 Z" fill="#6b7280" ${S}/>
      <ellipse cx="56" cy="84" rx="32" ry="20" fill="#9aa3b5" ${S}/>
      <path d="M40 80 Q52 66 68 80 Q54 94 40 80 Z" fill="#7a8396" ${S}/>
      <g class="bica" ${org(80, 70)}>
        <path d="M72 76 Q72 60 84 58 Q96 58 96 70 Q94 80 82 82" fill="#7c5ea8" ${S}/>
        <circle cx="86" cy="62" r="12" fill="#9aa3b5" ${S}/>
        ${olhos(90, 90, 60, 2.6)}
        <path d="M97 62 L106 65 L97 68 Z" fill="#555" ${S} stroke-width="2"/>
      </g>
    </g>`),
  gato: () => svg(`
    <g class="pa" ${org(40, 96)}><path d="M40 96 v24" ${S} stroke-width="7" stroke="#ff9f43"/></g>
    <g class="pb" ${org(52, 96)}><path d="M52 96 v24" ${S} stroke-width="7" stroke="#ff9f43"/></g>
    <g class="pa" ${org(76, 96)}><path d="M76 96 v24" ${S} stroke-width="7" stroke="#ff9f43"/></g>
    <g class="pb" ${org(86, 96)}><path d="M86 96 v24" ${S} stroke-width="7" stroke="#ff9f43"/></g>
    <g class="corpo">
      <g class="cauda" ${org(30, 86)}><path d="M30 86 Q10 80 14 56" fill="none" ${S} stroke-width="8" stroke="#ff9f43"/></g>
      <ellipse cx="62" cy="88" rx="34" ry="16" fill="#ffb366" ${S}/>
      <path d="M50 76 v20 M62 74 v24 M74 76 v20" stroke="#e07b1a" stroke-width="4"/>
      <path d="M84 62 L86 44 L96 56 L106 44 L108 62" fill="#ffb366" ${S}/>
      <circle cx="96" cy="68" r="15" fill="#ffb366" ${S}/>
      ${olhos(91, 101, 66, 2.8)}
      <path d="M93 74 Q96 77 99 74" fill="none" ${S} stroke-width="2"/>
      <path d="M84 72 h-10 M108 72 h10" stroke="${INK}" stroke-width="1.5"/>
    </g>`),
  cao: () => svg(`
    <g class="pa" ${org(38, 94)}><path d="M38 94 v26" ${S} stroke-width="8" stroke="#c98b4f"/></g>
    <g class="pb" ${org(50, 94)}><path d="M50 94 v26" ${S} stroke-width="8" stroke="#c98b4f"/></g>
    <g class="pa" ${org(74, 94)}><path d="M74 94 v26" ${S} stroke-width="8" stroke="#c98b4f"/></g>
    <g class="pb" ${org(86, 94)}><path d="M86 94 v26" ${S} stroke-width="8" stroke="#c98b4f"/></g>
    <g class="corpo">
      <g class="cauda" ${org(28, 82)}><path d="M28 82 Q14 70 18 58" fill="none" ${S} stroke-width="7" stroke="#c98b4f"/></g>
      <ellipse cx="60" cy="86" rx="34" ry="16" fill="#e0a86a" ${S}/>
      <circle cx="96" cy="64" r="16" fill="#e0a86a" ${S}/>
      <path d="M86 52 Q78 60 82 76 Q90 70 90 56 Z" fill="#8a5a2b" ${S}/>
      <ellipse cx="110" cy="70" rx="7" ry="5" fill="#e0a86a" ${S}/>
      <circle cx="116" cy="68" r="3" fill="${INK}"/>
      ${olhos(98, 98, 60, 2.8)}
      <path d="M104 76 Q112 92 96 104 M104 80 Q116 96 104 110" fill="none" stroke="#3a86ff" stroke-width="7" stroke-linecap="round"/>
      <path d="M104 86 l6 3 M100 98 l6 3" stroke="#fff" stroke-width="3"/>
    </g>`),
  avo: () => pessoa({ cabelo: 'coque', corCabelo: '#d6d6d6', roupa: '#8338ec', calcas: '#5b4b8a',
    mao: `<rect x="80" y="86" width="12" height="20" rx="3" fill="#333" ${S} stroke-width="2"/><rect x="82" y="89" width="8" height="10" fill="#8ecdff"/>`,
    extra: `<path d="M50 34 h7 M63 34 h7" ${S} stroke-width="2"/><circle cx="54" cy="36" r="5" fill="none" ${S} stroke-width="2"/><circle cx="66" cy="36" r="5" fill="none" ${S} stroke-width="2"/>` }),
  vizinha: () => pessoa({ cabelo: 'longo', corCabelo: '#b5651d', roupa: '#ff4f8b', calcas: '#1d1b4b', acena: true,
    extra: `<path d="M48 66 h24 M48 74 h24 M48 82 h24" stroke="#fff" stroke-width="2" opacity=".7"/>` }),
  turista: () => pessoa({ cabelo: 'chapeu', corCabelo: '#ffd23f', roupa: '#06d6a0', calcas: '#ff8c42',
    mao: `<rect x="76" y="84" width="20" height="14" rx="3" fill="#333" ${S} stroke-width="2"/><circle cx="86" cy="91" r="4" fill="#8ecdff" ${S} stroke-width="1.5"/><rect class="flash" x="90" y="82" width="5" height="3" fill="#fff6a0"/>`,
    extra: `<path d="M50 56 L60 70 L70 56" fill="none" stroke="#333" stroke-width="2"/>` }),
  maquinista: () => veiculo('#ffd23f',
    `<rect x="18" y="64" width="18" height="16" rx="3" fill="#8ecdff" ${S} stroke-width="2"/><rect x="42" y="64" width="18" height="16" rx="3" fill="#8ecdff" ${S} stroke-width="2"/><rect x="66" y="64" width="18" height="16" rx="3" fill="#8ecdff" ${S} stroke-width="2"/>`,
    { comprido: true, letreiro: `<rect x="20" y="86" width="60" height="9" rx="2" fill="${INK}"/><text x="50" y="94" font-size="8" font-weight="800" fill="#ffd23f" text-anchor="middle" font-family="sans-serif">PÓVOA</text>` }),
  padeira: () => pessoa({ cabelo: 'coque', corCabelo: '#3b2a1a', roupa: '#fff', calcas: '#3a86ff',
    mao: `<circle cx="88" cy="96" r="9" fill="#e8b04a" ${S}/><path d="M82 92 q6 -4 12 0" stroke="#fff" stroke-width="3" fill="none"/>`,
    extra: `<rect x="48" y="70" width="24" height="24" rx="4" fill="#ffd23f" ${S} stroke-width="2"/>` }),
  tuna: () => pessoa({ cabelo: 'curto', corCabelo: '#1d1b4b', roupa: '#222', calcas: '#222',
    capa: `<path d="M40 54 Q30 100 34 118 L86 118 Q90 100 80 54 Z" fill="#111" ${S}/>`,
    mao: `<g transform="translate(70,80) rotate(-30)"><ellipse cx="18" cy="18" rx="12" ry="10" fill="#c98b4f" ${S}/><circle cx="18" cy="18" r="3" fill="${INK}"/><rect x="26" y="15" width="26" height="5" fill="#8a5a2b" ${S} stroke-width="2"/></g>` }),
  gato_teclado: null,
  senhor_do_cafe: () => pessoa({ cabelo: 'careca', roupa: '#1e6091', calcas: '#5a3b22',
    mao: `<path d="M80 86 h14 v12 q-7 5 -14 0 Z" fill="#fff" ${S} stroke-width="2"/><path d="M94 89 q5 2 0 6" fill="none" ${S} stroke-width="2"/><path class="vapor" d="M84 82 q-3 -5 0 -10 M90 82 q3 -5 0 -10" fill="none" stroke="#999" stroke-width="2"/>`,
    extra: `<path d="M52 46 q8 4 16 0" fill="none" stroke="#666" stroke-width="4"/>` }),
  rotunda: () => svg(`
    ${pernas(60, 108, INK, 22)}
    <g class="corpo">
      <rect x="57" y="78" width="6" height="32" fill="#999" ${S} stroke-width="2"/>
      <circle cx="60" cy="56" r="32" fill="#3a86ff" ${S}/>
      <g class="roda" ${org(60, 56)}>
        <path d="M60 32 A24 24 0 0 1 84 56" fill="none" stroke="#fff" stroke-width="6"/><path d="M84 50 l0 10 l-8 -4 Z" fill="#fff"/>
        <path d="M60 80 A24 24 0 0 1 36 56" fill="none" stroke="#fff" stroke-width="6"/><path d="M36 62 l0 -10 l8 4 Z" fill="#fff"/>
        <path d="M84 56 A24 24 0 0 1 60 80" fill="none" stroke="#fff" stroke-width="6"/>
      </g>
      ${olhos(52, 68, 56, 3.5)}
    </g>`),
  francesinha: () => objeto(`
    <path d="M24 92 Q60 108 96 92 L92 82 L28 82 Z" fill="#ff8c42" ${S}/>
    <rect x="28" y="70" width="64" height="14" rx="5" fill="#e8b04a" ${S}/>
    <rect x="26" y="62" width="68" height="8" rx="3" fill="#f28b82" ${S} stroke-width="2"/>
    <rect x="28" y="48" width="64" height="14" rx="5" fill="#e8b04a" ${S}/>
    <path d="M26 50 Q40 40 50 50 Q60 38 72 50 Q84 40 94 50 L94 56 Q60 62 26 56 Z" fill="#ffe14d" ${S}/>
    <ellipse cx="60" cy="40" rx="16" ry="8" fill="#fff" ${S}/><circle cx="60" cy="40" r="5" fill="#ffb703"/>`,
    { pernasY: 100, olhosXY: [50, 70, 76] }),
  vendedora: () => pessoa({ cabelo: 'coque', corCabelo: '#2b2b2b', roupa: '#06d6a0', calcas: '#5b4b8a', acena: true,
    extra: `<path d="M44 76 h32 v22 h-32 Z" fill="#fff" ${S} stroke-width="2"/><path d="M54 66 Q60 58 66 66" fill="none" stroke="#fff" stroke-width="3"/>`,
    mao: `<path d="M78 98 L98 86 L100 100 Z" fill="#ffd23f" ${S} stroke-width="2"/><circle cx="91" cy="94" r="2" fill="#e0a800"/><circle cx="96" cy="97" r="1.5" fill="#e0a800"/>` }),
  carro: () => veiculo('#ef233c', `<path d="M24 58 L36 40 L78 40 L90 58 Z" fill="#8ecdff" ${S}/><path d="M57 40 v18" ${S}/>`),
  excursao: () => veiculo('#ff8c42',
    [18, 38, 58, 78].map(x => `<rect x="${x}" y="64" width="16" height="15" rx="3" fill="#8ecdff" ${S} stroke-width="2"/><circle cx="${x + 8}" cy="74" r="4.5" fill="#ffd7b0" stroke="${INK}" stroke-width="1.5"/><path d="M${x + 3} 71 q5 -6 10 0" fill="#ddd" stroke="${INK}" stroke-width="1"/>`).join(''),
    { comprido: true, letreiro: `<text x="50" y="96" font-size="8" font-weight="800" fill="${INK}" text-anchor="middle" font-family="sans-serif">FÁTIMA</text>` }),
  supermercado: () => svg(`
    <g class="corpo">
      <path d="M14 46 h14 l12 44 h52 l8 -32 h-66" fill="none" ${S} stroke-width="4"/>
      <path d="M34 58 h62 l-7 28 h-48 Z" fill="#8ecdff" ${S} opacity=".9"/>
      <path d="M48 58 v28 M62 58 v28 M76 58 v28" stroke="${INK}" stroke-width="2"/>
      <rect x="54" y="30" width="34" height="22" rx="5" fill="#ef233c" ${S}/><text x="71" y="47" font-size="16" font-weight="900" fill="#fff" text-anchor="middle" font-family="sans-serif">%</text>
      ${olhos(64, 78, 72, 3)}
    </g>
    <g class="roda" ${org(46, 102)}><circle cx="46" cy="102" r="8" fill="#444" ${S}/><path d="M46 95 v14" stroke="#ccc" stroke-width="3"/></g>
    <g class="roda" ${org(84, 102)}><circle cx="84" cy="102" r="8" fill="#444" ${S}/><path d="M84 95 v14" stroke="#ccc" stroke-width="3"/></g>`),
  sueca: () => objeto(`
    <g class="bb" ${org(34, 66)}><path d="M34 66 L18 84" ${S} stroke-width="6"/></g>
    <g class="ba" ${org(86, 66)}><path d="M86 66 L102 84" ${S} stroke-width="6"/></g>
    <rect x="32" y="30" width="56" height="72" rx="8" fill="#fff" ${S}/>
    <text x="40" y="46" font-size="14" font-weight="900" fill="#ef233c" font-family="sans-serif">A</text>
    <path d="M60 80 C48 70 52 60 60 66 C68 60 72 70 60 80 Z" fill="#ef233c" ${S} stroke-width="2"/>`,
    { pernasY: 102, olhosXY: [50, 70, 54] }),
  fas: () => objeto(`
    <rect x="36" y="22" width="48" height="80" rx="10" fill="#1d1b4b" ${S}/>
    <rect x="41" y="30" width="38" height="62" rx="4" fill="#ffd23f"/>
    <circle class="flash" cx="60" cy="27" r="3" fill="#fff"/>
    <path d="M50 74 Q60 82 70 74" fill="none" ${S} stroke-width="2.5"/>
    <path d="M30 40 l-8 -6 M28 52 h-10 M90 40 l8 -6 M92 52 h10" class="flash" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/>`,
    { pernasY: 102, olhosXY: [52, 68, 56] }),
  mapa: () => objeto(`
    <g class="acena" ${org(30, 60)}><path d="M30 60 L14 48" ${S} stroke-width="6"/></g>
    <g class="bb" ${org(90, 60)}><path d="M90 60 L106 74" ${S} stroke-width="6"/></g>
    <path d="M26 34 L46 28 L66 36 L94 28 L94 96 L66 104 L46 96 L26 102 Z" fill="#f4efe1" ${S}/>
    <path d="M46 28 V96 M66 36 V104" ${S} stroke-width="2"/>
    <path d="M32 80 Q50 60 60 70 T88 50" fill="none" stroke="#3a86ff" stroke-width="4"/>
    <path d="M76 82 l6 6 m0 -6 l-6 6" stroke="#ef233c" stroke-width="3"/>`,
    { pernasY: 102, olhosXY: [52, 72, 52] }),
  gps: () => objeto(`
    <path d="M60 30 V14" ${S}/><circle class="flash" cx="60" cy="12" r="4" fill="#ef233c" ${S} stroke-width="2"/>
    <rect x="28" y="30" width="64" height="58" rx="10" fill="#444" ${S}/>
    <rect x="34" y="36" width="52" height="40" rx="4" fill="#8ecdff"/>
    <path d="M44 66 L44 50 L58 50" fill="none" stroke="#1d1b4b" stroke-width="4"/><path d="M56 44 l8 6 l-8 6 Z" fill="#1d1b4b"/>
    <path d="M34 66 Q60 58 86 70" stroke="#3a86ff" stroke-width="6" fill="none" opacity=".6"/>`,
    { pernasY: 88, comp: 30, olhosXY: [66, 78, 60] }),
  motorista: () => veiculo('#3a86ff',
    `<rect x="16" y="64" width="20" height="16" rx="3" fill="#8ecdff" ${S} stroke-width="2"/><rect x="42" y="64" width="20" height="16" rx="3" fill="#8ecdff" ${S} stroke-width="2"/><rect x="68" y="64" width="20" height="16" rx="3" fill="#8ecdff" ${S} stroke-width="2"/><text x="78" y="62" font-size="9" font-weight="800" fill="#fff" font-family="sans-serif">Zzz</text>`,
    { comprido: true, letreiro: `<text x="50" y="96" font-size="8" font-weight="800" fill="#fff" text-anchor="middle" font-family="sans-serif">ESPAÑA</text>` }),
};
delete B.gato_teclado;

export const temBoneco = id => typeof B[id] === 'function';

// devolve o SVG do boneco, ou o emoji como alternativa
export function boneco(id, emoji = '🎤') {
  cssBonecos();
  return temBoneco(id) ? B[id]() : `<span style="font-size:3rem">${emoji}</span>`;
}
