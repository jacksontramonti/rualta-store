# NOVA SPORT — Movimento sem limites

Loja conceito de calçados esportivos desenvolvida em **React 18 + Vite 6**, com marca, textos e catálogo fictício próprios.

## Funcionalidades

- Home com destaque principal, três coleções e oito produtos em alta.
- Catálogo com 12 modelos fictícios e pesquisa por nome (rota `/products?filter=termo`).
- Listagem com barra lateral de aproximadamente 308 px no desktop, filtros por categoria e perfil, limite de preço e ordenação.
- Visualização detalhada com galeria de três imagens, miniaturas de 117 × 95 px no desktop, cores, tamanhos e produtos relacionados.
- Carrinho demonstrativo com quantidade, subtotal e armazenamento no navegador (`localStorage`).
- Favoritos, página de coleções, página Sobre e layout responsivo.
- Páginas de cadastro e pedidos ilustrativas, sem autenticação ou transações reais.

> **Projeto educacional:** os produtos, preços, frete e avaliações são simulações. Este site não realiza pagamentos, entregas, autenticação, envio de newsletter ou emissão de pedidos.

## Abrir no Visual Studio Code

Requisitos: **Node.js 20.19+** e npm. No terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

Abra a URL `http://localhost:5173/` exibida no terminal.

## Testar e compilar

```bash
npm test
npm run build
npm run preview
```

O build gera a pasta `dist/`. O GitHub Actions executa testes e build a cada push ou pull request na branch principal.

## GitHub e publicação

Repositório existente: https://github.com/jacksontramonti/rualta-store

O endereço do repositório permanece **rualta-store** para preservar os links anteriores; o nome de apresentação da loja e do pacote é **NOVA SPORT**. A branch `main` contém a versão pública; as melhorias de design podem ser revisadas em uma pull request antes de integrar.

Para baixar a versão mais recente no VS Code:

```bash
git clone https://github.com/jacksontramonti/rualta-store.git
cd rualta-store
npm install
npm run dev
```

Para publicar na Vercel, importe esse repositório, defina `npm run build` como build e `dist` como diretório de saída. O arquivo `vercel.json` contém a regra de fallback para as rotas do React.

## Organização

- `src/components/` — elementos compartilhados (cabeçalho, busca, galeria, produtos, opções, carrinho, rodapé).
- `src/pages/` — Home, listagem, detalhes, favoritos, coleções, Sobre e páginas auxiliares.
- `src/data/products.js` — catálogo fictício de 12 produtos.
- `src/context/ShopContext.jsx` — estado e persistência do carrinho/favoritos.
- `src/styles.css` — sistema visual responsivo azul-marinho e verde-lima.
- `public/shoes/` — 36 ilustrações SVG de tênis do catálogo.
- `tests/` — verificações automatizadas do catálogo, dos recursos e da marca.

## Identidade e escopo

A NOVA SPORT é uma interpretação original de um exercício de Front-end com três páginas essenciais: Home, listagem e detalhes. Foram aproximadas as proporções e a organização de conteúdo descritas no escopo (banner 1440 × 681 px de referência, três coleções, oito produtos, filtros laterais e galeria com miniaturas), mantendo cores, marca, textos e imagens próprios. Não representa reprodução pixel a pixel do Figma; a correspondência final precisa ser avaliada visualmente.

**Projeto:** NOVA SPORT · **Repositório:** [jacksontramonti/rualta-store](https://github.com/jacksontramonti/rualta-store) · **Autor no GitHub:** [@jacksontramonti](https://github.com/jacksontramonti)
