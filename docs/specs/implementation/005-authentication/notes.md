# Notas Gerais — Feature 005

- **Configurações no Console do Google Cloud**: A implementação da Task 01 depende diretamente de adicionar o domínio local `http://localhost:3000` (e o de homologação) em "Authorized JavaScript origins" e `http://localhost:3000/auth/callback` em "Authorized redirect URIs" no Google OAuth Consent Screen Config.
- **Cookies**: Atentar para a correta persistência dos tokens do Supabase nos cookies em contextos de SSR no Next.js App Router (usando `@supabase/ssr` e gerenciador de cookies no middleware).
