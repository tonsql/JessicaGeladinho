# Jessica Gourmet — GitHub Pages pronto

Esta pasta já está preparada para publicar o site React/Vite no **GitHub Pages** usando **GitHub Actions**. Você não precisa gerar `dist`, instalar Git nem rodar comandos no seu computador para publicar.

## Publicar pelo navegador do GitHub

1. No repositório `JessicaGeladinho`, substitua os arquivos antigos pelo conteúdo desta pasta. É importante enviar também as pastas `src`, `public`, `supabase` e `.github`.
2. Em **Settings → Pages**, deixe **Source = GitHub Actions**.
3. Em **Settings → Secrets and variables → Actions**, mantenha:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Vá em **Actions** e aguarde o workflow **Deploy Jessica Gourmet to GitHub Pages** terminar com `build` e `deploy` verdes.
5. Abra a URL exibida pelo GitHub Pages e atualize com `Ctrl + F5`.

## Estrutura importante

- `src/`: código React completo.
- `public/`: logo, favicon e arquivos públicos.
- `.github/workflows/deploy-pages.yml`: faz a compilação e publicação automaticamente.
- `supabase/schema.sql`: estrutura do banco de dados.
- `.env.example`: exemplo das variáveis locais. O arquivo `.env` real não deve ser enviado ao GitHub.

## Supabase

O catálogo, estoque, painel administrativo e rastreio usam Supabase. A chave usada no frontend deve ser a **publishable/anon key**, nunca `service_role` ou `sb_secret_...`.

## Painel administrativo

Depois de publicado, acesse:

`https://SEU-USUARIO.github.io/SEU-REPOSITORIO/#/admin`

O rastreio fica em `#/rastreio` e o contato em `#/contato`.
