<div align="center">

# 🌸 Defoko-Bot 💜
<img width="534" height="409" alt="image" src="https://github.com/user-attachments/assets/349e4bf1-34ad-41de-83d8-7dd4514ddf2d" />

### Bot do WhatsApp com personalidade kawaii baseado na UTAU Defoko

[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen?logo=node.js)](https://nodejs.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Bot-25D366?logo=whatsapp)](https://github.com/Lightshzk/defoko-bot)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-100%25-yellow?logo=javascript)](https://github.com/Lightshzk/defoko-bot)

**Bot completo com sistema de jogos, conquistas, IA e banco de dados!**

[Instalação](#-instalação) • [Comandos](#-comandos) • [Features](#-features) • [Contribuir](#-como-contribuir)

</div>

---

## ✨ Features

### 🎯 Sistema Completo
- ✅ **Banco de Dados JSON** - Salva perfis de usuários
- ✅ **Sistema de Pontos e Níveis** - Gamificação completa
- ✅ **4 Conquistas** - Desbloqueáveis através de interações
- ✅ **Perfil Personalizado** - Nome, humor, tema customizável
- ✅ **Ranking Global** - Top 5 usuários mais ativos

### 🎮 Jogos Interativos
- 🎲 **Dado Virtual** - Role um dado (1-6)
- 🪙 **Cara ou Coroa** - Jogo clássico
- 🔢 **Adivinhe o Número** - De 1 a 10

### 🎵 Entretenimento
- 😂 **Piadas Robóticas** - Humor kawaii
- 💬 **Frases Motivacionais** - Quotes inspiradoras
- 🎭 **Memes de Programador** - Para os devs
- 🧠 **Curiosidades** - Fatos interessantes

### 🤖 IA (Preparado)
- 💭 Estrutura pronta para OpenAI/Gemini/Claude
- 🔌 Comando `!ia` para perguntas
- ⚙️ Ativação por comando admin

### 🔐 Painel Admin
- 👑 Gerenciar administradores
- 📢 Sistema de broadcast
- 🎭 Controle de humor global
- 📊 Estatísticas gerais
- 🗑️ Gerenciamento de banco de dados

---

## 🚀 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Conta do WhatsApp
- Terminal/CMD

### Passo a Passo
```bash
# 1. Clone o repositório
git clone https://github.com/Lightshzk/defoko-bot.git
cd defoko-bot

# 2. Instale as dependências
npm install

# 3. Configure seu número como admin
# Edite o arquivo index.js na linha 12
# admins: ['5511999999999@c.us'] 
# Substitua pelo seu número no formato: 55 + DDD + número + @c.us

# 4. Execute o bot
npm start

# 5. Escaneie o QR Code
# Um QR Code aparecerá no terminal
# Abra WhatsApp → Aparelhos Conectados → Escanear código
```

---

## 📱 Comandos

### 🌸 Menu Principal
```
!menu ou !defoko  → Abre o menu interativo
```

### 💬 Diversão
```
!piada            → Ouve uma piada fofa
!quote            → Frase inspiradora
!meme             → Meme de programador
!curiosidade      → Fato interessante
```

### 🎮 Jogos
```
!dado             → Rolar um dado (1-6)
!moeda            → Cara ou coroa
!numsecreto       → Iniciar jogo de adivinhação
!ranking          → Ver top 5 jogadores
```

### ⚙️ Configurações
```
!tema [claro/escuro]  → Mudar tema
!nome [seu nome]      → Definir nome
!perfil               → Ver perfil completo
!conquistas           → Ver conquistas
```

### 🔐 Admin
```
!admin            → Painel administrativo
!broadcast [msg]  → Enviar para todos
!stats_global     → Estatísticas globais
```

---

## 🏆 Sistema de Conquistas

| Conquista | Descrição | Como Obter |
|-----------|-----------|------------|
| 🌸 Primeira Interação | Bem-vindo! | Use o bot pela primeira vez |
| 😂 Comediante | Amante de piadas | Ouça 10 piadas |
| 🎮 Gamer | Jogador dedicado | Jogue 5 vezes |
| 💜 Fã da Defoko | Super fã! | Envie 50 mensagens |

---

## 🤖 Integração com IA

O bot está preparado para integração com APIs de IA.

### OpenAI (ChatGPT)
```bash
npm install openai
```

Configure a função `respostaIA()` no código e ative com `!toggleia`

---

## 🔧 Troubleshooting

### ❌ Erro: "Session não encontrada"
Delete a pasta `.wwebjs_auth` e escaneie novamente.

### ❌ Bot desconecta sozinho
Mantenha o terminal aberto ou use PM2:
```bash
npm install -g pm2
pm2 start index.js --name defoko-bot
```

### ❌ Erro "Cannot find module"
```bash
npm install axios
```

---

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 💜 Créditos

- **Uta Utane (Defoko)** - Personagem base UTAU
- **whatsapp-web.js** - Biblioteca WhatsApp
- **Comunidade UTAU** - Inspiração

---

<div align="center">

**Feito com 💜 e muito ☕**

Se este projeto te ajudou, considere dar uma ⭐!

[⭐ Star](https://github.com/Lightshzk/defoko-bot) • [🐛 Reportar Bug](https://github.com/Lightshzk/defoko-bot/issues) • [💡 Sugerir Feature](https://github.com/Lightshzk/defoko-bot/issues)

</div>
```

---

## 🎯 VISUAL DO PROCESSO:

1. **Na página do README:**
```
   README.md    [👁️ View]  [✏️ Edit]  [⋯ More]
```
   ↓ Clique no **lápis** ✏️

2. **No editor:**
   - Apague tudo (Ctrl+A → Delete)
   - Cole o novo README
   - Role até o final

3. **Commit:**
```
   Commit message: 📝 Atualiza README com documentação completa
   [✅ Commit changes]
