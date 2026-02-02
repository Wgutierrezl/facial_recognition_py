# Usar Node.js LTS como base
FROM node:20-alpine

# Instalar dependencias del sistema necesarias para Expo
RUN apk add --no-cache \
    git \
    bash \
    curl

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar Expo CLI globalmente
RUN npm install -g expo-cli @expo/ngrok

# Copiar el resto del código
COPY . .

# Exponer puertos necesarios para Expo
# 8081: Metro bundler
# 19000: Expo DevTools
# 19001: Expo DevTools (alternative)
# 19002: Expo DevTools (alternative)
EXPOSE 8081 19000 19001 19002

# Variable de entorno para permitir conexiones externas
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Comando para iniciar Expo
CMD ["npx", "expo", "start", "--tunnel"]