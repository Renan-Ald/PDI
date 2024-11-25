# Use a imagem base do Node.js
FROM node:18

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o restante do código do frontend para o diretório de trabalho
COPY . .

# Exponha a porta que a aplicação vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
