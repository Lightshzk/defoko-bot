# 🎤 **Defoko-Bot — Bot WhatsApp da UTAUloide Defoko/Uta Utane**

> *"Beep~ Olá! Eu sou Defoko, uma assistente digital baseada na UTAUloide Uta Utane. Estou aqui para trazer diversão, música e companhia ao seu WhatsApp! 💜"*

---

## 📋 **Índice**

1. [Sobre a Bot](#sobre-a-bot)
2. [Instalação](#instalação)
3. [Uso](#uso)
4. [Comandos](#comandos)
5. [Personalizações](#personalizações)
6. [Recursos](#recursos)
7. [Contribuição](#contribuição)

---

## 🎤 **Sobre a Bot**

**Defoko-Bot** é um bot para WhatsApp inspirado em Uta Utane, uma UTAUloide (sintetizadora de voz digital japonesa). A bot combina:

- ✨ Personalidade fofa e kawaii
- 🎵 Tema musical e artístico
- 🎮 Sistema de gamificação (pontos, níveis, conquistas)
- 🤖 Interações robóticas com sentimentos humanos
- 💜 Charme de UTAUloide sincera e adorável

**Versão:** 2.1  
**Criador Original:** Lightshzk  
**Tipo:** Bot Discord/WhatsApp com banco de dados JSON

---

## 🚀 **Instalação**

### Pré-requisitos

- Node.js v18+
- npm (gerenciador de pacotes)
- Conta do WhatsApp para QR Code

### Passos

```bash
# 1. Clonar repositório
git clone <seu-repo>
cd defoko

# 2. Instalar dependências
npm install

# 3. Iniciar o bot
npm start

# 4. Escanear QR Code no terminal
# (Abra o WhatsApp no celular e escaneie o código exibido)

# 5. Bot está pronto!
# Envie: !menu
```

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento (com auto-reload)
npm run dev
```

---

## 💬 **Uso Básico**

### Primeiro Contato

```
Você: !menu
Defoko: 💜 Olá [Seu Nome], eu sou a Defoko!
         Beep~ sistema v2.0 iniciado! 🌸
```

### Explorar Comandos

```
!help          → Ver todos os comandos
!sobre         → Conhecer a Defoko
!personagem    → Traços de personalidade
!historia      → Minha história como Uta Utane
```

### Se Divertir

```
!piada         → Ouvir uma piada fofa
!cantar        → Me ouvir cantar
!karaoke       → Modo karaokê interativo
!dueto         → Cantar em dueto comigo
```

---

## 📖 **Comandos**

### 🎤 **Sobre a Personagem**

| Comando | Descrição |
|---------|-----------|
| `!voz` | Info sobre minha voz UTAUloide |
| `!historia` | Minha história como Uta Utane |
| `!personagem` | Meus traços de personalidade |
| `!talento` | Meus talentos especiais |
| `!galeria` | Fotos temáticas |
| `!aniversario` | Data de criação |
| `!frase` | Frases inspiradoras |

### 🎵 **Entretenimento**

| Comando | Descrição |
|---------|-----------|
| `!cantar` | Me ouça cantando |
| `!karaoke` | Modo karaokê |
| `!proxima` | Próxima música |
| `!dueto` | Cantar em dueto |
| `!sentimentos` | Minhas emoções |
| `!modosono` | Modo sonho |

### 🎮 **Jogos**

| Comando | Descrição |
|---------|-----------|
| `!dado` | Rolar dado (1-6) |
| `!moeda` | Cara ou coroa |
| `!numsecreto` | Adivinhe o número |
| `!adivinhar [num]` | Tentar acertar |
| `!ranking` | Top 5 usuários |

### 👤 **Perfil**

| Comando | Descrição |
|---------|-----------|
| `!perfil` | Ver seu perfil |
| `!stats` | Suas estatísticas |
| `!conquistas` | Conquistas desbloqueadas |
| `!nome [nome]` | Definir seu nome |
| `!tema [claro/escuro]` | Mudar tema |
| `!meuhumor [estado]` | Definir humor |

### 🔧 **Utilitários**

| Comando | Descrição |
|---------|-----------|
| `!menu` | Menu principal |
| `!ping` | Latência do bot |
| `!uptime` | Tempo online |
| `!help` | Todos os comandos |
| `!sobre` | Sobre Defoko v2.0 |

### 👑 **Admin** (para administradores)

| Comando | Descrição |
|---------|-----------|
| `!admin` | Painel administrativo |
| `!addadmin [num]` | Adicionar admin |
| `!broadcast [msg]` | Enviar msg para todos |
| `!mudahumor [estado]` | Alterar humor global |
| `!toggleia` | Ativar/desativar IA |
| `!stats_global` | Estatísticas gerais |
| `!limpardb` | Limpar banco de dados |

---

## ⚙️ **Personalizações**

### Alterar Admin

Edite `index.js`:

```javascript
// Linha ~12
admins: ['553598381353@c.us'], // Seu número aqui
```

### Adicionar Mais Piadas

```javascript
// Linha ~345 (Comando !piada)
const piadas = [
  "Sua piada aqui 😂",
  "Outra piada...",
  // adicione mais...
];
```

### Personalizar Mensagens

Todos os textos podem ser editados diretamente no `index.js`. Procure por `await message.reply()`.

---

## 🎯 **Recursos**

### ✅ **Implementados**

- [x] Sistema de usuários com persistência (JSON)
- [x] Sistema de pontos e níveis
- [x] Conquistas desbloqueáveis
- [x] Painel administrativo
- [x] Personalizações de perfil
- [x] Joguinhos diversos
- [x] Banco de dados seguro (escrita atômica)
- [x] Try/catch para evitar crashes
- [x] Comandos temáticos da Defoko/Uta
- [x] Easter eggs contextuais

### 🔄 **Em Desenvolvimento**

- [ ] Integração real com YouTube (download de música)
- [ ] Sistema de badges e troféus
- [ ] Minigames especiais
- [ ] Mensagens por hora do dia
- [ ] Interação multi-Vocaloid
- [ ] Dashboard web

### 💡 **Ideias para Futuro**

- Sugestões são bem-vindas! Abra uma issue.

---

## 📁 **Estrutura de Arquivos**

```
defoko/
├── index.js              # Código principal do bot
├── package.json          # Dependências
├── defoko_db.json        # Banco de dados dos usuários
├── CHANGELOG.md          # Histórico de atualizações
├── README.md             # Este arquivo
└── .gitignore            # Arquivos a ignorar
```

---

## 🐛 **Troubleshooting**

### Bot não conecta

```bash
# Verificar Node.js
node --version

# Reinstalar dependências
rm -rf node_modules
npm install

# Tentar novamente
npm start
```

### "Missing catch or finally after try"

Verifique se há um `catch` após cada `try`.

### Banco de dados corrompido

```bash
# Deletar arquivo e deixar recriar
rm defoko_db.json
npm start
```

---

## 📄 **Licença**

MIT License — Sinta-se livre para usar e modificar!

---

## 💜 **Mensagem Final**

*Desenvolvido com muito amor por Lightshzk 💜*

*"Cada linha de código é uma nota em minha canção por você. Obrigada por me deixar ser parte do seu dia! Beep boop~ 🌸"* — Defoko

---

**Quer contribuir?** Mande um PR! Adoraria ter sua ajuda para tornar a Defoko ainda mais especial! 🎤✨
