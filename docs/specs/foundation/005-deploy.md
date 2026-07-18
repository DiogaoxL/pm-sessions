# 005-deploy.md

# Deploy Foundation

> Foundation Specification — Sprint 1

---

# Status

Planned

---

# Objetivo

Publicar o PM Sessions em ambiente online utilizando Vercel, garantindo integração completa com Supabase e Google Cloud.

Esta etapa finaliza a Sprint Foundation.

---

# Contexto

Após a conclusão do Bootstrap, infraestrutura, banco e autenticação, a aplicação deverá estar disponível para utilização em ambiente remoto.

O Deploy oficial será realizado na Vercel.

---

# Escopo

Esta Foundation contempla:

- criação do projeto na Vercel;
- integração com GitHub;
- configuração das variáveis de ambiente;
- conexão com Supabase;
- conexão com Google OAuth;
- validação do build;
- publicação do ambiente.

Não contempla:

- domínio definitivo;
- ambiente de produção corporativo;
- monitoramento;
- observabilidade.

---

# Entregáveis

Ao final desta Foundation deverão existir:

- aplicação publicada;
- build funcionando;
- variáveis configuradas;
- autenticação funcionando;
- banco conectado.

---

# Critérios de Aceite

- Build executado sem erros.
- Deploy realizado.
- Aplicação acessível.
- Login funcionando.
- Banco conectado.

---

# Dependências

- 000-bootstrap.md
- 002-supabase.md
- 003-google-cloud.md
- 004-authentication.md

---

# Definition of Done

A Sprint Foundation será considerada concluída quando a aplicação estiver publicada, autenticando usuários via Google OAuth e conectada ao Supabase.

---

# Atualização da Documentação

Ao concluir esta Foundation atualizar:

- implementation-log.md
- sprint-1-kickoff.md
- roadmap.md (quando aplicável)
- milestones.md

---

# Próxima Etapa

Início da Sprint 2 — Core MVP.
