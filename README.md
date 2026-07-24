# Opportunity Alerts — Fase 1

Site inicial: só a home page, com o nome do produto e os botões "Entrar" e
"Criar conta" (ainda sem funcionar). Sem banco de dados, sem login, sem IA,
sem crawler.

## Como rodar no seu computador

```bash
npm install
npm run dev
```

Depois abra http://localhost:3000 no navegador.

## Como publicar (deploy) na internet

1. Crie um repositório novo no GitHub e suba este projeto (veja o passo a
   passo completo na explicação do Claude, na conversa).
2. Entre em https://vercel.com com sua conta do GitHub.
3. Clique em "Add New Project" e selecione o repositório.
4. Clique em "Deploy". Não precisa mudar nenhuma configuração.

## Como atualizar o site depois de publicado

Qualquer alteração que você enviar para o GitHub (`git push`) é publicada
automaticamente pela Vercel em 1-2 minutos. Não existe um passo manual de
"publicar de novo".
