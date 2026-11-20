# NOVA SPORT — Back-end

API da loja de tênis NOVA SPORT. Ela cadastra usuários, categorias e produtos no MySQL. O site em React ainda usa o catálogo local e não depende da API para funcionar.

## Como rodar

Você precisa do Node.js 22 ou superior e do MySQL 8. No Prompt de Comando do Windows, abra a pasta do repositório e rode:

```bat
cd backend
npm ci
copy .env.example .env
```

No PowerShell, use `Copy-Item .env.example .env`. No Git Bash, Linux ou macOS, use `cp .env.example .env`.

Abra o `.env`, confira os dados do MySQL e preencha `JWT_SECRET` com a saída deste comando:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Crie um banco vazio no MySQL com o nome indicado em `DB_NAME`. Se estiver usando Docker, rode `docker compose up -d --wait db` em vez de criar o banco manualmente.

```sh
npm run db:migrate
npm start
```

Abra a [documentação no Swagger](http://localhost:3000/docs/). Se mudar a porta no `.env`, use a nova porta no endereço.

## Um teste rápido no Swagger

1. Cadastre um usuário em `POST /v1/user`.
2. Faça login em `POST /v1/user/token` e cole o token em **Authorize**.
3. Em `POST /v1/category`, crie a categoria `Tênis de corrida` com o slug `tenis-de-corrida`.
4. Em `POST /v1/product`, cadastre um `Tênis Runner` com preço e use o ID da categoria em `category_ids`.
5. Em `GET /v1/product/search`, busque `Runner` no campo `match` para conferir o cadastro.

Consultar o catálogo não exige login. Para cadastrar, editar ou excluir produtos e categorias, é preciso usar o token. Cada usuário só pode editar ou excluir a própria conta.

## Onde está cada parte

- `src/routes/` define os caminhos da API, e `src/services/` aplica as regras.
- `src/models/` e `migrations/` descrevem e criam as tabelas do banco.
- `docs/openapi.json` descreve os campos e as respostas de cada rota.

Rode `npm test` para conferir as rotas básicas sem banco. Para rodar também os testes de integração, configure `RUN_DB_TESTS=1` e aponte `DB_NAME` para um banco vazio de teste com nome terminado em `_test`. O GitHub Actions já está configurado para fazer esse teste com MySQL.

[Enunciado do curso](https://github.com/digitalcollegebr/projeto-backend)
