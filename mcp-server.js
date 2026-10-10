// Servidor MCP (stdio) com as mesmas 6 ferramentas do agente do Desculpómetro.
// Uso: claude mcp add desculpometro -- node C:\Git\desculpometro\mcp-server.js
// Cada ferramenta aceita um argumento extra opcional "lang" ("pt" ou "en").
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { toolDefs, handlers } from './tools.js';

const server = new Server({ name: 'desculpometro', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefs.map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: {
      ...t.input_schema,
      properties: { ...t.input_schema.properties, lang: { type: 'string', enum: ['pt', 'en'], description: 'Língua do texto devolvido' } },
    },
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async req => {
  const { name, arguments: args = {} } = req.params;
  const fn = handlers[name];
  if (!fn) return { content: [{ type: 'text', text: `Ferramenta desconhecida: ${name}` }], isError: true };
  const { lang, ...input } = args;
  try {
    const resultado = await fn(input, { lang: lang === 'en' ? 'en' : 'pt' });
    return { content: [{ type: 'text', text: JSON.stringify(resultado, null, 2) }] };
  } catch (e) {
    return { content: [{ type: 'text', text: `Erro: ${e.message}` }], isError: true };
  }
});

await server.connect(new StdioServerTransport());
