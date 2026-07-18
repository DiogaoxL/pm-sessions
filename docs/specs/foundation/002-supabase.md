# 002 — Supabase

> Foundation Specification — Sprint 1

---

# Objetivo

Implementar a infraestrutura de persistência do PM Sessions utilizando Supabase PostgreSQL como banco de dados oficial da aplicação.

Esta etapa prepara o ambiente para armazenar todos os dados pertencentes ao domínio do sistema que não fazem parte do Google Calendar.

---

# Status

Implemented

Sprint:

Sprint 1 — Foundation

Tipo:

Foundation Specification

Responsável:

Engenharia

Dependências:

- 001-design-foundation.md

Próxima Specification:

- 003-google-cloud.md

---

# Contexto

Conforme definido na ADR-003, o Supabase será utilizado como camada oficial de persistência da aplicação.

O Google Calendar permanece como fonte oficial dos eventos.

O banco armazenará apenas informações próprias do domínio do PM Sessions.

---

# Escopo

Esta Specification contempla:

- criação do projeto Supabase;
- configuração do PostgreSQL;
- integração com Next.js;
- configuração das variáveis de ambiente;
- criação da estrutura inicial do banco;
- definição das chaves primárias;
- definição das Foreign Keys;
- índices;
- constraints;
- timestamps padrão.

---

# Fora do Escopo

Esta etapa não contempla:

- regras de negócio;
- autenticação;
- Row Level Security;
- CRUD;
- triggers;
- functions;
- políticas de acesso;
- migrações futuras.

---

# Estrutura Inicial

Conforme definido em:

docs/development/database-schema.md

Serão criadas inicialmente as seguintes tabelas:

- admins
- participants
- time_slots
- sessions

---

# Regras Técnicas

A estrutura deverá seguir obrigatoriamente:

- UUID como chave primária;
- created_at;
- updated_at;
- Foreign Keys explícitas;
- índices para consultas frequentes;
- integridade referencial;
- nomenclatura padronizada em snake_case.

---

# Variáveis de Ambiente

Devem existir:

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

---

# Critérios de Aceite

- Projeto Supabase criado;
- Banco disponível;
- Cliente integrado ao Next.js;
- Variáveis configuradas;
- Estrutura inicial criada;
- Conexão validada.

---

# Plano de Implementação

1. Criar projeto Supabase.
2. Configurar banco PostgreSQL.
3. Configurar variáveis de ambiente.
4. Instalar SDK.
5. Criar cliente.
6. Criar estrutura inicial das tabelas.
7. Validar conexão.
8. Atualizar implementation-log.md.

---

# Checklist Técnico

- Projeto criado
- Banco criado
- Cliente funcionando
- Variáveis documentadas
- Estrutura inicial criada
- Build funcionando

---

# Dependências

- Next.js Bootstrap
- pnpm
- TypeScript
- Database Schema
- ADR-003

---

# Riscos

- Configuração incorreta das variáveis.
- Permissões inadequadas.
- Divergência entre schema e documentação.

---

# Testes Esperados

- Conexão estabelecida.
- Cliente inicializado.
- Consulta simples executada.
- Build sem erros.

---

# Definition of Done

A Specification será considerada concluída quando:

- Banco operacional;
- Estrutura criada;
- Integração validada;
- implementation-log atualizado;
- Critérios de aceite atendidos.

---

# Referências

- ADR-003 — Supabase
- Architecture.md
- Database Schema
- Sprint 1 Kickoff
