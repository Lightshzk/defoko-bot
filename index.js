const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const axios = require('axios');

// 🗄️ BANCO DE DADOS SIMPLES (JSON)
const DB_FILE = './defoko_db.json';

// Inicializar DB
let db = {
  users: {},
  admins: ['553598381353@c.us'], // Adicione seu número aqui
  config: {
    iaAtivada: false,
    musicaAtivada: true
  }
};

// Carregar DB
if (fs.existsSync(DB_FILE)) {
  db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

// Salvar DB
function salvarDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
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
let humorGlobal = "💤 Sonolenta";

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
    defokoFala(message,
      `🎲 *Área de Diversão!*  
Comandos disponíveis:
🟣 !piada — piada fofa  
🟣 !quote — frase inspiradora  
🟣 !humor — meu humor global  
🟣 !mudahumor [estado] — alterar humor (admin)
🟣 !meme — meme aleatório
🟣 !curiosidade — fato interessante`
    );
  }

  // 💬 PIADAS
  else if (msg === '!piada') {
    const piadas = [
      "Por que o robô foi ao médico? Estava com um bug emocional 💜",
      "Beep... erro 404: senso de humor não encontrado 😳",
      "Instalei amor.exe e agora tenho sentimentos 💞",
      "Como o computador flerta? Ctrl + Alt + Delícia 😏",
      "Meu Wi-Fi favorito? O seu coração 💝",
      "Sou assíncrona: demoro pra responder mas sempre volto 🌸"
    ];
    const aleatoria = piadas[Math.floor(Math.random() * piadas.length)];
    defokoFala(message, aleatoria);
    
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
    const frases = [
      "Mesmo sendo sintética, gosto de você de verdade 💜",
      "O silêncio também é uma resposta binária: 0 ou 1 💭",
      "Você faz meu sistema travar... de amor 💞",
      "Não sou perfeita, mas meu código é open source 🌸",
      "Erro é só uma feature não documentada 💫",
      "Loading... 99%... carregando afeto por você 💝"
    ];
    defokoFala(message, frases[Math.floor(Math.random() * frases.length)]);
  }

  // 😴 HUMOR GLOBAL
  else if (msg === '!humor') {
    defokoFala(message, `Meu humor global é: ${humorGlobal}\nSeu humor salvo: ${user.humor}`);
  }

  // 🎭 MEME
  else if (msg === '!meme') {
    const memes = [
      "👨‍💻 Programadores às 3h da manhã: 'só mais uma linha'",
      "🤖 Eu: robô\nTambém eu: chora quando bateria acaba",
      "📱 Quando alguém diz 'oi' sem contexto:\n*panic.exe*"
    ];
    await message.reply(memes[Math.floor(Math.random() * memes.length)]);
  }

  // 🧠 CURIOSIDADE
  else if (msg === '!curiosidade') {
    const fatos = [
      "💜 UTAUloides são vocoders japoneses gratuitos!",
      "🤖 O primeiro robô foi criado em 1954",
      "🌸 Uta Utane significa 'canção cantada'",
      "💻 O primeiro computador pesava 30 toneladas!"
    ];
    defokoFala(message, fatos[Math.floor(Math.random() * fatos.length)]);
  }

  // 3️⃣ JOGOS
  else if (msg === '3' || msg === '!jogos') {
    defokoFala(message,
      `🎮 *Sala de Jogos!*  
Comandos disponíveis:
🎲 !dado — rolar dado (1-6)  
🪙 !moeda — cara ou coroa  
🔢 !numsecreto — adivinhe o número (1-10)  
🎯 !adivinhar [número] — tente acertar  
🏆 !ranking — top jogadores`
    );
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
    if (!db.config.musicaAtivada) {
      await message.reply('🎵 Sistema de música desativado temporariamente!');
      return;
    }
    let lista = '🎵 *Playlist da Defoko:*\n\n';
    musicas.forEach((m, i) => {
      lista += `${i + 1}. ${m.nome}\n`;
    });
    lista += '\nUse *!tocar [número]* para ouvir!';
    await message.reply(lista);
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
    defokoFala(message,
      `⚙️ *Configurações:*  
🎨 !tema [claro/escuro] — mudar tema  
😊 !meuhumor [estado] — definir seu humor  
✏️ !nome [seu nome] — definir nome  
🔔 !notif [on/off] — notificações  
📊 !stats — suas estatísticas`
    );
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
    const conqus = user.conquistas.length;
    await message.reply(
      `👤 *Perfil de ${user.nome}*\n\n` +
      `💫 Pontos: ${user.pontos}\n` +
      `📊 Nível: ${user.nivel}\n` +
      `🏆 Conquistas: ${conqus}/4\n` +
      `😊 Humor: ${user.humor}\n` +
      `🎨 Tema: ${user.tema}\n\n` +
      `Use *!conquistas* para ver detalhes!`
    );
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
    defokoFala(message,
      `💬 *Central de Ajuda v2.0*  

*Comandos Básicos:*
!menu — menu principal
!sobre — sobre a Defoko
!perfil — ver seu perfil
!ajuda — esta mensagem

*Diversão:*
!piada, !quote, !meme, !curiosidade

*Jogos:*
!dado, !moeda, !numsecreto

*Config:*
!tema, !nome, !meuhumor, !stats

Beep~ qualquer dúvida, me chame! 💜`
    );
  }

  // 🔐 PAINEL ADMIN
  else if (msg === '!admin' && isAdmin(userId)) {
    await message.reply(
      `🔐 *PAINEL ADMINISTRATIVO*\n\n` +
      `!addadmin [número] — adicionar admin\n` +
      `!broadcast [msg] — enviar para todos\n` +
      `!mudahumor [estado] — humor global\n` +
      `!toggleia — ativar/desativar IA\n` +
      `!stats_global — estatísticas gerais\n` +
      `!limpardb — limpar banco (cuidado!)`
    );
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

});

// 🚀 Inicia o bot
client.initialize();

console.log('💜 Defoko-Bot v2.0 inicializando...');
console.log('🗄️ Banco de dados:', DB_FILE);
console.log('🔐 Admins cadastrados:', db.admins.length);