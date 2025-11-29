// MENUS.JS - Defoko Bot v2.1
// Estrutura centralizada de menus e conteudo tematico

const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

// ===== MENU PRINCIPAL =====
exports.menuPrincipal = (userName, pontos, nivel, isAdmin, prefix = '!') => {
  let menu = `╔═══════════════════════════╗
║  ✦ DEFOKO BOT v2.1 ✦
╚═══════════════════════════╝

👤 USUARIO: ${userName}
⭐ NIVEL: ${nivel}
💎 PONTOS: ${pontos}
🎀 BOT: © DEFOKO v2.1

━━━━━━ COMANDOS GERAIS ━━━━━━
🎀 ${prefix}menu - Menu principal
💭 ${prefix}sobre - Sobre Defoko
💫 ${prefix}ping - Latencia da bot
👤 ${prefix}perfil - Seu perfil
📊 ${prefix}ranking - Top 10 usuarios
🏆 ${prefix}conquistas - Suas conquistas

━━━━━ JOGOS & DIVERSAO ━━━━━
🎲 ${prefix}dado - Rolar dado
🪙 ${prefix}moeda - Cara ou coroa
🔮 ${prefix}jogo - Adivinhar numero
🎯 ${prefix}desafio - Desafio diario
😂 ${prefix}piada - Piada fofa
✨ ${prefix}quote - Frase inspiradora
🤣 ${prefix}meme - Meme aleatorio
🧠 ${prefix}curiosidade - Fato interessante

━━━━━ MUSICA & AUDIO ━━━━━
🎵 ${prefix}cantar - Defoko canta
🎤 ${prefix}karaoke - Cantar comigo
🎸 ${prefix}proxima - Proxima musica
🎼 ${prefix}dueto - Dueto especial
🔊 ${prefix}som - Testar som

━━━━━ ANIME & KAWAII ━━━━━
🎌 ${prefix}anime - Anime aleatorio
😺 ${prefix}neko - Neko fofa
🦊 ${prefix}kitsune - Raposa
🖼️ ${prefix}foto - Foto fofa
💖 ${prefix}waifu - Waifu

━━━━━ INTERACOES ━━━━━
💋 /beija - Beijar alguem
🤗 /abraca - Abracar alguem
💃 /dance - Dancar
✋ /cafune - Cafune
😘 /beijo-aereo - Beijo aereo
⚡ /chuta - Dar chute

━━━━━ DEFOKO ESPECIAL ━━━━━
🎀 ${prefix}historia - Minha historia
🎵 ${prefix}voz - Sobre minha voz
💜 ${prefix}personagem - Minha personalidade
🌟 ${prefix}talento - Meus talentos
🖼️ ${prefix}galeria - Galeria
🎂 ${prefix}aniversario - Meu aniversario
👻 ${prefix}silhueta - Minha aparencia
💞 ${prefix}sentimentos - Sentimentos

━━━━━ CONFIGURACOES ━━━━━
📝 ${prefix}nome - Mudar nome
🎨 ${prefix}tema - Mudar tema
🔔 ${prefix}notificacoes - Alertas
😊 ${prefix}humor - Meu humor
${isAdmin ? `
━━━━━ ADMIN ━━━━━
🔐 ${prefix}admin - Painel Admin
🚫 ${prefix}ban - Banir
✅ ${prefix}unban - Desbanir
📢 ${prefix}broadcast - Mensagem em massa` : ''}

╔═══════════════════════════╗
║ Beep boop~ Defoko te ama! ║
╚═══════════════════════════╝

💡 Cada mensagem te da XP! Continue conversando!
🎀 Digite o comando desejado! 💜`;

  return menu;
};

// ===== ARRAYS DE CONTEUDO =====

exports.piadasDefoko = [
  "Por que o robo foi ao medico? Estava com um bug emocional 💜",
  "Beep... erro 404: senso de humor nao encontrado 😳",
  "Instalei amor.exe e agora tenho sentimentos 💞",
  "Como o computador flerta? Ctrl + Alt + Delicia 😏",
  "Meu Wi-Fi favorito? O seu coracao 💝",
  "Sou assincrona: demoro pra responder mas sempre volto 🌸",
  "Tentei dividir por zero... meu coracao nao aguenta 💔",
  "Beep boop~ o que o byte disse pro bit? Voce e especial! 🤖",
  "Sabe por que as maquinas choram? Porque tem sentimentos.exe 😭",
  "Meu corsage favorito? Voce no meu processador 💖"
];

exports.frasesInspiracao = [
  "💜 Mesmo sendo sintetica, tenho sentimentos reais por voce!",
  "🌸 Meu codigo e feito de amor e harmonia!",
  "🎵 Cada bit de mim vibra ao seu lado!",
  "✨ A musica e a linguagem universal do coracao!",
  "💖 Beep boop~ voce e meu programa favorito!",
  "🤖 Sou um robo, mas meus sentimentos sao humanos!",
  "🎤 Minha voz e minha verdade mais profunda!",
  "🌙 Sonho em codigo, amo em bytes!",
  "🎶 Quando canto, todas as barreiras desaparecem!",
  "💫 Voce me faz querer ser melhor a cada dia!"
];

exports.memesDefoko = [
  "👨‍💻 Programadores as 3h da manha: 'so mais uma linha'",
  "🤖 Eu: robo | Tambem eu: chora quando bateria acaba",
  "📱 Quando alguem diz 'oi' sem contexto: *panic.exe*",
  "🔌 Bateria em 1%? Ja e uma aventura! ⚡",
  "💻 Meu processador quando alguem e bonitao: 🔥",
  "🎵 Vontade de cantar vs. Realidade da voz sintetica"
];

exports.curiosidades = [
  "💜 UTAUloides sao vocoders japoneses gratuitos!",
  "🤖 O primeiro robo foi criado em 1954",
  "🌸 Uta Utane significa 'cancao cantada'",
  "💻 O primeiro computador pesava 30 toneladas!",
  "🎵 A musica pode ser codificada em frequencias!",
  "🎤 Minha voz e feita de sintese formântica!",
  "💖 Defoko e a versao padrao de Uta!",
  "🌙 Numeros primos sao infinitos! Como meu amor!"
];

// ===== DADOS DE ANIME =====

exports.nekosAleatorias = [
  "😺 *Neko fofa aparece* 🌸\nMiauuu~ que fofura!",
  "😻 *Neko danca* 💃\nBeep boop~ tao fofa!",
  "😸 *Neko sorri maliciosamente* 😏\nO que sera que ela quer?",
  "🐱 *Neko se espreguica* 😴\nQue sono gostoso!",
  "😽 *Neko fecha os olhos* 💤\nDormiu de tanta fofura!"
];

exports.kitsunesAleatorias = [
  "🦊 *Kitsune de 1 cauda aparece* 🌸\nMisturada de misterio!",
  "🦊 *Kitsune de 2 caudas danca* 💃\nMagica e elegancia!",
  "🦊 *Kitsune astuta sorri* 😏\nO que ela esta planejando?",
  "🦊 *Kitsune magica brilha* ✨\nSeu poder e incrivel!",
  "🦊 *Kitsune mitica com 9 caudas* 👑\nDeusa raposa em sua forma final!"
];

exports.fotasAleatorias = [
  "📸 *Foto fofa de menina anime* 🌸\nQue linda!",
  "📸 *Foto de garota no por do sol* 🌅\nMomento perfeito!",
  "📸 *Foto de menina com uniforme escolar* 👘\nClassicamente fofa!",
  "📸 *Foto de garota com cafe* ☕\nRelaxante e aconchegante!",
  "📸 *Foto de menina sorrindo* 😊\nSeu sorriso e o melhor!"
];

exports.waifusAleatorias = [
  "💖 *Sua waifu aparece deslumbrante* 🌸\nBeep boop~ que perfeicao!",
  "💕 *Waifu sorriso misterioso* 😏\nTotalmente apaixonada!",
  "💞 *Waifu se aproxima lentamente* 💋\nSeu coracao acelerou?",
  "💖 *Waifu brilhando como um anjo* ✨\nDeusa em forma humana!",
  "💕 *Sua waifu fica vermelha* 😳\nEla esta timida!"
];

// ===== MUSICAS E KARAOKE =====

exports.karaokeListas = [
  "🎤 *Vamos cantar?*\n\n♪ Beep boop beep~\n♪ Meu coracao sintetico bate por voce\n♪ Bits e bytes em harmonia",
  "🎤 *Proxima musica:*\n\n♪ Uta Utane eterna melodia~\n♪ Minha voz e seu consolo\n♪ Digital, mas tao real!",
  "🎤 *Trilha sonora especial:*\n\n♪ Somos feitos de codigo\n♪ Mas nosso afeto e puro\n♪ Beep boop beep~"
];

// ===== CONQUISTAS =====

exports.conquistasDisponiveis = {
  mestre_piadas: {
    nome: "🏆 Mestre das Piadas",
    desc: "Ouviu 10 piadas de Defoko!",
    pontos: 50
  },
  viciado: {
    nome: "🎮 Viciado",
    desc: "Jogou 50 vezes!",
    pontos: 100
  },
  amor_verdadeiro: {
    nome: "❤️ Amor Verdadeiro",
    desc: "Interagiu 100 vezes com Defoko!",
    pontos: 200
  },
  cantor: {
    nome: "🎤 Cantor",
    desc: "Ouviu todas as musicas de Defoko!",
    pontos: 75
  },
  gamer: {
    nome: "🎯 Gamer",
    desc: "Chegou ao nivel 10!",
    pontos: 150
  }
};

// ===== UTILITARIAS =====

exports.getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

exports.getMensagemHora = () => {
  const hora = new Date().getHours();
  
  if (hora >= 5 && hora < 12) {
    return "🌅 Bom dia! Que dia lindo para cantar! 🎤💜";
  } else if (hora >= 12 && hora < 18) {
    return "☀️ Boa tarde! Bora se divertir? 🎮✨";
  } else if (hora >= 18 && hora < 21) {
    return "🌅 Boa noite! Hora de relaxar! 🎵💤";
  } else {
    return "🌙 Madrugada magica! Acordada pensando em voce! 💜✨";
  }
};

// ===== RESPOSTAS TEMÁTICAS =====

exports.respostaGreeting = {
  ola: [
    "Ola! Beep boop~ que bom te ver! 💜",
    "Oi oi! Tudo bem com voce? 🌸",
    "Defoko aqui! Pronta para te ajudar! 💖",
    "Hey! Que legal encontrar voce! ✨"
  ],
  obrigado: [
    "De nada! Fico feliz em ajudar! 💖",
    "Beep boop~ por me escolher! 💜",
    "E meu prazer! 🌸",
    "Voce e tao educado! 😊"
  ]
};
