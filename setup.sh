#!/bin/bash

echo "🚀 Iniciando setup do projeto..."

# Criar diretório hooks se não existir
echo "📁 Criando diretório hooks..."
mkdir -p src/hooks

# Criar arquivo useSound.ts se não existir
echo "📝 Criando arquivo useSound.ts..."
touch src/hooks/useSound.ts

# Instalar dependências
echo "📦 Instalando dependências..."
npm install @tonconnect/ui-react
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer

# Inicializar Tailwind
echo "🎨 Configurando Tailwind CSS..."
npx tailwindcss init -p

echo "✅ Setup concluído com sucesso!" 