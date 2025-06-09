#!/bin/bash

# SCRIPT DE MIGRAÇÃO REACT → REACT NATIVE
echo "🔄 Iniciando migração React → React Native..."

# Criar backup
echo "📂 Criando backup..."
cp -r src/ src_backup/

# Renomear arquivos .tsx para .js
echo "🔄 Convertendo arquivos TypeScript para JavaScript..."
find src/ -name "*.tsx" -exec bash -c 'mv "$1" "${1%.tsx}.js"' _ {} \;
find src/ -name "*.ts" -not -name "*.d.ts" -exec bash -c 'mv "$1" "${1%.ts}.js"' _ {} \;

echo "✅ Arquivos renomeados:"
find src/ -name "*.js" | head -10

# Conversões básicas em arquivos JavaScript
echo "🔄 Aplicando conversões básicas..."

# Substituir imports comuns
find src/ -name "*.js" -exec sed -i 's/from "react-router-dom"/from "@react-navigation\/native"/g' {} \;
find src/ -name "*.js" -exec sed -i 's/useNavigate/useNavigation/g' {} \;

# Substituir alguns componentes básicos
find src/ -name "*.js" -exec sed -i 's/<div/<View/g' {} \;
find src/ -name "*.js" -exec sed -i 's/<\/div>/<\/View>/g' {} \;
find src/ -name "*.js" -exec sed -i 's/<h[1-6][^>]*>/<Text style={styles.title}>/g' {} \;
find src/ -name "*.js" -exec sed -i 's/<\/h[1-6]>/<\/Text>/g' {} \;
find src/ -name "*.js" -exec sed -i 's/<p[^>]*>/<Text>/g' {} \;
find src/ -name "*.js" -exec sed -i 's/<\/p>/<\/Text>/g' {} \;

# Substituir button por TouchableOpacity
find src/ -name "*.js" -exec sed -i 's/<button/<TouchableOpacity/g' {} \;
find src/ -name "*.js" -exec sed -i 's/<\/button>/<\/TouchableOpacity>/g' {} \;
find src/ -name "*.js" -exec sed -i 's/onClick=/onPress=/g' {} \;

# Substituir input por TextInput
find src/ -name "*.js" -exec sed -i 's/<input/<TextInput/g' {} \;

# Remover className (será substituído por style depois)
find src/ -name "*.js" -exec sed -i 's/className="[^"]*"//g' {} \;

# Verificar arquivos que ainda podem ter problemas
echo "🔍 Arquivos que podem precisar de ajuste manual:"
grep -r "className\|class=" src/ | head -5 || echo "Nenhum className encontrado"
grep -r "import.*\/components\/ui" src/ | head -5 || echo "Nenhum import de UI components encontrado"

echo "✅ Migração automática concluída!"
echo "📋 Próximos passos manuais:"
echo "1. Ajustar imports de React Native"
echo "2. Converter estilos CSS para StyleSheet"
echo "3. Testar componentes individualmente"
echo "4. Ajustar navegação"