# NOVA SPORT — Back-end

API REST educacional de usuários, categorias e produtos. O site em React continua na raiz do repositório e, nesta etapa, ainda usa o catálogo local. A API tem execução e dependências próprias em `backend/`.

## Requisitos

- Node.js 22 ou superior e npm.
- MySQL 8, instalado localmente ou iniciado pelo Docker Compose incluído.
- Um segredo JWT aleatório no seu ambiente local. Nunca envie o arquivo `.env` ao GitHub.

## Executar

Abra o terminal na raiz do repositório e entre no back-end.

```sh
cd backend
npm ci
```

Copie `.env.example` para `.env`. No Prompt de Comando do Windows, use `copy .env.example .env`. No PowerShell, use `Copy-Item .env.example .env`. No Git Bash, Linux ou macOS, use `cp .env.example .env`.

Gere um segredo para preencher em `JWT_SECRET`.

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Ajuste as variáveis `DB_*` no `.env`. Se usar Docker, execute `docker compose up -d --wait db` dentro de `backend/`. O Compose cria o banco e o usuário conforme o arquivo `.env`. Se já tem MySQL instalado, crie um banco vazio e use as credenciais de um usuário com acesso a ele.

```sh
npm run db:migrate
npm start
```

- Swagger e testes manuais pelo navegador em [http://localhost:3000/docs/](http://localhost:3000/docs/).
- Diagnóstico em [http://localhost:3000/health](http://localhost:3000/health).
- Especificação em [docs/openapi.json](docs/openapi.json).
- Modo desenvolvimento com reinício automático usando `npm run dev`.

> `npm run db:migrate:undo` reverte a última migration e, para a migration inicial, remove as tabelas e os dados. Use somente quando realmente quiser reverter.

## Testar a API pelo Swagger

1. Execute `POST /v1/user` com nome, sobrenome, e-mail, senha e confirmação.
2. Execute `POST /v1/user/token` com e-mail e senha. Copie só o valor de `token`.
3. Clique em **Authorize** e cole o token. O Swagger adiciona o prefixo `Bearer`.
4. Cadastre uma categoria em `POST /v1/category` e use seu ID para cadastrar um produto em `POST /v1/product`.
5. Consulte o catálogo com `GET /v1/product/search`. Você pode filtrar por termo, categoria, preço ou opção.

| Recurso | Rotas |
| --- | --- |
| Usuários | `POST /v1/user`, `POST /v1/user/token`, `GET/PUT/DELETE /v1/user/:id` |
| Categorias | `GET /v1/category/search`, `POST /v1/category`, `GET/PUT/DELETE /v1/category/:id` |
| Produtos | `GET /v1/product/search`, `POST /v1/product`, `GET/PUT/DELETE /v1/product/:id` |

### Decisões de implementação

- A API usa Express, Sequelize e MySQL. As migrations criam seis tabelas e índices para preço e relacionamento produto–categoria.
- Senhas são armazenadas como hash bcrypt. O JWT expira (1 hora por padrão). Usuários só podem alterar ou excluir a própria conta. As escritas no catálogo exigem conta autenticada, conforme o escopo didático.
- Cadastro e emissão de token são públicos. Para rotas protegidas, token ausente ou inválido retorna `401`, seguindo as respostas definidas em cada rota do enunciado. A tentativa de modificar a conta de outra pessoa retorna `403`.
- Produtos aceitam imagens PNG, JPEG, GIF e WebP em base64 de até 2 MiB por arquivo. URLs HTTP(S) são apenas registradas, sem download pelo servidor. Arquivos locais são servidos em `/media/` e precisam de armazenamento persistente se a API for hospedada.
- Para atualizar imagens e opções existentes, envie o respectivo `id`. Para excluir uma, envie seu `id` com `deleted: true`. Para adicionar, omita o `id`.
- O site React só deve passar a consumir a API em uma próxima etapa. Configure `CORS_ORIGIN` com o endereço permitido quando fizer essa integração.

## Testes automatizados

`npm test` executa os testes Jest sem banco. Para também exercitar as rotas contra um banco real, crie um banco **exclusivo e vazio** para teste (por exemplo, `nova_sport_test`), configure `DB_NAME` para esse banco e `RUN_DB_TESTS=1` no ambiente. A suíte roda as migrations e limpa as tabelas desse banco. O GitHub Actions executa a suíte completa com MySQL 8.4.

Estrutura: `src/routes/` mapeia rotas, `src/controllers/` trata as respostas HTTP, `src/services/` contém as regras e `src/models/` descreve as tabelas e relações. `migrations/` controla a versão do banco.

Escopo de referência: [Digital College — Projeto Back-end](https://github.com/digitalcollegebr/projeto-backend).
