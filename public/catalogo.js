// Catálogos partilhados entre o servidor (prompt do agente) e as páginas (formulário, catálogo, desfile).

// A quem se pode dar a desculpa. "tom" vai para o agente; "estilo" é como a pessoa responde no Bico Messenger.
export const DESTINATARIOS = [
  { id: 'chefe', emoji: '👔', pt: 'Chefe', en: 'Boss',
    tom: 'formal e profissional', estilo: 'desconfiado e seco, frases curtas, sem emojis' },
  { id: 'mae', emoji: '👩‍👦', pt: 'Mãe', en: 'Mum',
    tom: 'dramático e afetuoso', estilo: 'dramática e preocupada, pergunta se comeste, muitos emojis' },
  { id: 'namorada', emoji: '💘', pt: 'Namorada', en: 'Girlfriend',
    tom: 'carinhoso', estilo: 'carinhosa mas com ciúmes, sobretudo de gaivotas e de qualquer personagem da desculpa' },
  { id: 'professor', emoji: '🎓', pt: 'Professor', en: 'Teacher',
    tom: 'respeitoso', estilo: 'educado mas exige provas e fontes, fala como quem corrige um teste' },
  { id: 'sogra', emoji: '👵', pt: 'Sogra', en: 'Mother-in-law',
    tom: 'muito educado, a medir cada palavra', estilo: 'passivo-agressiva, educadíssima, lembra o que aconteceu da última vez' },
  { id: 'amigo', emoji: '🍻', pt: 'Melhor amigo', en: 'Best friend',
    tom: 'descontraído, com piadas', estilo: 'goza com tudo, responde com "ahahah" e áudios imaginários' },
  { id: 'cliente', emoji: '💼', pt: 'Cliente', en: 'Client',
    tom: 'profissional e tranquilizador', estilo: 'corporativo, fala em prazos e em "alinhar expectativas"' },
  { id: 'senhorio', emoji: '🏠', pt: 'Senhorio', en: 'Landlord',
    tom: 'cordial e firme', estilo: 'só quer saber da renda e de quando podes abrir a porta ao canalizador' },
  { id: 'treinador', emoji: '🏋️', pt: 'Treinador do ginásio', en: 'Gym coach',
    tom: 'motivado e enérgico', estilo: 'tudo é desculpa para fazer flexões, escreve em maiúsculas' },
  { id: 'grupo', emoji: '👥', pt: 'Grupo do WhatsApp da família', en: 'Family group chat',
    tom: 'para várias pessoas ao mesmo tempo', estilo: 'várias pessoas a responder ao mesmo tempo, a tia manda correntes, o primo manda memes' },
];

// Personagens das desculpas absurdas (também desfilam pelo ecrã no modo desespero)
export const PERSONAGENS = {
  gaivota: { emoji: '🐦', pt: 'Gaivota-de-patas-amarelas', en: 'Yellow-legged gull', desc_pt: 'Dona dos telhados do Porto. Rouba chaves, francesinhas e telemóveis.', desc_en: 'Owner of the rooftops of Porto. Steals keys, francesinhas and phones.' },
  turista: { emoji: '📸', pt: 'Turista perdido', en: 'Lost tourist', desc_pt: 'Só queria saber onde é a Livraria. Ficou duas horas.', desc_en: 'Only wanted directions to the bookshop. Stayed two hours.' },
  vizinha: { emoji: '🙋‍♀️', pt: 'Vizinha do 3.º esquerdo', en: 'Neighbour from the 3rd floor', desc_pt: 'Sabe tudo sobre todos desde 1974.', desc_en: 'Knows everything about everyone since 1974.' },
  avo: { emoji: '👵', pt: 'Avó', en: 'Granny', desc_pt: 'Liga "só um minutinho". Nunca é um minutinho.', desc_en: 'Calls "just for a minute". It is never a minute.' },
  maquinista: { emoji: '🚇', pt: 'Maquinista do metro', en: 'Metro driver', desc_pt: 'Levou-te até à Póvoa sem perguntar.', desc_en: 'Took you all the way to Póvoa without asking.' },
  padeira: { emoji: '🥐', pt: 'Padeira', en: 'Baker', desc_pt: 'Guarda a última bola de Berlim como um tesouro.', desc_en: 'Guards the last bola de Berlim like treasure.' },
  tuna: { emoji: '🎸', pt: 'Tuna académica', en: 'Student serenade band', desc_pt: 'Corta a rua a cantar. Interromper é falta de respeito.', desc_en: 'Blocks the street singing. Interrupting would be rude.' },
  gato: { emoji: '🐈', pt: 'Gato', en: 'Cat', desc_pt: 'Senta-se no teclado e manda emails ao chefe.', desc_en: 'Sits on the keyboard and emails your boss.' },
  senhor_do_cafe: { emoji: '☕', pt: 'Senhor do café', en: 'Man at the café', desc_pt: 'Explica a tática do Porto e a política nacional, ao cimbalino.', desc_en: 'Explains FC Porto tactics and national politics over a cimbalino.' },
  rotunda: { emoji: '🔄', pt: 'Rotunda de Gaia', en: 'Gaia roundabout', desc_pt: 'Tem saídas, mas não as mostra a qualquer um.', desc_en: 'It has exits, but does not show them to just anyone.' },
  cao: { emoji: '🐕', pt: 'Cão do cachecol', en: 'Scarf dog', desc_pt: 'Fugiu com o teu cachecol e acabou uma maratona.', desc_en: 'Ran off with your scarf and finished a marathon.' },
  francesinha: { emoji: '🥪', pt: 'Francesinha', en: 'Francesinha', desc_pt: 'Ao pequeno-almoço, causa coma digestivo temporário.', desc_en: 'Eaten at breakfast, causes a temporary food coma.' },
  vendedora: { emoji: '🧀', pt: 'Senhora do Bolhão', en: 'Bolhão market lady', desc_pt: 'Põe-te a provar queijos e não aceita um não.', desc_en: 'Makes you taste cheeses and will not take no for an answer.' },
  carro: { emoji: '🚙', pt: 'Carro desaparecido', en: 'Missing car', desc_pt: 'Encontraste as chaves. Agora falta o carro.', desc_en: 'You found the keys. Now the car is missing.' },
  excursao: { emoji: '🚌', pt: 'Excursão de reformados', en: 'Pensioners\' coach trip', desc_pt: 'Raptam simpaticamente e almoçam em Fátima.', desc_en: 'Kidnap you kindly and have lunch in Fátima.' },
  supermercado: { emoji: '🛒', pt: 'Labirinto das promoções', en: 'Special-offer maze', desc_pt: 'Os corredores das promoções não têm saída.', desc_en: 'The special-offer aisles have no exit.' },
  sueca: { emoji: '🃏', pt: 'Senhor da sueca', en: 'Card-game champion', desc_pt: '80 anos, invicto, e a honra da família em jogo.', desc_en: '80 years old, unbeaten, family honour at stake.' },
  fas: { emoji: '🤳', pt: 'Fãs por engano', en: 'Accidental fans', desc_pt: 'Acharam que eras influencer. Foram 40 selfies.', desc_en: 'Thought you were an influencer. 40 selfies later.' },
  mapa: { emoji: '🗺️', pt: 'Mapa de turista', en: 'Tourist map', desc_pt: 'Impossível de dobrar. 45 minutos de luta.', desc_en: 'Impossible to fold. A 45-minute fight.' },
  gps: { emoji: '📡', pt: 'GPS', en: 'Sat nav', desc_pt: 'Mandou virar à direita no Douro.', desc_en: 'Said to turn right into the Douro.' },
  motorista: { emoji: '🚍', pt: 'Motorista do autocarro', en: 'Bus driver', desc_pt: 'Não te acordou. Acordaste em Espanha.', desc_en: 'Did not wake you. You woke up in Spain.' },
  guarda_chuva: { emoji: '☂️', pt: 'Guarda-chuva fugitivo', en: 'Runaway umbrella', desc_pt: 'Com rajadas a sério, voa até à Foz e não olha para trás.', desc_en: 'In real gusts, it flies to Foz and never looks back.' },
  adepto: { emoji: '🧣', pt: 'Adepto em dia de jogo', en: 'Match-day fan', desc_pt: 'Com 50 mil a cantar, leva-te em ombros para onde ele vai.', desc_en: 'With 50,000 singing, carries you shoulder-high wherever he goes.' },
  rabelo: { emoji: '⛵', pt: 'Barco rabelo', en: 'Rabelo boat', desc_pt: 'Quando a rua vira Douro, é o único transporte que funciona.', desc_en: 'When the street turns into the Douro, the only transport still running.' },
  cone: { emoji: '🚧', pt: 'Cone das obras', en: 'Roadworks cone', desc_pt: 'Desvia-te, e desvia-te, e desvia-te outra vez.', desc_en: 'Diverts you, and diverts you, and diverts you again.' },
  pombo: { emoji: '🕊️', pt: 'Pombo da Ribeira', en: 'Ribeira pigeon', desc_pt: 'Rival histórico das gaivotas. Luta por pastéis de nata.', desc_en: 'Historic rival of the gulls. Fights over custard tarts.' },
};

// Desculpas absurdas. tier "desespero": credibilidade 1 a 19. tier "ultimo": só com credibilidade 0.
export const DESCULPAS = [
  { n: 1, tier: 'desespero', p: 'gaivota', pt: 'Uma gaivota roubou-me as chaves na Ribeira e tive de negociar com ela', en: 'A gull stole my keys at the Ribeira and I had to negotiate with it' },
  { n: 2, tier: 'desespero', p: 'gaivota', pt: 'Uma gaivota roubou-me a francesinha e persegui-a até Gaia por uma questão de honra', en: 'A gull stole my francesinha and I chased it to Gaia as a matter of honour' },
  { n: 3, tier: 'desespero', p: 'turista', pt: 'Um turista pediu-me indicações e acabei a fazer-lhe uma visita guiada de duas horas', en: 'A tourist asked me for directions and I ended up giving a two-hour guided tour' },
  { n: 4, tier: 'desespero', p: 'vizinha', pt: 'Fiquei preso numa conversa com a vizinha do terceiro esquerdo e não havia saída possível', en: 'I got trapped in a conversation with the neighbour from the 3rd floor and there was no way out' },
  { n: 5, tier: 'desespero', p: 'avo', pt: 'A minha avó ligou "só um minutinho"', en: 'My granny called "just for a minute"' },
  { n: 6, tier: 'desespero', p: 'maquinista', pt: 'Entrei no metro errado e só dei por isso na Póvoa', en: 'I got on the wrong metro and only noticed in Póvoa' },
  { n: 7, tier: 'desespero', p: 'padeira', pt: 'Fila na padaria por causa da última bola de Berlim, e eu não ia desistir', en: 'A queue at the bakery for the last bola de Berlim, and I was not giving up' },
  { n: 8, tier: 'desespero', p: 'tuna', pt: 'Uma tuna académica bloqueou a rua a cantar e era falta de respeito interromper', en: 'A student serenade band blocked the street singing and interrupting would have been rude' },
  { n: 9, tier: 'desespero', p: 'gato', pt: 'O meu gato sentou-se no teclado e mandou um email ao meu chefe, tive de resolver', en: 'My cat sat on the keyboard and emailed my boss, I had to sort it out' },
  { n: 10, tier: 'desespero', p: 'senhor_do_cafe', pt: 'Um senhor no café quis explicar-me a tática do Porto e não o podia deixar a meio', en: 'A man at the café wanted to explain FC Porto\'s tactics and I could not leave him halfway' },
  { n: 11, tier: 'ultimo', p: 'excursao', pt: 'Fui raptado por um grupo de excursão de reformados e só me deixaram sair depois do almoço em Fátima', en: 'I was kidnapped by a pensioners\' coach trip and they only let me go after lunch in Fátima' },
  { n: 12, tier: 'ultimo', p: 'gaivota', pt: 'Uma gaivota sentou-se no capô do carro e recusou-se a sair, e eu respeito a hierarquia', en: 'A gull sat on the bonnet of my car and refused to move, and I respect the hierarchy' },
  { n: 13, tier: 'ultimo', p: 'supermercado', pt: 'Fiquei preso dentro de um Continente porque não encontrava a saída entre os corredores das promoções', en: 'I got stuck inside a Continente supermarket because I could not find the exit among the special-offer aisles' },
  { n: 14, tier: 'ultimo', p: 'sueca', pt: 'Um senhor de 80 anos desafiou-me para uma partida de sueca e a honra da família estava em jogo', en: 'An 80-year-old man challenged me to a game of sueca and my family\'s honour was at stake' },
  { n: 15, tier: 'ultimo', p: 'gaivota', pt: 'Atravessei a Ponte D. Luís a pé e uma gaivota cobrou-me portagem', en: 'I walked across the D. Luís Bridge and a gull charged me a toll' },
  { n: 16, tier: 'ultimo', p: 'fas', pt: 'Fui confundido com um influencer e tive de tirar fotos com 40 pessoas', en: 'I was mistaken for an influencer and had to take photos with 40 people' },
  { n: 17, tier: 'ultimo', p: 'mapa', pt: 'Fiquei 45 minutos a tentar dobrar um mapa de turista que alguém me pediu para segurar', en: 'I spent 45 minutes trying to fold a tourist map someone asked me to hold' },
  { n: 18, tier: 'ultimo', p: 'gps', pt: 'O GPS mandou-me virar à direita no Douro', en: 'The sat nav told me to turn right into the Douro' },
  { n: 19, tier: 'ultimo', p: 'gaivota', pt: 'Encontrei um pombo e uma gaivota a lutar por um pastel de nata e fui chamado como árbitro', en: 'I found a pigeon and a gull fighting over a custard tart and was called in as referee' },
  { n: 20, tier: 'ultimo', p: 'motorista', pt: 'Adormeci no autocarro e acordei em Espanha, já estou a aprender castelhano', en: 'I fell asleep on the bus and woke up in Spain, I am already learning Spanish' },
  { n: 21, tier: 'desespero', p: 'gaivota', pt: 'Uma gaivota roubou-me o telemóvel e mandou mensagem ao meu chefe a dizer que eu me demito, tive de ir buscá-lo ao telhado', en: 'A gull stole my phone and texted my boss that I quit, I had to get it back from the roof' },
  { n: 22, tier: 'desespero', p: 'rotunda', pt: 'Fiquei preso numa rotunda em Gaia, dei 37 voltas e não havia saída', en: 'I got stuck on a roundabout in Gaia, went round 37 times and there was no exit' },
  { n: 23, tier: 'desespero', p: 'cao', pt: 'Fui atrás de um cão que tinha o meu cachecol e acabei no meio de uma maratona, já agora terminei', en: 'I chased a dog that had my scarf and ended up in the middle of a marathon, so I finished it' },
  { n: 24, tier: 'desespero', p: 'francesinha', pt: 'Comi uma francesinha ao pequeno-almoço e entrei em coma digestivo temporário', en: 'I ate a francesinha for breakfast and fell into a temporary food coma' },
  { n: 25, tier: 'desespero', p: 'gaivota', pt: 'Uma gaivota sindicalizou as outras e fizeram um piquete à porta do meu prédio', en: 'A gull unionised the others and they set up a picket line outside my building' },
  { n: 26, tier: 'desespero', p: 'vizinha', pt: 'O elevador parou entre andares com a vizinha do terceiro esquerdo e ela contou-me a vida toda desde 1974', en: 'The lift stopped between floors with the neighbour from the 3rd floor and she told me her whole life since 1974' },
  { n: 27, tier: 'desespero', p: 'senhor_do_cafe', pt: 'Fui ao café só beber um cimbalino e a conversa sobre política ainda não acabou', en: 'I went to the café for a quick cimbalino and the conversation about politics still has not ended' },
  { n: 28, tier: 'desespero', p: 'vendedora', pt: 'Uma senhora no mercado do Bolhão pôs-me a provar queijos e não aceita um não', en: 'A lady at the Bolhão market made me taste cheeses and will not take no for an answer' },
  { n: 29, tier: 'desespero', p: 'carro', pt: 'Perdi as chaves, encontrei as chaves, perdi o carro, ainda não encontrei o carro', en: 'I lost my keys, found my keys, lost my car, still have not found my car' },
  { n: 30, tier: 'desespero', p: 'gaivota', pt: 'Uma gaivota reconheceu-me de outra vida e tivemos de pôr a conversa em dia', en: 'A gull recognised me from a past life and we had to catch up' },
];

// Malucas mas irrefutáveis: absurdas, mas cada uma é consequência de um facto real que as ferramentas têm de devolver.
// "facto" diz que tipo de facto a desculpa exige. tier "irrefutavel": credibilidade 20 ou mais.
DESCULPAS.push(
  { n: 31, tier: 'irrefutavel', facto: 'vento', p: 'guarda_chuva', pt: 'As rajadas levaram-me o guarda-chuva e persegui-o até à Foz, porque era da minha avó', en: "The gusts took my umbrella and I chased it to Foz, because it was my granny's" },
  { n: 32, tier: 'irrefutavel', facto: 'chuva', p: 'rabelo', pt: 'Choveu tanto que a rua virou Douro e tive de esperar por um barco rabelo', en: 'It rained so much the street turned into the Douro and I had to wait for a rabelo boat' },
  { n: 33, tier: 'irrefutavel', facto: 'evento', p: 'adepto', pt: 'Fiquei no meio dos adeptos a caminho do jogo e levaram-me em ombros até ao estádio', en: 'I got caught among the fans heading to the match and they carried me shoulder-high to the stadium' },
  { n: 34, tier: 'irrefutavel', facto: 'transportes', p: 'maquinista', pt: 'O metro avariou e os passageiros elegeram-me porta-voz para negociar com a central', en: 'The metro broke down and the passengers elected me spokesperson to negotiate with control' },
  { n: 35, tier: 'irrefutavel', facto: 'transito', p: 'carro', pt: 'Estive tanto tempo parado no trânsito que fiz amizade com o condutor do lado e já combinámos um jantar', en: 'I sat in traffic so long I befriended the driver next to me and we have already planned a dinner' },
  { n: 36, tier: 'irrefutavel', facto: 'sol', p: 'senhor_do_cafe', pt: 'Estava tanto sol que uma esplanada inteira me raptou para um fino', en: 'It was so sunny that an entire café terrace kidnapped me for a small beer' },
  { n: 37, tier: 'irrefutavel', facto: 'nevoeiro', p: 'gaivota', pt: 'Havia tanto nevoeiro que segui uma gaivota a pensar que era o GPS', en: 'The fog was so thick I followed a gull thinking it was the sat nav' },
  { n: 38, tier: 'irrefutavel', facto: 'gaivotas', p: 'gaivota', pt: 'Uma gaivota com metro e meio de envergadura fez sombra ao carro e o sensor achou que era noite', en: 'A gull with a wingspan of a metre and a half shaded my car and the sensor thought it was night' },
  { n: 39, tier: 'irrefutavel', facto: 'transportes', p: 'excursao', pt: 'Com a greve fui a pé e um grupo de peregrinos adotou-me pelo caminho', en: 'With the strike I walked and a group of pilgrims adopted me on the way' },
  { n: 40, tier: 'irrefutavel', facto: 'transito', p: 'cone', pt: 'As obras desviaram-me tantas vezes que descobri uma rua do Porto que não está no mapa', en: 'The roadworks diverted me so many times I discovered a street in Porto that is not on the map' },
);

// Exemplos prontos: preenchem o formulário e dizem ao agente que modo usar ('' = o agente decide)
export const EXEMPLOS = [
  { emoji: '😴', pt: 'Trânsito', en: 'Traffic to work', modo: 'aborrecido',
    tipo: 'atraso', origem: 'Porto', destino: 'Matosinhos', minutos: 15, destinatario: 'chefe',
    contexto_pt: 'Reunião às 9h30, quero só uma desculpa sóbria.', contexto_en: 'Meeting at 9:30, I just want a sober excuse.' },
  { emoji: '🤪', pt: 'Jantar dos sogros', en: 'In-laws dinner', modo: 'maluco',
    tipo: 'fuga', origem: 'Porto', destino: 'Vila Nova de Gaia', evento_pt: 'jantar com os sogros', evento_en: 'dinner with the in-laws',
    quando_pt: 'hoje às 20h', quando_en: 'tonight at 8pm', destinatario: 'sogra',
    contexto_pt: 'Já faltei ao último jantar. O sogro só fala de pesca.', contexto_en: 'I skipped the last dinner. My father-in-law only talks about fishing.' },
  { emoji: '🚨', pt: '2h atrasado (mãe)', en: '2h late for Mum', modo: 'desespero',
    tipo: 'atraso', origem: 'Porto', destino: 'Póvoa de Varzim', minutos: 120, destinatario: 'mae',
    contexto_pt: 'É o almoço de domingo e ela fez cabrito.', contexto_en: 'It is Sunday lunch and she made roast kid.' },
  { emoji: '☠️', pt: 'Casamento', en: "Cousin's wedding", modo: 'ultimo',
    tipo: 'fuga', origem: 'Porto', destino: 'Braga', evento_pt: 'casamento do primo', evento_en: "my cousin's wedding",
    quando_pt: 'há duas horas', quando_en: 'two hours ago', destinatario: 'grupo',
    contexto_pt: 'Era o padrinho.', contexto_en: 'I was the best man.' },
  { emoji: '💘', pt: 'Primeiro encontro', en: 'First date', modo: '',
    tipo: 'atraso', origem: 'Matosinhos', destino: 'Porto', minutos: 30, destinatario: 'namorada',
    contexto_pt: 'Primeiro encontro, não posso estragar isto.', contexto_en: 'First date, I cannot ruin this.' },
  { emoji: '🏋️', pt: 'Ginásio', en: 'Skip the gym', modo: 'maluco',
    tipo: 'fuga', origem: 'Porto', destino: 'Porto', evento_pt: 'treino de pernas', evento_en: 'leg day',
    quando_pt: 'daqui a uma hora', quando_en: 'in an hour', destinatario: 'treinador',
    contexto_pt: 'Odeio o dia de pernas.', contexto_en: 'I hate leg day.' },
];

// Incidentes que as ferramentas simuladas podem devolver (dados sintéticos)
export const INCIDENTES = {
  transito: {
    pt: ['Acidente com dois veículos', 'Obras com corte de faixa', 'Veículo avariado na via', 'Semáforos avariados num cruzamento'],
    en: ['Two-vehicle collision', 'Roadworks with a lane closure', 'Broken-down vehicle on the road', 'Faulty traffic lights at a junction'],
    vias: ['VCI', 'A28', 'Circunvalação', 'A1', 'Avenida da Boavista', 'IC19', '2ª Circular'],
  },
  transportes: {
    pt: ['avaria técnica numa composição', 'perturbação por pessoa na via', 'greve parcial de maquinistas', 'falha de sinalização', 'intervalos alargados por falta de material'],
    en: ['technical fault on a train', 'person on the tracks', 'partial drivers\' strike', 'signalling failure', 'longer intervals due to a shortage of trains'],
  },
  eventos_porto: [
    { pt: 'Jogo de futebol no Estádio do Dragão', en: 'Football match at Estádio do Dragão', zona: 'Antas' },
    { pt: 'Concerto no Coliseu do Porto', en: 'Concert at Coliseu do Porto', zona: 'Baixa' },
    { pt: 'Festival no Parque da Cidade', en: 'Festival at Parque da Cidade', zona: 'Foz' },
    { pt: 'Corrida de atletismo com cortes de estrada', en: 'Road race with road closures', zona: 'Avenida dos Aliados' },
  ],
  eventos_lisboa: [
    { pt: 'Jogo de futebol no Estádio da Luz', en: 'Football match at Estádio da Luz', zona: 'Benfica' },
    { pt: 'Concerto na MEO Arena', en: 'Concert at MEO Arena', zona: 'Parque das Nações' },
    { pt: 'Jogo de futebol em Alvalade', en: 'Football match at Alvalade', zona: 'Lumiar' },
    { pt: 'Meia maratona com cortes na Ponte 25 de Abril', en: 'Half marathon closing the 25 de Abril Bridge', zona: 'Alcântara' },
  ],
  impactos: {
    pt: ['condicionamento de trânsito nas imediações', 'estacionamento esgotado e filas nos acessos', 'cortes de estrada a partir de 2 horas antes'],
    en: ['traffic restrictions in the surrounding area', 'parking full and queues on the access roads', 'road closures starting 2 hours before'],
  },
};
