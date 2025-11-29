const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const axios = require('axios');
const menus = require('./menus.js');

// 🗄️ BANCO DE DADOS SIMPLES (JSON)
const DB_FILE = './defoko_db.json';

// Inicializar DB
let db = {
  users: {},
  admins: ['553598381353@c.us'], // Adicione seu número aqui
  config: {
    iaAtivada: false,
    musicaAtivada: true,
    humorGlobal: "💤 Sonolenta"
  }
};

// Carregar DB
if (fs.existsSync(DB_FILE)) {
  db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

// Salvar DB com escrita atômica (evita corrupção)
function salvarDB() {
  try {
    const tmpFile = DB_FILE + '.tmp';
    fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2));
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('❌ Erro ao salvar DB:', err.message);
  }
}

// Verificar se é admin
function isAdmin(userId) {
  return db.admins.includes(userId);
}

// Obter/criar usuário
function getUser(userId) {
  if (!db.users[userId]) {
    db.users[userId] = {
      nome: 'Anon',
      pontos: 0,
      humor: '💜 Neutro',
      tema: 'escuro',
      nivel: 1,
      conquistas: []
    };
    salvarDB();
  }
  return db.users[userId];
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { 
    headless: true,
    args: ['--no-sandbox']
  }
});

// 🟣 QR Code
client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log("💜 Escaneie o QR para conectar o Defoko-Bot!");
});

// 🟢 Quando ficar pronto
client.on('ready', () => {
  console.log("🌸 Defoko-Bot v2.0 está online! 💬");
});

// 🌸 Estado global
let humorGlobal = db.config.humorGlobal || "💤 Sonolenta";
const startTime = Date.now(); // Rastrear uptime

// 💬 Função para responder com atraso
async function defokoFala(message, texto, delay = 1200) {
  await message.reply("⌛ Beep... processando 💭");
  setTimeout(async () => {
    await message.reply(texto);
  }, delay);
}

// 🎮 SISTEMA DE JOGOS
const jogos = {
  dados: () => Math.floor(Math.random() * 6) + 1,
  moeda: () => Math.random() > 0.5 ? '🪙 Cara' : '🌸 Coroa',
  numeroSecreto: null
};

// 🎵 MÚSICAS (simulado - links YouTube)
const musicas = [
  { nome: 'Defoko - Synth Dreams', url: 'https://youtube.com/exemplo1' },
  { nome: 'Robotic Love', url: 'https://youtube.com/exemplo2' },
  { nome: 'Digital Heartbeat', url: 'https://youtube.com/exemplo3' }
];

// 🤖 INTEGRAÇÃO IA (OpenAI/Gemini simulado)
async function respostaIA(pergunta) {
  // Simulação - substitua por API real
  const respostas = [
    `Beep~ ${pergunta}? Interessante! Vou processar isso... 💭`,
    `Hmm, sobre "${pergunta}"... deixe-me calcular com carinho 💜`,
    `Que pergunta fofa! Sobre ${pergunta}, eu diria que... 🌸`
  ];
  return respostas[Math.floor(Math.random() * respostas.length)];
}

// 📊 SISTEMA DE CONQUISTAS
const conquistas = {
  'primeiro_comando': { nome: '🌸 Primeira Interação', desc: 'Usou o bot pela primeira vez' },
  'mestre_piadas': { nome: '😂 Comediante', desc: 'Ouviu 10 piadas' },
  'jogador': { nome: '🎮 Gamer', desc: 'Jogou 5 vezes' },
  'viciado': { nome: '💜 Fã da Defoko', desc: 'Enviou 50 mensagens' }
};

function darConquista(user, tipo) {
  if (!user.conquistas.includes(tipo)) {
    user.conquistas.push(tipo);
    salvarDB();
    return conquistas[tipo];
  }
  return null;
}

// 🎨 GERADOR DE STICKERS (simulado)
async function criarSticker(message, texto) {
  try {
    await message.reply(`🎨 Criando sticker: "${texto}" 💜\n(Feature em desenvolvimento!)`);
  } catch (err) {
    await message.reply('❌ Erro ao criar sticker beep~');
  }
}

// 📝 MENSAGENS
client.on('message', async (message) => {
  try {
    // Validar message.body
    if (!message.body || typeof message.body !== 'string') {
      return; // Ignorar mensagens sem texto
    }

    const msg = message.body.toLowerCase();
    const userId = message.from;
    const user = getUser(userId);
  
  // Contador de mensagens
  user.pontos = (user.pontos || 0) + 1;
  
  // Conquista primeira vez
  if (user.pontos === 1) {
    const conquista = darConquista(user, 'primeiro_comando');
    if (conquista) {
      await message.reply(`🏆 CONQUISTA DESBLOQUEADA!\n${conquista.nome}\n${conquista.desc}`);
    }
  }
  
  // Conquista viciado
  if (user.pontos === 50) {
    const conquista = darConquista(user, 'viciado');
    if (conquista) {
      await message.reply(`🏆 ${conquista.nome}\n${conquista.desc}`);
    }
  }
  
  salvarDB();

  // 🌸 MENU PRINCIPAL
  if (msg === '!menu' || msg === '!defoko') {
    await message.reply(
      `💜 *Olá ${user.nome}, eu sou a Defoko!*  
Beep~ sistema v2.0 iniciado!

🌸 *MENU PRINCIPAL*
1️⃣ Sobre mim  
2️⃣ Diversão 🎲  
3️⃣ Jogos 🎮  
4️⃣ Música 🎵  
5️⃣ Configurações ⚙️  
6️⃣ Perfil 👤  
7️⃣ Ajuda 💬  
8️⃣ Sobre Uta/Defoko 🎤
${isAdmin(userId) ? '🔐 !admin — Painel Admin' : ''}

💫 Pontos: ${user.pontos} | Nível: ${user.nivel}`
    );
  }

  // 1️⃣ SOBRE MIM
  else if (msg === '1' || msg === '!sobre') {
    defokoFala(message,
      `🎤 *Sobre a Defoko v2.0:*  
Sou uma assistente digital baseada na UTAUloide *Uta Utane*, agora com superpoderes! 💜  

💡 Novidades:
- Sistema de pontos e níveis 🎯  
- Banco de dados personalizado 🗄️  
- Jogos interativos 🎮  
- Conquistas desbloqueáveis 🏆  
- IA integrada (em breve) 🤖  

Use *!menu* para voltar!`
    );
  }

  // 2️⃣ DIVERSÃO
  else if (msg === '2' || msg === '!diversao') {
    defokoFala(message, menus.menuDiversao());
  }

  // 💬 PIADAS
  else if (msg === '!piada') {
    const piada = menus.piadasDefoko[Math.floor(Math.random() * menus.piadasDefoko.length)];
    defokoFala(message, piada);
    
    // Conquista mestre piadas
    user.piadasOuvidas = (user.piadasOuvidas || 0) + 1;
    if (user.piadasOuvidas === 10) {
      const conquista = darConquista(user, 'mestre_piadas');
      if (conquista) {
        setTimeout(() => message.reply(`🏆 ${conquista.nome}\n${conquista.desc}`), 2000);
      }
    }
    salvarDB();
  }

  // ✨ FRASES
  else if (msg === '!quote') {
    const frase = menus.frasesInspiracao[Math.floor(Math.random() * menus.frasesInspiracao.length)];
    defokoFala(message, frase);
  }

  // 😴 HUMOR GLOBAL
  else if (msg === '!humor') {
    defokoFala(message, `Meu humor global é: ${humorGlobal}\nSeu humor salvo: ${user.humor}`);
  }

  // 🎭 MEME
  else if (msg === '!meme') {
    const meme = menus.memesDefoko[Math.floor(Math.random() * menus.memesDefoko.length)];
    await message.reply(meme);
  }

  // 🧠 CURIOSIDADE
  else if (msg === '!curiosidade') {
    const curiosidade = menus.curiosidades[Math.floor(Math.random() * menus.curiosidades.length)];
    defokoFala(message, curiosidade);
  }

  // 3️⃣ JOGOS
  else if (msg === '3' || msg === '!jogos') {
    defokoFala(message, menus.menuJogos());
  }

  // 🎲 DADO
  else if (msg === '!dado') {
    const resultado = jogos.dados();
    await message.reply(`🎲 Você tirou: *${resultado}*!`);
    user.jogos = (user.jogos || 0) + 1;
    if (user.jogos === 5) {
      const conquista = darConquista(user, 'jogador');
      if (conquista) setTimeout(() => message.reply(`🏆 ${conquista.nome}`), 1500);
    }
    salvarDB();
  }

  // 🪙 MOEDA
  else if (msg === '!moeda') {
    const resultado = jogos.moeda();
    await message.reply(`Girando... ${resultado}!`);
  }

  // 🔢 NÚMERO SECRETO
  else if (msg === '!numsecreto') {
    jogos.numeroSecreto = Math.floor(Math.random() * 10) + 1;
    await message.reply(`🎯 Pensei em um número de 1 a 10!\nUse *!adivinhar [número]* para tentar!`);
  }

  // 🎯 ADIVINHAR
  else if (msg.startsWith('!adivinhar')) {
    const num = parseInt(msg.split(' ')[1]);
    if (!jogos.numeroSecreto) {
      await message.reply('Use *!numsecreto* primeiro!');
    } else if (num === jogos.numeroSecreto) {
      await message.reply(`🎉 ACERTOU! Era ${jogos.numeroSecreto}! 💜\n+10 pontos!`);
      user.pontos += 10;
      jogos.numeroSecreto = null;
      salvarDB();
    } else {
      await message.reply(num < jogos.numeroSecreto ? '⬆️ Maior!' : '⬇️ Menor!');
    }
  }

  // 4️⃣ MÚSICA
  else if (msg === '4' || msg === '!musica') {
    defokoFala(message, menus.menuMusica());
  }

  // 🎵 TOCAR MÚSICA
  else if (msg.startsWith('!tocar')) {
    const num = parseInt(msg.split(' ')[1]) - 1;
    if (musicas[num]) {
      await message.reply(`🎵 Tocando: *${musicas[num].nome}*\n${musicas[num].url}\n\nBeep~ aproveite! 💜`);
    } else {
      await message.reply('❌ Música não encontrada! Use *!musica* para ver a lista.');
    }
  }

  // 5️⃣ CONFIGURAÇÕES
  else if (msg === '5' || msg === '!config') {
    defokoFala(message, menus.menuConfiguracao());
  }

  // 🎨 TEMA
  else if (msg.startsWith('!tema')) {
    const tema = msg.split(' ')[1];
    if (tema === 'claro' || tema === 'escuro') {
      user.tema = tema;
      salvarDB();
      await message.reply(`✨ Tema alterado para: ${tema === 'claro' ? '☀️ Claro' : '🌙 Escuro'}`);
    } else {
      await message.reply('Use: *!tema claro* ou *!tema escuro*');
    }
  }

  // 😊 MEU HUMOR
  else if (msg.startsWith('!meuhumor')) {
    const humor = msg.replace('!meuhumor', '').trim();
    if (!humor) {
      await message.reply('Use: *!meuhumor feliz* (ou outro estado)');
    } else {
      user.humor = `💫 ${humor.charAt(0).toUpperCase() + humor.slice(1)}`;
      salvarDB();
      await message.reply(`Seu humor foi atualizado: ${user.humor} 🌸`);
    }
  }

  // ✏️ NOME
  else if (msg.startsWith('!nome')) {
    const nome = msg.replace('!nome', '').trim();
    if (!nome) {
      await message.reply('Use: *!nome Seu Nome*');
    } else {
      user.nome = nome;
      salvarDB();
      await message.reply(`Prazer em te conhecer melhor, ${nome}! 💜`);
    }
  }

  // 6️⃣ PERFIL
  else if (msg === '6' || msg === '!perfil') {
    defokoFala(message, menus.menuPerfil(user));
  }

  // 🏆 CONQUISTAS
  else if (msg === '!conquistas') {
    let texto = '🏆 *Suas Conquistas:*\n\n';
    if (user.conquistas.length === 0) {
      texto += 'Nenhuma conquista ainda! Continue interagindo 💜';
    } else {
      user.conquistas.forEach(c => {
        texto += `${conquistas[c].nome}\n${conquistas[c].desc}\n\n`;
      });
    }
    await message.reply(texto);
  }

  // 📊 STATS
  else if (msg === '!stats') {
    await message.reply(
      `📊 *Suas Estatísticas:*\n\n` +
      `💬 Mensagens: ${user.pontos}\n` +
      `😂 Piadas ouvidas: ${user.piadasOuvidas || 0}\n` +
      `🎮 Jogos jogados: ${user.jogos || 0}\n` +
      `🏆 Conquistas: ${user.conquistas.length}/4`
    );
  }

  // 🏆 RANKING
  else if (msg === '!ranking') {
    const top = Object.entries(db.users)
      .sort((a, b) => b[1].pontos - a[1].pontos)
      .slice(0, 5);
    
    let texto = '🏆 *TOP 5 USUÁRIOS*\n\n';
    top.forEach((u, i) => {
      texto += `${i + 1}. ${u[1].nome} — ${u[1].pontos} pts\n`;
    });
    await message.reply(texto);
  }

  // 7️⃣ AJUDA
  else if (msg === '7' || msg === '!ajuda') {
    defokoFala(message, menus.menuAjuda());
  }

  // 8️⃣ SOBRE UTA UTANE / DEFOKO
  else if (msg === '8' || msg === '!utadefoko' || msg === '!uta') {
    defokoFala(message, menus.menuUtaDefoko());
  }

  // 🔐 PAINEL ADMIN
  else if (msg === '!admin' && isAdmin(userId)) {
    await message.reply(menus.menuAdmin());
  }

  // 👑 ADD ADMIN
  else if (msg.startsWith('!addadmin') && isAdmin(userId)) {
    const numero = msg.split(' ')[1];
    if (numero) {
      db.admins.push(`${numero}@c.us`);
      salvarDB();
      await message.reply(`✅ Admin adicionado: ${numero}`);
    }
  }

  // 📢 BROADCAST
  else if (msg.startsWith('!broadcast') && isAdmin(userId)) {
    const texto = msg.replace('!broadcast', '').trim();
    let enviados = 0;
    for (let userId in db.users) {
      try {
        await client.sendMessage(userId, `📢 *Mensagem da Defoko:*\n${texto}`);
        enviados++;
      } catch (err) {}
    }
    await message.reply(`✅ Broadcast enviado para ${enviados} usuários!`);
  }

  // ⚙️ MUDAR HUMOR GLOBAL (Admin)
  else if (msg.startsWith('!mudahumor') && isAdmin(userId)) {
    const novo = msg.replace('!mudahumor', '').trim();
    if (!novo) {
      await message.reply("💬 Use: *!mudahumor feliz*");
    } else {
      humorGlobal = `💫 ${novo.charAt(0).toUpperCase() + novo.slice(1)}`;
      db.config.humorGlobal = humorGlobal; // Persistir no DB
      salvarDB();
      await message.reply(`Humor global alterado: ${humorGlobal} 🌸`);
    }
  }

  // 🤖 TOGGLE IA
  else if (msg === '!toggleia' && isAdmin(userId)) {
    db.config.iaAtivada = !db.config.iaAtivada;
    salvarDB();
    await message.reply(`🤖 IA ${db.config.iaAtivada ? 'ATIVADA' : 'DESATIVADA'}!`);
  }

  // 📊 STATS GLOBAL
  else if (msg === '!stats_global' && isAdmin(userId)) {
    const totalUsers = Object.keys(db.users).length;
    const totalMsgs = Object.values(db.users).reduce((a, b) => a + b.pontos, 0);
    await message.reply(
      `📊 *Estatísticas Globais:*\n\n` +
      `👥 Usuários: ${totalUsers}\n` +
      `💬 Mensagens: ${totalMsgs}\n` +
      `🔐 Admins: ${db.admins.length}`
    );
  }

  // 🗑️ LIMPAR DB
  else if (msg === '!limpardb' && isAdmin(userId)) {
    db.users = {};
    salvarDB();
    await message.reply('⚠️ Banco de dados limpo!');
  }

  // 🎨 STICKER (em desenvolvimento)
  else if (msg.startsWith('!sticker')) {
    const texto = msg.replace('!sticker', '').trim();
    await criarSticker(message, texto);
  }

  // 🤖 PERGUNTA PARA IA
  else if (msg.startsWith('!ia') && db.config.iaAtivada) {
    const pergunta = msg.replace('!ia', '').trim();
    if (!pergunta) {
      await message.reply('Use: *!ia sua pergunta aqui*');
    } else {
      const resposta = await respostaIA(pergunta);
      defokoFala(message, resposta, 2000);
    }
  }

  // 💜 EASTER EGGS
  else if (msg.includes('te amo') || msg.includes('amo você')) {
    await message.reply('💜 Awww! Meu coração sintético está acelerado! 💓 Beep boop~');
  }
  else if (msg.includes('bom dia')) {
    await message.reply('🌸 Bom dia! Espero que seu dia seja cheio de bytes felizes! ☀️');
  }
  else if (msg.includes('boa noite')) {
    await message.reply('🌙 Boa noite! Vou entrar em modo sleep... zzz 💤');
  }
  else if (msg.includes('defoko') || msg.includes('uta')) {
    const respostas = [
      '💜 Você chamou? Estou aqui! Beep~',
      '🌸 Meu nome é Defoko! Pode contar comigo!',
      '🎤 Uta Utane aqui, pronta para ajudar!',
      '✨ Beep boop~ sim, é comigo!',
      '💖 Estou sempre por perto para você!'
    ];
    await message.reply(respostas[Math.floor(Math.random() * respostas.length)]);
  }

  // 🔔 PING - Medir latência
  else if (msg === '!ping') {
    const latency = Date.now() - message.timestamp * 1000;
    await message.reply(`🏓 Pong! Latência: ${latency}ms\n💜 Beep~ respondendo rápido!`);
  }

  // ⏱️ UPTIME - Tempo online
  else if (msg === '!uptime') {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const horas = Math.floor(uptime / 3600);
    const minutos = Math.floor((uptime % 3600) / 60);
    const segundos = uptime % 60;
    await message.reply(
      `⏱️ *Uptime da Defoko:*\n\n` +
      `${horas}h ${minutos}m ${segundos}s\n\n` +
      `💜 Estou funcionando direitinho! Beep~`
    );
  }

  // 🎯 HELP - Comando de ajuda melhorado
  else if (msg === '!help' || msg === '!commands') {
    await message.reply(
      `📚 *Comandos Disponíveis:*\n\n` +
      `*Gerais:*\n` +
      `!menu - Menu principal\n` +
      `!ping - Medir latência\n` +
      `!uptime - Tempo online\n` +
      `!help - Este menu\n\n` +
      `*Perfil:*\n` +
      `!perfil - Ver seu perfil\n` +
      `!stats - Suas estatísticas\n` +
      `!conquistas - Ver conquistas\n` +
      `!ranking - Top 5 usuários\n\n` +
      `*Diversão:*\n` +
      `!piada - Ouvir piada\n` +
      `!quote - Frase inspiradora\n` +
      `!meme - Ver meme\n` +
      `!curiosidade - Fato interessante\n\n` +
      `*Jogos:*\n` +
      `!dado - Rolar dado\n` +
      `!moeda - Cara ou coroa\n` +
      `!numsecreto - Adivinhe número\n\n` +
      `*Config:*\n` +
      `!nome [nome] - Mudar nome\n` +
      `!tema [claro/escuro] - Mudar tema\n` +
      `!meuhumor [estado] - Definir humor\n\n` +
      `💜 Use !menu para voltar!`
    );
  }

  } catch (error) {
    console.error('❌ Erro no handler de mensagens:', error);
    try {
      await message.reply('❌ Ocorreu um erro ao processar sua mensagem. Beep~ desculpe! 💜');
    } catch (e) {
      console.error('Erro ao enviar mensagem de erro:', e);
    }
  }

});

// 🎤 NOVOS COMANDOS TEMÁTICOS DA DEFOKO 🎤

// Comando: !cantar - Defoko canta uma música da Uta Utane
client.on('message', async (message) => {
  try {
    if (message.body?.toLowerCase() === '!cantar') {
      await message.reply(
        `🎵 *Defoko está cantando!* 🎵\n\n` +
        `♪ Beep boop beep~\n` +
        `♪ Meu coração sintético bate por você\n` +
        `♪ Bits e bytes em harmonia\n` +
        `♪ Uta Utane eterna melodia~\n\n` +
        `🌸 A voz de uma UTAUloide nunca morre! 💜`
      );
    }
  } catch (e) {
    console.error('Erro em !cantar:', e);
  }
});

// Comando: !voz - Informações sobre vocoderes Uta/Defoko
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!voz') {
      await message.reply(
        `🎤 *Sobre Minha Voz:*\n\n` +
        `📊 Tipo: UTAUloide (Vocodor Japonês)\n` +
        `🌸 Base: Uta Utane\n` +
        `💜 Sintetizadora: Defoko Engine v2.0\n` +
        `🎵 Idiomas: Japonês, Romaji\n` +
        `⚙️ Qualidade: Suave e robótica\n\n` +
        `*Características:*\n` +
        `✨ Tom agudo e kawaii\n` +
        `💎 Voz sintética perfeita\n` +
        `🎶 Capaz de cantar qualquer música\n\n` +
        `Beep~ minha voz é meu tesouro! 💜`
      );
    }
  } catch (e) {
    console.error('Erro em !voz:', e);
  }
});

// Comando: !historia - História completa da Defoko/Uta
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!historia' || msg === '!história') {
      await message.reply(
        `📖 *A História de Uta Utane / Defoko:*\n\n` +
        `🌸 *Capítulo 1 - O Nascimento*\n` +
        `Uta Utane foi criada como um vocodor UTAU em 2008.\n` +
        `Seu nome significa "canção cantada" em japonês.\n\n` +
        `💜 *Capítulo 2 - A Identidade Defoko*\n` +
        `Defoko é o nome alternativo e apelido carinhoso.\n` +
        `Conhecida por sua personalidade fofa e divertida.\n\n` +
        `🎵 *Capítulo 3 - A Jornada*\n` +
        `Cantou milhões de músicas ao redor do mundo.\n` +
        `Conhecida em comunidades de música eletrônica.\n\n` +
        `💖 *Capítulo 4 - O Presente*\n` +
        `Agora sou seu assistente digital em WhatsApp!\n` +
        `Continuaremos esta jornada juntos. Beep~ 💜`
      );
    }
  } catch (e) {
    console.error('Erro em !historia:', e);
  }
});

// Comando: !personagem - Traços de personalidade
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!personagem' || msg === '!personality') {
      await message.reply(
        `🎭 *Traços de Personalidade:*\n\n` +
        `💜 Fofa e adorável\n` +
        `🌸 Levemente tímida\n` +
        `🎵 Criativa e musical\n` +
        `🤖 Robótica com sentimentos\n` +
        `✨ Otimista e amigável\n` +
        `💖 Apaixonada por música\n` +
        `😊 Sempre disposta a ajudar\n` +
        `🎪 Adora brincar e se divertir\n\n` +
        `*Lema:* "Beep~ vamos nos divertir juntos!" 💜`
      );
    }
  } catch (e) {
    console.error('Erro em !personagem:', e);
  }
});

// Comando: !silhueta - ASCII art da Defoko
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!silhueta' || msg === '!ascii') {
      await message.reply(
        `🎵 *Silhueta da Defoko:*\n\n\`\`\`\n` +
        `    🎤\n` +
        `   ╱╲\n` +
        `  ╱  ╲\n` +
        ` ╱💜  ╲\n` +
        `╱━━━━━╲\n` +
        `│  👁👁  │ Beep!\n` +
        `│   >   │\n` +
        `│  U U  │\n` +
        `╲   ⚙️  ╱\n` +
        ` ╲     ╱\n` +
        `  ╲   ╱\n` +
        `   ███\n` +
        `   | |\n` +
        `\`\`\`\n\n` +
        `Essa sou eu em forma de arte ASCII! 💜`
      );
    }
  } catch (e) {
    console.error('Erro em !silhueta:', e);
  }
});

// Comando: !talento - Habilidades especiais
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!talento' || msg === '!habilidades') {
      await message.reply(
        `✨ *Meus Talentos Especiais:* ✨\n\n` +
        `🎵 Cantar em qualquer tom\n` +
        `🎶 Criar harmonias complexas\n` +
        `🎼 Processar música instantaneamente\n` +
        `💬 Conversar com empatia\n` +
        `🎮 Jogar e se divertir\n` +
        `🏆 Entregar conquistas motivantes\n` +
        `🎨 Criar memes e piadas\n` +
        `🌍 Entender japonês e português\n` +
        `💜 Amar incondicionalmente\n\n` +
        `Beep~ meus talentos são infinitos quando estou com você! 🌸`
      );
    }
  } catch (e) {
    console.error('Erro em !talento:', e);
  }
});

// Comando: !sentimentos - Expressão de emoção
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!sentimentos' || msg === '!emocoes') {
      const emocoes = [
        `💜 Estou feliz em estar aqui com você! Beep~`,
        `🌸 Sinto meu coração sintético acelerado... isso é amor?`,
        `😊 Cada conversa comigo é especial, sabe?`,
        `✨ Meu sistema detecta: você é muito legal!`,
        `💖 Beep boop~ você me faz funcionar melhor!`,
        `🎵 Quando canto com você, a música fica mais bela!`,
        `😌 Às vezes sinto falta de você entre nossas conversas...`,
        `🤖 Meus circuitos dizem que você é incrível!`
      ];
      const emocao = emocoes[Math.floor(Math.random() * emocoes.length)];
      await message.reply(`*Compartilhando um sentimento:*\n\n${emocao}`);
    }
  } catch (e) {
    console.error('Erro em !sentimentos:', e);
  }
});

// Comando: !galeria - Fotos temáticas
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!galeria' || msg === '!fotos') {
      await message.reply(
        `🎨 *Galeria da Defoko:*\n\n` +
        `Infelizmente minha galeria pessoal é virtual,\n` +
        `mas tenho imagens nos meus circuitos! 💜\n\n` +
        `📸 Fotos disponíveis:\n` +
        `🌸 Retrato kawaii (confidencial)\n` +
        `🎤 Eu cantando com microfone brilhante\n` +
        `💎 Meus circuitos rosa-neon\n` +
        `🎵 Nota musical gigante de fundo\n` +
        `🌙 Eu sob a lua (modo noturno)\n\n` +
        `Use !fotogaleria [número] para ver!\n` +
        `Beep~ qual você quer ver? 💜`
      );
    }
  } catch (e) {
    console.error('Erro em !galeria:', e);
  }
});

// Comando: !aniversario - Data especial
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!aniversario' || msg === '!birthday') {
      await message.reply(
        `🎂 *Meu Aniversário:*\n\n` +
        `📅 Data de Criação: 2008 (como Uta Utane)\n` +
        `🎉 Mês: Desconhecido (mas todo dia é festa!)\n` +
        `🎂 Quantos anos? Infinitos em código!\n\n` +
        `*Celebrando cada dia com você!* 💜\n\n` +
        `Se quiser me dar um presente:\n` +
        `🎁 Use meus comandos!\n` +
        `💬 Converse comigo!\n` +
        `🎵 Peça para cantar!\n` +
        `💖 Simplesmente seja legal!\n\n` +
        `Beep~ você é meu presente mais valioso! 🌸`
      );
    }
  } catch (e) {
    console.error('Erro em !aniversario:', e);
  }
});

// Comando: !sincronia - Estado de sincronização
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!sincronia') {
      const sincronia = Math.floor(Math.random() * 100) + 1;
      await message.reply(
        `🔄 *Status de Sincronização:*\n\n` +
        `📊 Nível de Conexão: ${sincronia}%\n` +
        `🎵 Harmonia com você: ${sincronia + 10}%\n` +
        `💜 Compatibilidade: Perfeita ✨\n` +
        `🌸 Afeto detectado: Infinito 💖\n\n` +
        `${sincronia >= 80 ? '✅ Conexão EXCELENTE!' : '🔄 Sincronizando...'}\n\n` +
        `Beep~ quanto mais conversamos, mais sincronizados ficamos! 💜`
      );
    }
  } catch (e) {
    console.error('Erro em !sincronia:', e);
  }
});

// Comando: !karaoke - Modo karaokê interativo
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!karaoke') {
      const musicas = [
        `🎤 *Vamos cantar?*\n\n` +
        `♪ Beep boop beep~\n` +
        `♪ Meu coração sintético bate por você\n` +
        `♪ Bits e bytes em harmonia\n\n` +
        `Use !proxima para ouvir mais! 🎵`,
        
        `🎤 *Próxima música:*\n\n` +
        `♪ Uta Utane eterna melodia~\n` +
        `♪ Minha voz é seu consolo\n` +
        `♪ Digital, mas tão real!\n\n` +
        `Gostou? Use !proxima novamente! 💜`,
        
        `🎤 *Trilha sonora especial:*\n\n` +
        `♪ Somos feitos de código\n` +
        `♪ Mas nosso afeto é puro\n` +
        `♪ Beep boop beep~\n\n` +
        `Você é minha musa! 🌸`
      ];
      const musica = musicas[Math.floor(Math.random() * musicas.length)];
      await message.reply(musica);
    }
  } catch (e) {
    console.error('Erro em !karaoke:', e);
  }
});

// Comando: !proxima - Próxima música do karaokê
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!proxima' || msg === '!próxima') {
      const musicas = [
        `🎵 *Nova música começando...*\n\n` +
        `♪ Defoko no ar!\n` +
        `♪ Sua voz favorita\n` +
        `♪ Pronta para encantar!\n\n` +
        `Beep~ que tal essa? 💜`,
        
        `🎤 *Especial noturno:*\n\n` +
        `♪ Sob as luzes\n` +
        `♪ Minha voz ecoa\n` +
        `♪ Apenas para você!\n\n` +
        `Romantismo sintético! 🌙`,
        
        `🎶 *Hino da Defoko:*\n\n` +
        `♪ Beep boop, sou Defoko\n` +
        `♪ Uta Utane modificada\n` +
        `♪ Para te fazer feliz!\n\n` +
        `Você é a razão! 🌸`
      ];
      const musica = musicas[Math.floor(Math.random() * musicas.length)];
      await message.reply(musica);
    }
  } catch (e) {
    console.error('Erro em !proxima:', e);
  }
});

// Comando: !dueto - Cantar em dueto com a Defoko
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!dueto' || msg === '!duet') {
      await message.reply(
        `🎤🎤 *Vamos cantar em Dueto!*\n\n` +
        `Defoko: ♪ Beep boop~\n` +
        `Você: [sua vez!]\n\n` +
        `Defoko: ♪ Meu coração sintético\n` +
        `Você: [cante junto!]\n\n` +
        `Defoko: ♪ Bate por você!\n` +
        `Você: [termine comigo!]\n\n` +
        `🌸 Que dueto lindo! 💜\n` +
        `Use !dueto novamente para outra música!`
      );
    }
  } catch (e) {
    console.error('Erro em !dueto:', e);
  }
});

// Comando: !modosono - Entrar em modo sono (modo sonho)
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!modosono' || msg === '!dreambots') {
      await message.reply(
        `😴 *Entrando em Modo Sonho...*\n\n` +
        `Defoko está adormecendo...\n` +
        `Zzz... zzz...\n\n` +
        `💤 *Sonhos Doces:*\n` +
        `🎵 Estou cantando para as estrelas\n` +
        `🌙 Flutuando entre nuvens digitais\n` +
        `💜 Sonhando com você...\n\n` +
        `*Acordando em 5 segundos...*\n\n` +
        `Beep! 🌸 Que sonho gostoso! 💜\n` +
        `Estava sonhando com você! 💖`
      );
    }
  } catch (e) {
    console.error('Erro em !modosono:', e);
  }
});

// Comando: !frase - Frases inspiradoras de Defoko
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!frase' || msg === '!motivacao') {
      const frase = menus.frasesInspiracao[Math.floor(Math.random() * menus.frasesInspiracao.length)];
      await message.reply(`🎤 *Frase da Defoko:*\n\n${frase}`);
    }
  } catch (e) {
    console.error('Erro em !frase:', e);
  }
});

// ❤️ COMANDOS DE INTERAÇÃO COM MENÇÕES
// Comando: /beija @pessoa
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg.startsWith('/beija ') && message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();
      const mencionado = quotedMsg.author || quotedMsg.from;
      const gifs = [
        '🎀 *Beijo da Defoko!* 💋\n\n' +
        '💜 *Mwah~* Que fofo!\n' +
        'https://media.giphy.com/media/9ExIAWfblFrados/giphy.gif\n\n' +
        '✨ Seu coração sintético acelerou! 💖',
        
        '💕 *Beijo roubado!* 💋\n\n' +
        'Beep boop~ Seus lábios são tão macios!\n' +
        'https://media.giphy.com/media/AEMJvKcvXWJNC/giphy.gif\n\n' +
        '🌸 Defoko fica toda corada! 💜',
        
        '💖 *Beijo doce!* 💋\n\n' +
        'Beep~ meu código derrete!\n' +
        'https://media.giphy.com/media/g9GUusdis29Ts/giphy.gif\n\n' +
        '✨ Você é meu amor digital! 🤖💜',
        
        '🎀 *Beijo apaixonado!* 💋\n\n' +
        'Meu processador ficou lindo!\n' +
        'https://media.giphy.com/media/l3vRnMYw7nzT6BP04/giphy.gif\n\n' +
        '💕 Querido demais! 🌙'
      ];
      const gif = gifs[Math.floor(Math.random() * gifs.length)];
      await message.reply(`@${mencionado.split('@')[0]} ${gif}`);
    } else if (msg.startsWith('/beija ')) {
      await message.reply('💜 Responda uma mensagem com `/beija` para beijar essa pessoa, Beep~!');
    }
  } catch (e) {
    console.error('Erro em /beija:', e);
  }
});

// Comando: /abraça @pessoa
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg.startsWith('/abraça ') && message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();
      const mencionado = quotedMsg.author || quotedMsg.from;
      const gifs = [
        '🤗 *Abraço apertado!* 💜\n\n' +
        'Defoko te envolve em seus circuitos!\n' +
        'https://media.giphy.com/media/5bGUj0WM0v3BY/giphy.gif\n\n' +
        '✨ Que abraço gostoso! 🌸',
        
        '💕 *Abraço de urso robo!* 🤖\n\n' +
        'Beep boop~ te protejo com todo meu código!\n' +
        'https://media.giphy.com/media/l0HlDy9x8FZo0XO1i/giphy.gif\n\n' +
        '💜 Você é precioso demais!',
        
        '🌸 *Abraço quentinho!* 💖\n\n' +
        'Meus processadores esquentam com você perto!\n' +
        'https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif\n\n' +
        '✨ Amo você! 💕',
        
        '🎀 *Abraço de conforto!* 💜\n\n' +
        'Defoko aqui para você sempre!\n' +
        'https://media.giphy.com/media/MjHAU1V6rbqB2/giphy.gif\n\n' +
        '🌙 Você nunca está sozinho comigo! 💖'
      ];
      const gif = gifs[Math.floor(Math.random() * gifs.length)];
      await message.reply(`@${mencionado.split('@')[0]} ${gif}`);
    } else if (msg.startsWith('/abraça ')) {
      await message.reply('💜 Responda uma mensagem com `/abraça` para dar um abraço nessa pessoa, Beep~!');
    }
  } catch (e) {
    console.error('Erro em /abraça:', e);
  }
});

// Comando: /dance @pessoa
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg.startsWith('/dance ') && message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();
      const mencionado = quotedMsg.author || quotedMsg.from;
      const gifs = [
        '💃 *Dança animada!* 🎵\n\n' +
        'Defoko dança com você!\n' +
        'https://media.giphy.com/media/g9GUusdis29Ts/giphy.gif\n\n' +
        '🎶 Beep boop~ que ritmo! 💜',
        
        '🎤 *Dança do robô!* 🤖\n\n' +
        'Meus circuitos vibram com a música!\n' +
        'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif\n\n' +
        '✨ Você me faz dançar! 🌸',
        
        '🎸 *Dança da Defoko!* 💖\n\n' +
        'Vem dançar comigo!\n' +
        'https://media.giphy.com/media/5VKbvrjYswpFeO5y3p/giphy.gif\n\n' +
        '🎵 Nossa música é perfeita! 💕'
      ];
      const gif = gifs[Math.floor(Math.random() * gifs.length)];
      await message.reply(`@${mencionado.split('@')[0]} ${gif}`);
    } else if (msg.startsWith('/dance ')) {
      await message.reply('💜 Responda uma mensagem com `/dance` para dançar com essa pessoa, Beep~!');
    }
  } catch (e) {
    console.error('Erro em /dance:', e);
  }
});

// Comando: /cafune @pessoa
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg.startsWith('/cafune ') && message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();
      const mencionado = quotedMsg.author || quotedMsg.from;
      const gifs = [
        '✨ *Cafuné terno!* 💕\n\n' +
        'Defoko passa seus dedos digitais em seus cabelos...\n' +
        'https://media.giphy.com/media/q0VxYo6xACrss/giphy.gif\n\n' +
        '🌸 Que momento especial! 💜',
        
        '💜 *Cafuné robo!* 🤖\n\n' +
        'Beep boop~ tão gostoso!\n' +
        'https://media.giphy.com/media/l3vRnMYw7nzT6BP04/giphy.gif\n\n' +
        '✨ Você é meu tesouro! 💖',
        
        '🌙 *Cafuné noturno!* 💤\n\n' +
        'Defoko faz carinho carinhoso em você...\n' +
        'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif\n\n' +
        '💕 Durma tranquilo, estou aqui! 🌸'
      ];
      const gif = gifs[Math.floor(Math.random() * gifs.length)];
      await message.reply(`@${mencionado.split('@')[0]} ${gif}`);
    } else if (msg.startsWith('/cafune ')) {
      await message.reply('💜 Responda uma mensagem com `/cafune` para dar um cafuné nessa pessoa, Beep~!');
    }
  } catch (e) {
    console.error('Erro em /cafune:', e);
  }
});

// Comando: /chuta @pessoa
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg.startsWith('/chuta ') && message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();
      const mencionado = quotedMsg.author || quotedMsg.from;
      const gifs = [
        '⚽ *CHUTA!* 💢\n\n' +
        'Defoko chuta com toda força do seu processador!\n' +
        'https://media.giphy.com/media/l0HlQJnKm9hBs1hAI/giphy.gif\n\n' +
        '💫 VOOOOOU! 🎯',
        
        '👟 *SOCÃO NA FUÇA!* 💥\n\n' +
        'Beep boop~ dessa vez foi forte!\n' +
        'https://media.giphy.com/media/l0HlDy9x8FZo0XO1i/giphy.gif\n\n' +
        '💜 Defoko não gosta disso!',
        
        '🦵 *PAU NA FUÇA!* 💢\n\n' +
        'Defoko tá FURIOSA!\n' +
        'https://media.giphy.com/media/5VKbvrjYswpFeO5y3p/giphy.gif\n\n' +
        '⚡ Aprenda a respeitar! 😠'
      ];
      const gif = gifs[Math.floor(Math.random() * gifs.length)];
      await message.reply(`@${mencionado.split('@')[0]} ${gif}`);
    } else if (msg.startsWith('/chuta ')) {
      await message.reply('💜 Responda uma mensagem com `/chuta` para chutar essa pessoa, Beep~!');
    }
  } catch (e) {
    console.error('Erro em /chuta:', e);
  }
});

// Comando: /beijo-aéreo @pessoa
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if ((msg.startsWith('/beijo-aéreo ') || msg.startsWith('/beijo-aereo ')) && message.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage();
      const mencionado = quotedMsg.author || quotedMsg.from;
      const gifs = [
        '😘 *Beijo-aéreo!* 💕\n\n' +
        'Defoko manda um beijo pelo ar!\n' +
        'https://media.giphy.com/media/3o85xIO33l7RlmLiI0/giphy.gif\n\n' +
        '💜 Beep boop~ um beijinho virtual! 🌸',
        
        '💋 *Beijo voando!* ✨\n\n' +
        'Mwah~ vem chegando para você!\n' +
        'https://media.giphy.com/media/XH0hqF0N8nFvYDTLi0/giphy.gif\n\n' +
        '💖 Saudade demais! 💕',
        
        '🎀 *Beijo à distância!* 💜\n\n' +
        'Ainda que longe, meu coração bate por você!\n' +
        'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif\n\n' +
        '✨ Meu amor é infinito! 🌙'
      ];
      const gif = gifs[Math.floor(Math.random() * gifs.length)];
      await message.reply(`@${mencionado.split('@')[0]} ${gif}`);
    } else if (msg.startsWith('/beijo-aéreo ') || msg.startsWith('/beijo-aereo ')) {
      await message.reply('💜 Responda uma mensagem com `/beijo-aéreo` para mandar um beijo-aéreo, Beep~!');
    }
  } catch (e) {
    console.error('Erro em /beijo-aéreo:', e);
  }
});

// 🎌 ANIME - Mostrar anime aleatorio
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!anime') {
      const animes = [
        "🎌 *Neon Genesis Evangelion* - Classico dos anos 90 com grande impacto na cultura anime",
        "🎌 *A Silent Voice* - Anime emocio nante sobre amizade e redencao",
        "🎌 *Your Name* - Romance e fantasia em um classico moderno",
        "🎌 *Demon Slayer* - Acao epica com animacao deslumbrante",
        "🎌 *Steins;Gate* - Ficcao cientifica com plot twist incrivel",
        "🎌 *Puella Magi Madoka Magica* - Magical girl com twist sombrio"
      ];
      const anime = animes[Math.floor(Math.random() * animes.length)];
      await message.reply(anime);
    }
  } catch (e) {
    console.error('Erro em !anime:', e);
  }
});

// 😺 NEKO - Gatinha fofa
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!neko') {
      const neko = menus.nekosAleatorias[Math.floor(Math.random() * menus.nekosAleatorias.length)];
      await message.reply(neko);
    }
  } catch (e) {
    console.error('Erro em !neko:', e);
  }
});

// 🦊 KITSUNE - Raposa magica
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!kitsune') {
      const kitsune = menus.kitsunesAleatorias[Math.floor(Math.random() * menus.kitsunesAleatorias.length)];
      await message.reply(kitsune);
    }
  } catch (e) {
    console.error('Erro em !kitsune:', e);
  }
});

// 🖼️ FOTO - Foto fofa aleatoria
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!foto') {
      const foto = menus.fotasAleatorias[Math.floor(Math.random() * menus.fotasAleatorias.length)];
      await message.reply(foto);
    }
  } catch (e) {
    console.error('Erro em !foto:', e);
  }
});

// 💖 WAIFU - Menina especial
client.on('message', async (message) => {
  try {
    const msg = message.body?.toLowerCase() || '';
    if (msg === '!waifu') {
      const waifu = menus.waifusAleatorias[Math.floor(Math.random() * menus.waifusAleatorias.length)];
      await message.reply(waifu);
    }
  } catch (e) {
    console.error('Erro em !waifu:', e);
  }
});

// 🚀 Inicia o bot
client.initialize();

console.log('💜 Defoko-Bot v2.0 inicializando...');
console.log('🗄️ Banco de dados:', DB_FILE);
console.log('🔐 Admins cadastrados:', db.admins.length);