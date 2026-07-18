# Google Cloud Setup

> Status: Active

---

# Objetivo

Documentar toda a configuração realizada no Google Cloud para utilização pelo PM Sessions.

Este documento serve como referência para configuração de novos ambientes, recuperação de credenciais e auditoria da infraestrutura.

---

# Projeto

Project Name

PM Sessions

Project ID

<PROJECT_ID>

Region

Global

---

# APIs habilitadas

As seguintes APIs deverão permanecer habilitadas.

## Google Calendar API

Responsável pela criação, atualização e exclusão de eventos.

Utilizada em:

- Public Scheduling
- Session Allocation

---

## Google People API

Responsável pela obtenção das informações básicas do usuário autenticado.

Utilizada em:

- Authentication

---

# OAuth Consent Screen

Tipo

External

Application Name

PM Sessions

Publishing Status

Testing

---

# OAuth Client

Tipo

Web Application

---

# Authorized JavaScript Origins

Development

http://localhost:3000

http://localhost:3001

Production

https://pm-sessions.vercel.app

---

# Authorized Redirect URIs

Supabase Callback

https://yjyckvesjmqlvxrszown.supabase.co/auth/v1/callback

---

# Credenciais

As seguintes credenciais são utilizadas.

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

As credenciais nunca deverão ser versionadas.

Utilizar apenas variáveis de ambiente.

---

# Integração com Supabase

Authentication

Providers

Google

Client ID

Configurado

Client Secret

Configurado

Site URL

http://localhost:3000

Redirect URLs

http://localhost:3000/**

http://localhost:3001/**

---

# Variáveis de Ambiente

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000

---

# Checklist

- [x] Projeto criado
- [x] Google Calendar API
- [x] Google People API
- [x] OAuth Consent Screen
- [x] OAuth Client
- [x] Redirect URI configurado
- [x] JavaScript Origins configurados
- [x] Supabase integrado
- [x] Ambiente local validado

---

# Próximas Etapas

Foundation 004 — Authentication

- Login Google
- Sessão Supabase
- Persistência
- Middleware
- Proteção de rotas
