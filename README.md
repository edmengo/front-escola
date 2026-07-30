# Front Escola

Painel React para gestão de entidades, cursos e alunos.

## Requisitos

- Node.js 22+
- API compatível com os endpoints `/login`, `/escolas`, `/cursos` e `/alunos`

## Configuração

Copie `.env.example` para `.env` e informe a URL da API. A API de produção é usada como padrão se a variável não existir.

```bash
npm ci
npm run dev
```

## Comandos

```bash
npm run lint
npm run test
npm run build
```

## Autenticação

O endpoint de login deve responder com `token` ou `accessToken` e, opcionalmente, `usuario`. O token é enviado como `Authorization: Bearer <token>` e uma resposta `401` encerra a sessão local. A API continua responsável por autorizar cada endpoint.

## Docker

```bash
docker compose up --build
```

O frontend fica disponível na porta `8080`.
