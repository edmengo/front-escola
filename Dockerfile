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

# Etapa 3: Injeta a configuração do Nginx para suportar as rotas do React (SPA)
RUN rm /etc/nginx/conf.d/default.conf
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $$uri $$uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
