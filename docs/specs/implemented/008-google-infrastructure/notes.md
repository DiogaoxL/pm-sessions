# Notas Técnicas & Referências — RC-008

Este documento consolida referências de infraestrutura, schemas de variáveis de ambiente e comandos úteis para a parametrização do Google Workspace.

---

## 1. Schema das Variáveis de Ambiente (Next.js & Vercel)

Para configurar a integração em produção, insira as seguintes chaves nas configurações do projeto na Vercel:

```env
# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-seu-client-secret"

# Long-lived Refresh Token (obtenção offline)
GOOGLE_REFRESH_TOKEN="1//0g-seu-refresh-token-offline"

# ID da Agenda (Geralmente 'primary' para a conta autenticada)
GOOGLE_CALENDAR_ID="primary"
```

---

## 2. Redirecionamentos Autorizados do GCP

As URIs a seguir devem corresponder exatamente às configuradas no console do Google Cloud para evitar o erro `redirect_uri_mismatch`:

| Ambiente            | URI Autorizada                   | URI de Callback OAuth                          |
| ------------------- | -------------------------------- | ---------------------------------------------- |
| **Desenvolvimento** | `http://localhost:3000`          | `http://localhost:3000/auth/callback`          |
| **Produção**        | `https://pm-sessions.vercel.app` | `https://pm-sessions.vercel.app/auth/callback` |

---

## 3. Comandos Úteis e Auditoria

- Para inspecionar os tokens de renovação e testar a integridade das requisições via curl/CLI:

```bash
# Validar se o token de acesso Google é obtido a partir do refresh token
curl -X POST https://oauth2.googleapis.com/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d refresh_token=YOUR_REFRESH_TOKEN \
  -d grant_type=refresh_token
```

- **Status Esperado**: Resposta JSON HTTP `200 OK` contendo um novo `access_token` e tempo de expiração (`expires_in: 3599`).
