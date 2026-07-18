# 000 - Bootstrap

> Especificação da infraestrutura inicial do PM Sessions.

---

# Status

🟢 Approved

---

# Objetivo

Construir a infraestrutura inicial do projeto, estabelecendo todas as ferramentas, integrações e padrões necessários para o desenvolvimento do MVP.

Ao final desta Specification, o projeto deverá estar preparado para iniciar a implementação das funcionalidades previstas no Roadmap.

---

# Contexto

Esta Specification representa o início da fase de desenvolvimento.

Nenhuma funcionalidade de negócio será implementada nesta etapa.

O objetivo é garantir uma base sólida, padronizada e reproduzível para toda a equipe.

---

# Escopo

Esta Specification contempla:

- criação da aplicação Next.js;
- configuração do monorepo;
- configuração do ambiente de desenvolvimento;
- configuração do Supabase;
- configuração do Google Cloud;
- configuração da Vercel;
- configuração da qualidade de código;
- configuração da documentação técnica inicial.

---

# Fora do Escopo

Esta Specification não contempla:

- autenticação;
- integração com Google Calendar;
- criação de eventos;
- painel administrativo;
- agendamentos;
- participantes;
- regras de negócio.

---

# Entregáveis

Ao final desta Specification deverão existir:

- aplicação Next.js criada;
- projeto executando localmente;
- repositório organizado;
- variáveis de ambiente configuradas;
- Supabase conectado;
- Google Cloud configurado;
- projeto publicado na Vercel;
- CI inicial funcionando.

---

# Estrutura Esperada

```text
apps/
packages/
docs/
.github/

apps/web/
```

Toda a estrutura deverá seguir a arquitetura definida em `architecture.md`.

---

# Stack

## Framework

- Next.js

## Linguagem

- TypeScript

## UI

- Tailwind CSS
- shadcn/ui

## Backend

- Server Actions
- Route Handlers (quando necessário)

## Banco

- Supabase PostgreSQL

## Autenticação

- Google OAuth

## Deploy

- Vercel

---

# Ferramentas

## Qualidade

- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint

---

## Versionamento

Git + GitHub

---

# Estrutura Inicial

A aplicação deverá conter a estrutura Feature-First definida pela arquitetura.

Nenhuma regra de negócio deverá ser criada nesta etapa.

---

# Configurações Necessárias

## Google Cloud

- Projeto criado
- OAuth configurado
- Calendar API habilitada
- Redirect URI configurada

---

## Supabase

- Projeto criado
- Banco inicial
- Variáveis configuradas

---

## Vercel

- Projeto conectado
- Variáveis configuradas
- Deploy Preview funcionando

---

# Critérios de Aceite

A Specification será considerada concluída quando:

- [ ] Projeto executa localmente.
- [ ] Deploy Preview funciona.
- [ ] Supabase conecta.
- [ ] Google OAuth configurado.
- [ ] Google Calendar API habilitada.
- [ ] ESLint funcionando.
- [ ] Prettier funcionando.
- [ ] Husky funcionando.
- [ ] Estrutura Feature-First criada.
- [ ] Monorepo organizado.

---

# Dependências

Nenhuma.

Esta é a primeira Specification do projeto.

---

# Riscos

- Configuração incorreta do Google Cloud.
- Variáveis de ambiente inválidas.
- Problemas de permissões OAuth.
- Configuração incorreta do Supabase.

---

# Testes Esperados

## Ambiente

- Projeto inicia sem erros.

---

## Build

- Build executa com sucesso.

---

## Lint

- Lint executa sem erros.

---

## Deploy

- Deploy Preview publicado.

---

# Checklist Técnico

## Ambiente

- [ ] Node instalado
- [ ] PNPM instalado

---

## Projeto

- [ ] Next criado
- [ ] Tailwind
- [ ] shadcn/ui

---

## Código

- [ ] ESLint
- [ ] Prettier
- [ ] Husky
- [ ] Commitlint

---

## Infraestrutura

- [ ] Supabase
- [ ] Google Cloud
- [ ] Google OAuth
- [ ] Google Calendar API
- [ ] Vercel

---

# Definition of Done

Esta Specification somente poderá ser movida para `implemented` quando:

- todos os critérios de aceite forem atendidos;
- todos os testes previstos forem aprovados;
- documentação atualizada;
- revisão técnica concluída;
- primeiro deploy realizado.

---

# Plano de Implementação

## Etapa 1 — Inicialização do Projeto

- Criar o projeto Next.js
- Configurar TypeScript
- Configurar PNPM Workspace
- Validar execução local

---

## Etapa 2 — Configuração da Interface

- Configurar Tailwind CSS
- Instalar shadcn/ui
- Configurar tema base
- Criar layout inicial

---

## Etapa 3 — Qualidade de Código

- Configurar ESLint
- Configurar Prettier
- Configurar Husky
- Configurar lint-staged
- Configurar Commitlint

---

## Etapa 4 — Infraestrutura

- Criar projeto Supabase
- Configurar variáveis de ambiente
- Validar conexão

---

## Etapa 5 — Google Cloud

- Criar projeto
- Configurar OAuth
- Habilitar Google Calendar API
- Configurar credenciais

---

## Etapa 6 — Deploy

- Configurar Vercel
- Configurar variáveis
- Primeiro Deploy Preview
- Validar ambiente

---

# Próxima Specification

001-public-scheduling.md
