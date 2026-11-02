# RUALTA — Seu ritmo, sua rua

**Loja conceito de sneakers** desenvolvida com React e Vite. Marca, interface, textos, catálogo fictício, paleta e ilustrações SVG criados especificamente para este projeto de estudo.

## O que o aplicativo oferece

- Página inicial com vitrine, carrossel e três coleções.
- Página independente de coleções por estilo.
- Catálogo com **12 modelos fictícios**, busca por texto, filtros de categoria e perfil, limite de preço e ordenação.
- Página de detalhes com galeria, escolha de tamanho e de cor, avaliações ilustrativas e produtos relacionados.
- Carrinho de compras demonstrativo com ajuste de quantidades, subtotal e armazenamento local.
- Favoritos que permanecem salvos no navegador.
- Layout adaptável a celulares, tablets e computadores.
- Páginas informativas para conta, cadastro e pedidos (sem backend).

> **Aviso:** projeto exclusivamente de Front-end. O catálogo e os preços são fictícios; não há transações, estoque, pagamentos, criação de contas, newsletter enviada ou pedidos reais. O carrinho e os favoritos usam `localStorage`.

## Executar no Visual Studio Code

**Pré-requisitos:** Node.js versão 20.19 ou superior e npm.

1. Descompacte esta pasta e abra-a no Visual Studio Code em **Arquivo → Abrir Pasta**.
2. Abra o terminal integrado (`Ctrl + J` ou **Terminal → Novo Terminal**).
3. Execute:

```bash
npm install
npm run dev
```

4. Abra o endereço indicado no terminal, geralmente **http://localhost:5173**.

## Testes e compilação

```bash
npm test
npm run build
npm run preview
```

A pasta `dist/` é gerada pelo build, mas não vai para o GitHub por estar no `.gitignore`.

## Publicar no GitHub

Crie um **repositório vazio e público** no GitHub com o nome `rualta-store`, sem inicializar com README, e execute no terminal da pasta do projeto:

```bash
git init
git add .
git commit -m "feat: aplicação RUALTA React"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/rualta-store.git
git push -u origin main
```

Substitua `SEU_USUARIO` pelo nome do seu perfil do GitHub. O GitHub pode solicitar autenticação. Se você já iniciou um repositório ou usa um fork, adapte o remoto para não sobrescrever trabalho existente.

### Publicação opcional na Vercel

1. Acesse [vercel.com](https://vercel.com/) e conecte seu GitHub.
2. Importe o repositório `rualta-store`.
3. Vite é detectado automaticamente: build `npm run build`, pasta de saída `dist`.
4. O arquivo `vercel.json` já permite acessar rotas React diretamente.

## Tecnologias

React 18 · React Router DOM 6 · Vite 6 · CSS puro · Lucide Icons · SVG autoral · JavaScript moderno.

## Arquitetura

```
src/
  assets/           Logo original em SVG
  components/       Cabeçalho, rodapé, cards, filtros, galeria, compra e carrinho
  context/          Estado de carrinho/favoritos
  data/             Catálogo fictício
  pages/            Início, listagem, detalhes, favoritos e páginas informativas
  utils/            Formatação de preços e filtros
  App.jsx           Rotas
  main.jsx          Inicialização do React
  styles.css        Identidade visual responsiva
public/shoes/        36 ilustrações de tênis em SVG
```

## Rotas

| URL | Conteúdo |
|---|---|
| `/` | Página inicial |
| `/products` | Catálogo |
| `/products?filter=nome` | Pesquisa por palavra |
| `/products?category=Corrida` | Categoria selecionada |
| `/product/loop` | Detalhes do modelo Loop 01 |
| `/categories` | Coleções |
| `/favorites` | Favoritos |
| `/orders` | Página informativa |

## Sobre o projeto

Esta é uma **interpretação visual e técnica original de um exercício de Front-end em React** com requisitos de home, listagem e detalhes. Não utiliza logomarcas, imagens, código ou nomes da loja de referência. A interface foi reimaginada do zero para demonstrar componentização, estado React, navegação e UX de e-commerce.

**Participantes:** preencha seu nome e, se houver, os nomes dos integrantes antes de apresentar.

**Autor(a):** [SEU NOME AQUI]

**Link do repositório:** [ADICIONAR APÓS PUBLICAR]

**Link do site:** [ADICIONAR APÓS DEPLOY]
