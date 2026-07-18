# 003-google-cloud.md

# Google Cloud Foundation

> Foundation Specification — Sprint 1

---

# Status

Planned

---

# Objetivo

Preparar toda a infraestrutura necessária do Google Cloud para permitir autenticação via Google OAuth e integração com Google Calendar.

Esta etapa contempla apenas a configuração da plataforma Google Cloud e das credenciais necessárias para o projeto.

Nenhuma funcionalidade de negócio será implementada nesta fase.

---

# Contexto

O PM Sessions utiliza o Google como infraestrutura oficial para autenticação dos administradores e gerenciamento das agendas.

Conforme definido na ADR-004 (Google Calendar) e ADR-005 (Google OAuth), o sistema dependerá da Google Cloud Platform para emissão de credenciais e autorização de acesso.

---

# Escopo

Esta Foundation contempla:

- criação do projeto no Google Cloud;
- configuração da OAuth Consent Screen;
- criação do OAuth Client;
- habilitação da Google Calendar API;
- criação das credenciais;
- definição das URIs autorizadas;
- documentação das variáveis de ambiente.

Não contempla:

- login do usuário;
- sincronização com Google Calendar;
- criação de eventos;
- regras de autorização.

---

# Entregáveis

Ao final desta Foundation deverão existir:

- Projeto Google Cloud criado;
- OAuth Consent Screen configurada;
- OAuth Client ID criado;
- Google Calendar API habilitada;
- Redirect URIs configuradas;
- credenciais armazenadas em variáveis de ambiente.

---

# Critérios de Aceite

- Projeto criado no Google Cloud.
- OAuth configurado.
- Google Calendar API habilitada.
- Credenciais válidas.
- Variáveis documentadas.

---

# Dependências

- 000-bootstrap.md
- 002-supabase.md
- Google Workspace

---

# Definition of Done

Esta Foundation será considerada concluída quando toda a infraestrutura do Google Cloud estiver pronta para utilização pela aplicação.

---

# Atualização da Documentação

Ao concluir esta Foundation atualizar:

- implementation-log.md
- sprint-1-kickoff.md
- technical-context-lite.md (caso necessário)

---

---

# Implementação Executada

## Ambiente Configurado

- Projeto Google Cloud criado.
- Google Calendar API habilitada.
- Google People API habilitada.
- OAuth Consent Screen configurado.
- OAuth Client Web criado.
- Authorized JavaScript Origins configurados.
- Authorized Redirect URI configurado.
- Integração com Supabase Authentication concluída.

---

# Resultado da Validação

## Infraestrutura

✅ Google Cloud operacional.

## OAuth

✅ Credenciais emitidas.

## Supabase

✅ Provider Google habilitado.

## Ambientes

✅ Localhost preparado.

✅ Produção (Vercel) preparada.

---

## Critérios de Aceite

- Projeto Google Cloud criado.
- OAuth Consent Screen configurada.
- Calendar API habilitada.
- People API habilitada.
- Credenciais OAuth geradas.
- Credenciais cadastradas no Supabase.
- Login Google autenticando corretamente no Supabase.
- Usuário sendo criado em auth.users.
- Callback definitivo será implementado na Foundation 004.

---

# Entregáveis

- Google Cloud Project
- OAuth Client
- Calendar API
- People API
- Integração Supabase
- Setup Documentado

---

Status

Implemented

---

# Próxima Foundation

004-authentication.md
