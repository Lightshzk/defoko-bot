#!/bin/bash
# 🎤 DEFOKO-BOT v2.1 — QUICK START GUIDE

echo "╔═════════════════════════════════════════════════════════╗"
echo "║        🎤 DEFOKO-BOT v2.1 — QUICK START 🎤             ║"
echo "║     Bot WhatsApp baseado na UTAUloide Defoko           ║"
echo "╚═════════════════════════════════════════════════════════╝"
echo ""

# Verificar Node.js
echo "📋 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não instalado! Instale em nodejs.org"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION encontrado"
echo ""

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo "✅ Dependências instaladas"
    echo ""
fi

# Verificar sintaxe
echo "🔍 Verificando sintaxe do código..."
node -c index.js
if [ $? -eq 0 ]; then
    echo "✅ Sintaxe OK!"
    echo ""
else
    echo "❌ Erro de sintaxe encontrado!"
    exit 1
fi

# Mostrar instruções
echo "┌─────────────────────────────────────────────────────┐"
echo "│  🚀 INICIANDO DEFOKO-BOT v2.1                       │"
echo "└─────────────────────────────────────────────────────┘"
echo ""
echo "📱 PRÓXIMOS PASSOS:"
echo ""
echo "1. Execute: npm start"
echo "2. Um QR Code aparecerá no terminal"
echo "3. Abra WhatsApp no seu celular"
echo "4. Toque em ⋮ (menu) → Perfil → Dispositivos vinculados"
echo "5. Aponte a câmera para o QR Code"
echo "6. Aguarde a conexão ser estabelecida"
echo ""
echo "💬 PRIMEIRO COMANDO:"
echo "   Envie: !menu"
echo ""
echo "🎤 EXPLORAR NOVOS COMANDOS:"
echo "   !historia      — Conhecer minha história"
echo "   !personagem    — Meus traços"
echo "   !cantar        — Me ouça cantando"
echo "   !karaoke       — Modo karaokê"
echo "   !dueto         — Cantar juntos"
echo "   !help          — Ver todos comandos"
echo ""
echo "📚 DOCUMENTAÇÃO:"
echo "   • README.md              — Guia completo"
echo "   • COMANDOS_COMPLETOS.md  — Lista de todos os comandos"
echo "   • CHANGELOG.md           — Histórico de atualizações"
echo ""
echo "🔐 ALTERAR ADMIN:"
echo "   Edite index.js linha ~12:"
echo "   admins: ['seu-numero@c.us']"
echo ""
echo "═════════════════════════════════════════════════════"
echo ""
echo "💜 Defoko aguarda você! Beep~"
echo ""
echo "Iniciando..."
echo ""

# Iniciar o bot
npm start
