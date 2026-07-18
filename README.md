# PM Sessions

> Plataforma corporativa de orquestração de processos seletivos e sessões em grupo.

---

## 1. Descrição do Projeto & Objetivo

O **PM Sessions** é uma solução corporativa estruturada no modelo monorepo para facilitar a gestão de disponibilidade, reserva de horários (time slots) e o andamento de sessões de dinâmica em grupo para processos seletivos. O sistema integra-se de forma nativa ao Google Calendar e utiliza Supabase para persistência e autenticação de administradores.

---

## 2. Stack Tecnológico

- **Monorepo & Workspace Manager**: `pnpm`
- **Core Framework**: Next.js 16 (App Router & React 19)
- **Database & Authentication**: Supabase (PostgreSQL, Row Level Security e Supabase Auth)
- **Styling**: Tailwind CSS v4 & shadcn/ui (Base UI)
- **OAuth Integrations**: Google OAuth (Google Calendar API & People API)
- **Quality Gates**: ESLint, Prettier, Husky, lint-staged, Commitlint

---

## 3. Estrutura do Projeto (Feature-First)

O projeto adota uma arquitetura orientada a domínios (Feature-First):

```text
pm-sessions/
├── apps/
│   └── web/                   # Aplicação web principal em Next.js 16
│       ├── src/
│       │   ├── app/           # App Router (Route Groups, Layouts e Páginas)
│       │   ├── features/      # Lógica e componentes isolados de domínio (ex: auth)
│       │   └── shared/        # Componentes UI, configurações e libs reutilizáveis
├── docs/                      # Documentação técnica e especificações
├── supabase/                  # Estrutura do banco de dados (migrations, seeds e CLI config)
└── LICENSE                    # Licença MIT
```

---

## 4. Pré-requisitos & Instalação

### Pré-requisitos

- **Node.js** v20 ou superior
- **pnpm** v10 ou superior
- **Supabase CLI** (para gerenciar migrações locais)

### Instalação

1. Clone o repositório.
2. Instale as dependências executando na raiz do projeto:
   ```bash
   pnpm install
   ```

---

## 5. Variáveis de Ambiente Necessárias

Copie o arquivo `.env.example` na raiz para `.env` (ou `apps/web/.env.example` para `apps/web/.env.local`) e configure os valores:

| Nome da Variável                | Obrigatória? | Descrição                                                    | Escopo             |
| ------------------------------- | :----------: | ------------------------------------------------------------ | ------------------ |
| `NEXT_PUBLIC_APP_URL`           |     Sim      | URL base do app local/produção (ex: `http://localhost:3000`) | Servidor & Cliente |
| `NEXT_PUBLIC_SUPABASE_URL`      |     Sim      | URL da API do projeto Supabase                               | Servidor & Cliente |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` |     Sim      | Chave pública anônima do Supabase                            | Servidor & Cliente |
| `SUPABASE_SERVICE_ROLE_KEY`     |     Sim      | Chave de privilégios admin (bypassa RLS)                     | Apenas Servidor    |
| `GOOGLE_CLIENT_ID`              |     Sim      | ID do cliente do Google OAuth                                | Servidor & Cliente |
| `GOOGLE_CLIENT_SECRET`          |     Sim      | Segredo do cliente Google OAuth                              | Apenas Servidor    |

---

## 6. Scripts Disponíveis

Executados na raiz do monorepo:

- `pnpm dev`: Inicia o servidor de desenvolvimento.
- `pnpm build`: Executa o build de produção da aplicação.
- `pnpm start`: Inicia o servidor Next.js em modo produção.
- `pnpm lint`: Executa a análise estática com ESLint.
- `pnpm format`: Executa o formatador de código Prettier.

---

## 7. Status das Foundations (Sprint 1)

O progresso de implementação das fundações pode ser acompanhado através de [docs/specs/foundation/FOUNDATIONS-STATUS.md](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/foundation/FOUNDATIONS-STATUS.md):

| ID  | Foundation           | Status       |
| --- | -------------------- | ------------ |
| 001 | Project Setup        | ✅ Concluído |
| 002 | Supabase Persistence | ✅ Concluído |
| 003 | Google Cloud Config  | ✅ Concluído |
| 004 | Authentication Layer | ✅ Concluído |

---

## 8. Roadmap de Desenvolvimento

- **Sprint 1 (Fundações)**: Conclusão do setup, Supabase, Google Cloud Credentials e autenticação SSR com RLS.
- **Sprint 2 (Funcionalidades Core)**: Implementação de reservas públicas de agendamento, gerenciamento de slots por administradores e sincronização bidirecional do Google Calendar.
- **Sprint 3 (Painel de Dynamic Assessments)**: Painel interativo de avaliação de candidatos em tempo real.

---

## 9. Licença

Distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/LICENSE) para mais detalhes.
