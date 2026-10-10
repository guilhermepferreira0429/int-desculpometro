// Ferramentas do agente. Reais: geocode, get_weather, get_traffic (TomTom), get_seagull_facts.
// Simuladas (e assinaladas como tal na fonte): get_transport_status, get_events_nearby, e o trânsito sem chave.
// Todas recebem (input, { lang }) para devolver texto em português ou inglês.

import { INCIDENTES } from "./public/catalogo.js";

const UA = { 'User-Agent': 'Desculpometro/1.0 (hackathon)' };

async function getJSON(url, opts = {}) {
  const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(8000), ...opts });
  if (!r.ok) throw new Error(`HTTP ${r.status} em ${new URL(url).host}`);
  return r.json();
}

// Gerador "aleatório" estável por texto, para os dados simulados não mudarem a cada clique
function seeded(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) % 10000) / 10000;
}
const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
const L = (lang, pt, en) => (lang === 'en' ? en : pt);
const SIMULADO = lang => L(lang, 'Dados simulados', 'Simulated data');

// ---------- 1. geocode ----------
// Nomes populares que o geocoding não resolve sozinho
const ALIASES = { gaia: 'Vila Nova de Gaia', foz: 'Foz do Douro', ribeira: 'Porto', baixa: 'Porto' };
export async function geocode({ local }, { lang } = {}) {
  // A Open-Meteo só conhece localidades, não ruas: tenta o texto todo e depois cada parte
  const partesBrutas = [local, ...local.split(',').map(s => s.trim()).reverse()].filter(Boolean);
  const partes = partesBrutas.map(p => ALIASES[p.toLowerCase()] || p);
  // Procura primeiro em Portugal (senão "Gaia" vai parar à Catalunha), depois em qualquer país
  const tentativas = partes.flatMap(nome => [[nome, '&countryCode=PT'], [nome, '']]);
  for (const [nome, pais] of tentativas) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nome)}&count=1&language=${lang === 'en' ? 'en' : 'pt'}&format=json${pais}`;
    const d = await getJSON(url);
    const r = d.results?.[0];
    if (r) {
      return {
        local_pedido: local,
        encontrado: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
        lat: r.latitude,
        lon: r.longitude,
        fonte: 'Open-Meteo Geocoding API',
      };
    }
  }
  return { erro: L(lang, `Não encontrei "${local}"`, `Could not find "${local}"`), fonte: 'Open-Meteo Geocoding API' };
}

// ---------- 2. get_weather ----------
const WMO = {
  0: ['céu limpo', 'clear sky'], 1: ['pouco nublado', 'mainly clear'], 2: ['parcialmente nublado', 'partly cloudy'], 3: ['muito nublado', 'overcast'],
  45: ['nevoeiro', 'fog'], 48: ['nevoeiro com geada', 'freezing fog'], 51: ['chuvisco fraco', 'light drizzle'], 53: ['chuvisco', 'drizzle'], 55: ['chuvisco forte', 'heavy drizzle'],
  61: ['chuva fraca', 'light rain'], 63: ['chuva', 'rain'], 65: ['chuva forte', 'heavy rain'], 66: ['chuva gelada', 'freezing rain'], 67: ['chuva gelada forte', 'heavy freezing rain'],
  71: ['neve fraca', 'light snow'], 73: ['neve', 'snow'], 75: ['neve forte', 'heavy snow'], 80: ['aguaceiros fracos', 'light showers'], 81: ['aguaceiros', 'showers'],
  82: ['aguaceiros violentos', 'violent showers'], 95: ['trovoada', 'thunderstorm'], 96: ['trovoada com granizo', 'thunderstorm with hail'], 99: ['trovoada com granizo forte', 'thunderstorm with heavy hail'],
};
const wmo = (code, lang) => WMO[code]?.[lang === 'en' ? 1 : 0] ?? `${L(lang, 'código', 'code')} ${code}`;

export async function get_weather({ lat, lon }, { lang } = {}) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,visibility` +
    `&hourly=precipitation_probability,precipitation,weather_code,wind_gusts_10m&forecast_hours=6&timezone=auto`;
  const d = await getJSON(url);
  const c = d.current;
  return {
    agora: {
      hora: c.time,
      estado: wmo(c.weather_code, lang),
      codigo: c.weather_code,
      temperatura_c: c.temperature_2m,
      sensacao_c: c.apparent_temperature,
      precipitacao_mm: c.precipitation,
      vento_kmh: c.wind_speed_10m,
      rajadas_kmh: c.wind_gusts_10m,
      visibilidade_m: c.visibility,
    },
    proximas_horas: d.hourly.time.map((t, i) => ({
      hora: t.slice(11),
      estado: wmo(d.hourly.weather_code[i], lang),
      prob_chuva_pct: d.hourly.precipitation_probability[i],
      precipitacao_mm: d.hourly.precipitation[i],
      rajadas_kmh: d.hourly.wind_gusts_10m[i],
    })),
    fonte: L(lang, 'Open-Meteo Forecast API (dados reais)', 'Open-Meteo Forecast API (real data)'),
  };
}

// ---------- 3. get_traffic ----------
function trafficSimulado(origem, destino, motivo, lang) {
  const rnd = seeded(origem + destino + new Date().toDateString());
  const normal = 12 + Math.floor(rnd() * 25);
  const atraso = 4 + Math.floor(rnd() * 22);
  const causa = pick(rnd, INCIDENTES.transito[lang === 'en' ? 'en' : 'pt']);
  const via = pick(rnd, INCIDENTES.transito.vias);
  return {
    origem, destino,
    tempo_normal_min: normal,
    tempo_com_transito_min: normal + atraso,
    atraso_transito_min: atraso,
    incidentes: [`${causa} (${via})`],
    fonte: `${SIMULADO(lang)} (${motivo})`,
  };
}

export async function get_traffic({ origem, destino }, { lang } = {}) {
  const key = process.env.TOMTOM_API_KEY;
  if (!key) return trafficSimulado(origem, destino, L(lang, 'sem TOMTOM_API_KEY', 'no TOMTOM_API_KEY'), lang);
  try {
    const [a, b] = await Promise.all([geocode({ local: origem }, { lang }), geocode({ local: destino }, { lang })]);
    if (a.erro || b.erro) return trafficSimulado(origem, destino, L(lang, 'local não geocodificado', 'place not geocoded'), lang);
    const url = `https://api.tomtom.com/routing/1/calculateRoute/${a.lat},${a.lon}:${b.lat},${b.lon}/json` +
      `?key=${key}&traffic=true&travelMode=car&computeTravelTimeFor=all&language=${lang === 'en' ? 'en-GB' : 'pt-PT'}`;
    const d = await getJSON(url);
    const s = d.routes[0].summary;
    return {
      origem: a.encontrado, destino: b.encontrado,
      distancia_km: +(s.lengthInMeters / 1000).toFixed(1),
      tempo_sem_transito_min: Math.round((s.noTrafficTravelTimeInSeconds ?? s.travelTimeInSeconds) / 60),
      tempo_com_transito_min: Math.round(s.travelTimeInSeconds / 60),
      atraso_transito_min: Math.round(s.trafficDelayInSeconds / 60),
      fonte: L(lang, 'TomTom Routing API com trânsito em tempo real', 'TomTom Routing API with live traffic'),
    };
  } catch (e) {
    return trafficSimulado(origem, destino, `TomTom ${L(lang, 'falhou', 'failed')}: ${e.message}`, lang);
  }
}

// ---------- 4. get_transport_status (simulado) ----------
export async function get_transport_status({ cidade }, { lang } = {}) {
  const rnd = seeded('transp' + cidade + new Date().toDateString() + new Date().getHours());
  const porto = /porto|gaia|matosinhos|maia/i.test(cidade);
  const linhas = porto
    ? [L(lang, 'Metro do Porto, linha A (Azul)', 'Porto Metro, line A (Blue)'), L(lang, 'Metro do Porto, linha B (Vermelha, até à Póvoa de Varzim)', 'Porto Metro, line B (Red, to Póvoa de Varzim)'), L(lang, 'Metro do Porto, linha D (Amarela)', 'Porto Metro, line D (Yellow)'), L(lang, 'STCP 500', 'STCP bus 500'), L(lang, 'CP Urbanos do Porto, linha de Braga', 'CP Porto suburban trains, Braga line')]
    : [L(lang, 'Metro de Lisboa, linha Verde', 'Lisbon Metro, Green line'), L(lang, 'Metro de Lisboa, linha Azul', 'Lisbon Metro, Blue line'), L(lang, 'Carris 728', 'Carris bus 728'), L(lang, 'CP Urbanos de Lisboa, linha de Sintra', 'CP Lisbon suburban trains, Sintra line')];
  const problemas = INCIDENTES.transportes[lang === 'en' ? 'en' : 'pt'];
  return {
    cidade,
    linhas: linhas.map(l => {
      const mal = rnd() < 0.4;
      return {
        linha: l,
        estado: mal ? 'perturbada' : 'normal',
        detalhe: mal ? L(lang, `${pick(rnd, problemas)}, atrasos de ${5 + Math.floor(rnd() * 20)} min`, `${pick(rnd, problemas)}, delays of ${5 + Math.floor(rnd() * 20)} min`) : L(lang, 'circulação normal', 'good service'),
      };
    }),
    fonte: `${SIMULADO(lang)} (demo)`,
  };
}

// ---------- 5. get_events_nearby (simulado) ----------
export async function get_events_nearby({ cidade }, { lang } = {}) {
  const rnd = seeded('ev' + cidade + new Date().toDateString());
  const porto = /porto|gaia|matosinhos|maia/i.test(cidade);
  const k = lang === 'en' ? 'en' : 'pt';
  const eventos = (porto ? INCIDENTES.eventos_porto : INCIDENTES.eventos_lisboa).map(e => [e[k], e.zona]);
  const impactos = INCIDENTES.impactos[k];
  const n = 1 + Math.floor(rnd() * 2);
  return {
    cidade,
    eventos: eventos.sort(() => rnd() - 0.5).slice(0, n).map(([nome, zona]) => ({
      evento: nome, zona, hora: `${17 + Math.floor(rnd() * 5)}:${pick(rnd, ['00', '30'])}`,
      impacto: pick(rnd, impactos),
    })),
    fonte: `${SIMULADO(lang)} (demo)`,
  };
}

// ---------- 6. get_seagull_facts ----------
export async function get_seagull_facts(_input, { lang } = {}) {
  const en = lang === 'en';
  const host = en ? 'en.wikipedia.org' : 'pt.wikipedia.org';
  const titulos = en ? ['Yellow-legged gull'] : ['Gaivota-de-patas-amarelas'];
  const url = `https://${host}/w/api.php?action=query&prop=extracts&explaintext=1&exsectionformat=plain&format=json&redirects=1&titles=${encodeURIComponent(titulos.join('|'))}`;
  const d = await getJSON(url);
  const paginas = Object.values(d.query.pages).filter(p => p.extract);
  return {
    artigos: paginas.map(p => ({
      titulo: p.title,
      url: `https://${host}/wiki/${encodeURIComponent(p.title.replace(/ /g, '_'))}`,
      texto: p.extract.slice(0, 3500),
    })),
    nota: L(lang, 'A gaivota-de-patas-amarelas (Larus michahellis) é a espécie que domina os telhados do Porto.', 'The yellow-legged gull (Larus michahellis) is the species that rules the rooftops of Porto.'),
    fonte: L(lang, 'Wikipédia em português (API MediaWiki)', 'English Wikipedia (MediaWiki API)'),
  };
}

export const handlers = { geocode, get_weather, get_traffic, get_transport_status, get_events_nearby, get_seagull_facts };

export const toolDefs = [
  {
    name: 'geocode',
    description: 'Converte o nome de um local (cidade, bairro) em coordenadas. Usa antes de get_weather.',
    input_schema: { type: 'object', properties: { local: { type: 'string', description: 'Nome do local, ex: "Porto" ou "Matosinhos"' } }, required: ['local'] },
  },
  {
    name: 'get_weather',
    description: 'Tempo atual e das próximas 6 horas para umas coordenadas (dados reais Open-Meteo).',
    input_schema: { type: 'object', properties: { lat: { type: 'number' }, lon: { type: 'number' } }, required: ['lat', 'lon'] },
  },
  {
    name: 'get_traffic',
    description: 'Tempo de viagem de carro e atraso por trânsito entre origem e destino. Indica na fonte se os dados são reais ou simulados.',
    input_schema: { type: 'object', properties: { origem: { type: 'string' }, destino: { type: 'string' } }, required: ['origem', 'destino'] },
  },
  {
    name: 'get_transport_status',
    description: 'Estado do metro, autocarros e comboios urbanos numa cidade portuguesa.',
    input_schema: { type: 'object', properties: { cidade: { type: 'string' } }, required: ['cidade'] },
  },
  {
    name: 'get_events_nearby',
    description: 'Jogos, concertos e eventos que estejam a causar trânsito numa cidade.',
    input_schema: { type: 'object', properties: { cidade: { type: 'string' } }, required: ['cidade'] },
  },
  {
    name: 'get_seagull_facts',
    description: 'Factos reais sobre gaivotas do Porto, da Wikipédia. Só usar no MODO DESESPERO (credibilidade abaixo de 20) quando a desculpa absurda envolver gaivotas.',
    input_schema: { type: 'object', properties: {} },
  },
];
