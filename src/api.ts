import axios from 'axios';

// Aqui você aponta para o domínio que configurou no Nginx/Cloudflare
export const api = axios.create({
  baseURL: 'https://api.codeapps.com.br',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});