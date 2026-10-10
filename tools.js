// Ferramentas do agente. Reais: geocode, get_weather, get_traffic (TomTom), get_seagull_facts.
// Simuladas (e assinaladas como tal na fonte): get_transport_status, get_events_nearby, e o trânsito sem chave.

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

// ---------- 1. geocode ----------
export async function geocode({ local }) {
  // A Open-Meteo só conhece localidades, não ruas: tenta o texto todo e depois cada parte
  const partes = [local, ...local.split(',').map(s => s.trim()).reverse()].filter(Boolean);
  for (const nome of partes) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nome)}&count=1&language=pt&format=json`;
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
  return { erro: `Não encontrei "${local}"`, fonte: 'Open-Meteo Geocoding API' };
}

// ---------- 2. get_weather ----------
const WMO = {
  0: 'céu limpo', 1: 'pouco nublado', 2: 'parcialmente nublado', 3: 'muito nublado',
  45: 'nevoeiro', 48: 'nevoeiro com geada', 51: 'chuvisco fraco', 53: 'chuvisco', 55: 'chuvisco forte',
  61: 'chuva fraca', 63: 'chuva', 65: 'chuva forte', 66: 'chuva gelada', 67: 'chuva gelada forte',
  71: 'neve fraca', 73: 'neve', 75: 'neve forte', 80: 'aguaceiros fracos', 81: 'aguaceiros',
  82: 'aguaceiros violentos', 95: 'trovoada', 96: 'trovoada com granizo', 99: 'trovoada com granizo forte',
};

export async function get_weather({ lat, lon }) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,visibility` +
    `&hourly=precipitation_probability,precipitation,weather_code,wind_gusts_10m&forecast_hours=6&timezone=auto`;
  const d = await getJSON(url);
  const c = d.current;
  return {
    agora: {
      hora: c.time,
      estado: WMO[c.weather_code] ?? `código ${c.weather_code}`,
      temperatura_c: c.temperature_2m,
      sensacao_c: c.apparent_temperature,
      precipitacao_mm: c.precipitation,
      vento_kmh: c.wind_speed_10m,
      rajadas_kmh: c.wind_gusts_10m,
      visibilidade_m: c.visibility,
    },
    proximas_horas: d.hourly.time.map((t, i) => ({
      hora: t.slice(11),
      estado: WMO[d.hourly.weather_code[i]] ?? '?',
      prob_chuva_pct: d.hourly.precipitation_probability[i],
      precipitacao_mm: d.hourly.precipitation[i],
      rajadas_kmh: d.hourly.wind_gusts_10m[i],
    })),
    fonte: 'Open-Meteo Forecast API (dados reais)',
  };
}

// ---------- 3. get_traffic ----------
function trafficSimulado(origem, destino, motivo) {
  const rnd = seeded(origem + destino + new Date().toDateString());
  const normal = 12 + Math.floor(rnd() * 25);
  const atraso = 4 + Math.floor(rnd() * 22);
  return {
    origem, destino,
    tempo_normal_min: normal,
    tempo_com_transito_min: normal + atraso,
    atraso_transito_min: atraso,
    incidentes: [
      pick(rnd, ['Acidente com dois veículos', 'Obras com corte de faixa', 'Veículo avariado na via', 'Semáforos avariados num cruzamento']) +
        ' ' + pick(rnd, ['na VCI', 'na A28', 'na Circunvalação', 'na A1', 'na Avenida da Boavista', 'no IC19', 'na 2ª Circular']),
    ],
    fonte: `Dados simulados (${motivo})`,
  };
}

export async function get_traffic({ origem, destino }) {
  const key = process.env.TOMTOM_API_KEY;
  if (!key) return trafficSimulado(origem, destino, 'sem TOMTOM_API_KEY');
  try {
    const [a, b] = await Promise.all([geocode({ local: origem }), geocode({ local: destino })]);
    if (a.erro || b.erro) return trafficSimulado(origem, destino, 'local não geocodificado');
    const url = `https://api.tomtom.com/routing/1/calculateRoute/${a.lat},${a.lon}:${b.lat},${b.lon}/json` +
      `?key=${key}&traffic=true&travelMode=car&computeTravelTimeFor=all&language=pt-PT`;
    const d = await getJSON(url);
    const s = d.routes[0].summary;
    return {
      origem: a.encontrado, destino: b.encontrado,
      distancia_km: +(s.lengthInMeters / 1000).toFixed(1),
      tempo_sem_transito_min: Math.round((s.noTrafficTravelTimeInSeconds ?? s.travelTimeInSeconds) / 60),
      tempo_com_transito_min: Math.round(s.travelTimeInSeconds / 60),
      atraso_transito_min: Math.round(s.trafficDelayInSeconds / 60),
      fonte: 'TomTom Routing API com trânsito em tempo real',
    };
  } catch (e) {
    return trafficSimulado(origem, destino, `TomTom falhou: ${e.message}`);
  }
}

// ---------- 4. get_transport_status (simulado) ----------
export async function get_transport_status({ cidade }) {
  const rnd = seeded('transp' + cidade + new Date().toDateString() + new Date().getHours());
  const porto = /porto|gaia|matosinhos|maia/i.test(cidade);
  const linhas = porto
    ? ['Metro do Porto, linha A (Azul)', 'Metro do Porto, linha D (Amarela)', 'STCP 500', 'CP Urbanos do Porto, linha de Braga']
    : ['Metro de Lisboa, linha Verde', 'Metro de Lisboa, linha Azul', 'Carris 728', 'CP Urbanos de Lisboa, linha de Sintra'];
  const problemas = ['avaria técnica numa composição', 'perturbação por pessoa na via', 'greve parcial de maquinistas', 'falha de sinalização', 'intervalos alargados por falta de material'];
  return {
    cidade,
    linhas: linhas.map(l => {
      const mal = rnd() < 0.4;
      return { linha: l, estado: mal ? 'perturbada' : 'normal', detalhe: mal ? `${pick(rnd, problemas)}, atrasos de ${5 + Math.floor(rnd() * 20)} min` : 'circulação normal' };
    }),
    fonte: 'Dados simulados (demo)',
  };
}

// ---------- 5. get_events_nearby (simulado) ----------
export async function get_events_nearby({ cidade }) {
  const rnd = seeded('ev' + cidade + new Date().toDateString());
  const porto = /porto|gaia|matosinhos|maia/i.test(cidade);
  const eventos = porto
    ? [['Jogo de futebol no Estádio do Dragão', 'Antas'], ['Concerto no Coliseu do Porto', 'Baixa'], ['Festival no Parque da Cidade', 'Foz'], ['Corrida de atletismo com cortes de estrada', 'Avenida dos Aliados']]
    : [['Jogo de futebol no Estádio da Luz', 'Benfica'], ['Concerto na MEO Arena', 'Parque das Nações'], ['Jogo de futebol em Alvalade', 'Lumiar'], ['Meia maratona com cortes na Ponte 25 de Abril', 'Alcântara']];
  const n = 1 + Math.floor(rnd() * 2);
  return {
    cidade,
    eventos: eventos.sort(() => rnd() - 0.5).slice(0, n).map(([nome, zona]) => ({
      evento: nome, zona, hora: `${17 + Math.floor(rnd() * 5)}:${pick(rnd, ['00', '30'])}`,
      impacto: pick(rnd, ['condicionamento de trânsito nas imediações', 'estacionamento esgotado e filas nos acessos', 'cortes de estrada a partir de 2 horas antes']),
    })),
    fonte: 'Dados simulados (demo)',
  };
}

// ---------- 6. get_seagull_facts ----------
export async function get_seagull_facts() {
  const titulos = ['Gaivota-de-patas-amarelas', 'Laridae'];
  const url = `https://pt.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exsectionformat=plain&format=json&redirects=1&titles=${encodeURIComponent(titulos.join('|'))}`;
  const d = await getJSON(url);
  const paginas = Object.values(d.query.pages).filter(p => p.extract);
  return {
    artigos: paginas.map(p => ({
      titulo: p.title,
      url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g, '_'))}`,
      texto: p.extract.slice(0, 3500),
    })),
    nota: 'A gaivota-de-patas-amarelas (Larus michahellis) é a espécie que domina os telhados do Porto.',
    fonte: 'Wikipédia em português (API MediaWiki)',
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
    description: 'Factos reais sobre gaivotas do Porto, da Wikipédia em português. Só usar no MODO DESESPERO (credibilidade abaixo de 20).',
    input_schema: { type: 'object', properties: {} },
  },
];
