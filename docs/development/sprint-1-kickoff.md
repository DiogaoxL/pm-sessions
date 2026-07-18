# Sprint 1 Kickoff

> Kick-off oficial da Sprint 1 — Foundation.

---

# Objetivo

Construir toda a infraestrutura técnica necessária para o desenvolvimento do PM Sessions.

Ao final desta sprint, o projeto deverá estar preparado para implementar qualquer funcionalidade do MVP com rapidez e consistência.

---

# Período

Início: 17/07

Previsão de conclusão: 18/07

---

# Objetivo da Sprint

Disponibilizar uma aplicação Next.js funcional, integrada ao Supabase e ao Google, com autenticação administrativa, ambiente configurado e deploy realizado.

---

# Escopo

Esta sprint contempla exclusivamente a infraestrutura da aplicação.

Inclui:

- Bootstrap do projeto
- Configuração do ambiente
- Design System base
- Banco de dados
- Google Cloud
- Google OAuth
- Google Calendar API
- Deploy
- Estrutura de Features

Não inclui:

- Agendamento
- Participantes
- Sessões
- Calendário Público
- Dashboard funcional
- Regras de negócio

---

# Ordem de Implementação

## Etapa 1 — Bootstrap

- Gerar projeto Next.js
- Configurar TypeScript
- Configurar Tailwind CSS
- Configurar shadcn/ui
- Configurar ESLint
- Configurar Prettier
- Configurar Husky
- Configurar Commitlint

Critério de aceite:

Projeto executando localmente.

---

## Status

✅ Concluído

---

## Etapa 2 — Design Foundation

Criar os componentes base:

- Button
- Input
- Card
- Badge
- Dialog
- Drawer
- Sidebar
- Topbar

Critério de aceite:

Componentes renderizando corretamente.

---

## Etapa 3 — Persistência

Criar projeto Supabase.

Criar estrutura inicial:

- admins
- participants
- time_slots
- sessions

Critério de aceite:

Banco conectado ao projeto.

---

## Etapa 4 — Google Cloud

Configurar:

- OAuth
- Google Calendar API

Preparar credenciais.

Critério de aceite:

Credenciais válidas.

---

## Etapa 5 — Autenticação

Implementar:

- Login Google
- Sessão
- Middleware
- Rotas protegidas

Critério de aceite:

Administrador autenticado acessando o Dashboard.

---

## Etapa 6 — Deploy

Publicar aplicação na Vercel.

Configurar:

- variáveis de ambiente;
- domínio provisório;
- integração com Supabase.

Critério de aceite:

Aplicação disponível online.

---

# Dependências

- Conta Google Workspace
- Projeto Google Cloud
- Conta Supabase
- Conta Vercel
- GitHub

---

# Definition of Done

A Sprint será considerada concluída quando:

- Projeto executar localmente.
- Projeto estiver publicado.
- Login Google estiver funcionando.
- Banco conectado.
- APIs Google configuradas.
- Estrutura Feature First criada.
- Ambiente validado.

---

# Riscos

- Configuração do OAuth.
- Limitações da Google Calendar API.
- Configuração de permissões do Google Cloud.
- Erros de variáveis de ambiente.

---

# Próxima Sprint

Sprint 2 — Core MVP

Objetivo:

Implementar o fluxo completo de agendamento e orquestração de sessões utilizando Google Calendar.

---

# Diário da Sprint

Este documento deverá ser atualizado ao final de cada sessão de desenvolvimento.

Registrar:

- funcionalidades concluídas;
- problemas encontrados;
- decisões tomadas;
- pendências;
- próximos passos.
