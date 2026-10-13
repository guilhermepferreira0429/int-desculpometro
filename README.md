> **Arquivado.** Este repositório já não é atualizado; o desenvolvimento continua num repositório privado.

# Desculpómetro (a.k.a. the Excuse-o-meter)

Agentic AI Challenge · Team Tiki Taska.

Running late? An AI agent checks what is really happening on your way (weather, traffic, public transport, events) and builds the most believable excuse possible, using only true facts. When the facts are not enough, it goes into desperation mode: seagulls, grannies on coach trips and a tabloid written by gulls.

## Run it

```bash
npm install
cp .env.example .env   # and put your ANTHROPIC_API_KEY in it
npm start
```

Open http://localhost:3000. The example buttons replay recorded excuses and work without an API key; "Generate excuse" calls the agent live.

- `server.js`: agent loop (Claude Sonnet 5.5 with tool use), Bico Messenger recipient and the three court judges
- `tools.js`: the 6 tools (Open-Meteo and Wikipedia are real; TomTom is real with a key; transport and events are synthetic and always labelled as simulated)
- `mcp-server.js`: the same tools as an MCP server (`claude mcp add desculpometro -- node mcp-server.js`)
- `public/`: the app, the catalogue, "How it works", the pitch (`pitch.html`) and the recorded demos
- `scripts/gravar-demos.mjs`: re-record the demos with the live agent

All parodies (Diário do Bico, interviews, CCTV footage) are clearly fictional.
