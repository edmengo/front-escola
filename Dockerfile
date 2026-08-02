# Etapa 1: Compilar o projeto (Vite/React)
FROM node:22.22.0-alpine3.23 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Servir os arquivos com Nginx
FROM nginx:1.28.2-alpine3.23

# Copia os arquivos compilados da Etapa 1 para a pasta pública do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração do Nginx (que criamos na raiz)
COPY nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
