# Desculpómetro: guia da apresentação

## Pôr a correr

```powershell
cd C:\Git\desculpometro
npm install                      # só na primeira vez
$env:ANTHROPIC_API_KEY = "..."   # só é preciso para gerar desculpas ao vivo
npm start
```

Abrir http://localhost:3000 e carregar em **Ctrl+F5** (para o browser não usar código antigo).

- Os **exemplos** por cima do formulário são desculpas já gravadas: funcionam sem chave e sem internet para a IA, e demoram cerca de 6 s.
- **"Generate excuse"** usa o agente ao vivo e demora 15 a 25 s (precisa da chave).
- Para gravar outras versões dos exemplos, com o servidor a correr: `node scripts/gravar-demos.mjs`.

## Desculpas gravadas (em inglês)

| Exemplo | O que sai |
|---|---|
| 😴 Traffic to work | aborrecido, 85: "Faulty traffic lights delayed my journey" |
| 🤪 In-laws dinner | maluco, 46: "Passengers elected me metro spokesperson" |
| 🚨 2h late for Mum | desespero, 14: "I gave a lost tourist a two-hour tour"; o turista entra no Messenger |
| ☠️ Cousin's wedding | último recurso, 0: "Mistaken for an influencer: 40 selfies"; culpado no Messenger, tribunal 0-3 e prisão |
| 💘 First date | maluco, 80: "Roadworks sent me down a secret street" |
| 🏋️ Skip the gym | maluco, 66: "Pilgrims adopted me during the strike" |

Também há versões em português de todos (botão 🌐 no canto superior direito).

## Guião (2 a 3 minutos)

**Antes de começar**
- Ctrl+F5, língua em English, janela em ecrã inteiro.
- Fazer um ensaio completo com "Cousin's wedding".

**1. O problema (15 s)**
- "Toda a gente já chegou atrasada. E a desculpa de trânsito já ninguém a ouve."
- "O Desculpómetro é um agente de IA que investiga o teu caminho e monta a desculpa mais credível possível, só com factos verdadeiros."

**2. Primeiro contraste (20 s), 😴 Traffic to work**
- Mostrar os cartões do agente a aparecer: tempo, trânsito, transportes.
- "Isto é o modo aborrecido. Funciona, mas é o que o Desculpómetro existe para evitar."

**3. O momento maluco (30 s), 🤪 In-laws dinner ou 💘 First date**
- "Agora o agente pega num facto real e transforma-o numa história absurda mas irrefutável."
- Apontar para o título gigante, o vídeo da câmara de vigilância e a entrevista do Diário do Bico TV.

**4. O clímax (45 s), ☠️ Cousin's wedding**
- A sirene dispara e o ecrã fica vermelho: "credibilidade zero, último recurso".
- "📲 Send it": a família reage no Bico Messenger, recebe o link do Diário do Bico e o culpado entra na conversa a confirmar tudo.
- "⚖️ Take it to court": três juízes IA votam, chumbam por 0-3 e és preso, com a gaivota-guarda.
- Rematar com "😇 Or just tell the truth".

**5. Como decide (30 s), separador "How it works"**
- "O modelo decide sozinho que ferramentas chamar e por que ordem; nada está fixo no código."
- "Usa dados reais quando existem: Open-Meteo, Wikipédia e TomTom. Para transportes e eventos, as APIs são pagas, por isso injetamos dados sintéticos, sempre marcados como simulados."
- "As mesmas ferramentas também estão disponíveis como servidor MCP."
- "São várias IAs: o agente investigador, o destinatário que responde e três juízes independentes."

**6. Fecho (15 s)**
- "Para quem é: qualquer pessoa atrasada, com vergonha ou sem vontade de ir ao jantar dos sogros."
- "O que o torna especial: as desculpas são absurdas, mas os factos são verdadeiros."
- Se houver tempo, deixar alguém do público escolher um exemplo, ou fazer um "Generate excuse" ao vivo.

## Dicas

- Usar os exemplos gravados durante o pitch; o modo ao vivo só no fim, porque demora 15 a 25 s.
- Enquanto as animações correm, falar por cima: não esperar em silêncio.
- Se a internet falhar, os exemplos gravados continuam a funcionar.
- Respostas às perguntas do júri: o que faz (passos 1 a 3), para quem é (passo 6), como decide (passo 5), o que é especial (passo 6).
