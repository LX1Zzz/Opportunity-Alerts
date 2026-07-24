# Opportunity Alerts — Fase 2

Fase 1 (home) + autenticação real via Supabase: criar conta, entrar e sair.

## Configuração antes de rodar (só na primeira vez)

1. Copie o arquivo `.env.local.example` e renomeie a cópia para `.env.local`.
2. Abra o `.env.local` e preencha com os valores do seu projeto Supabase
   (Project Settings → API): `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Esse arquivo nunca vai para o GitHub (já está no `.gitignore`).

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
