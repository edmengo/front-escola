# Etapa 1: Compilar o projeto (Vite/React)
FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Servir os arquivos com Nginx
FROM nginx:alpine

# Copia os arquivos compilados da Etapa 1 para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração do Nginx (que criamos na raiz)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]