# Relatório de Fechamento da Sprint 2 — Baseline Core MVP

## Resumo Executivo

Ao término da Sprint 2, a equipe alcançou o objetivo de entregar a espinha dorsal funcional do PM Sessions (fluxo E2E de agendamento público e visualização administrativa). O sistema agora é capaz de verificar a agenda do Google Calendar em tempo real, alocar participantes de forma atômica/concorrente nas sessões do banco de dados local, gerar eventos de videoconferência no Google Meet e apresentar o andamento dos agendamentos em um Dashboard administrativo seguro.

---

## 1. Relatório de Aderência da Sprint

| Funcionalidade / Item Planejado                       | Escopo Entregue                                                 | Status                                       |
| :---------------------------------------------------- | :-------------------------------------------------------------- | :------------------------------------------- |
| **Página Pública de Agendamento (Feature 001)**       | Renderização de faixas de data/hora e formulário de inscrição.  | ✅ Concluído                                 |
| **Integração Google Calendar (Feature 002)**          | Filtro em tempo real de horários ocupados via API do Calendar.  | ✅ Concluído                                 |
| **Distribuição e Alocação Concorrente (Feature 003)** | RPC `allocate_participant` no Postgres com locks concorrentes.  | ✅ Concluído                                 |
| **Dashboard Administrativo (Feature 004)**            | Visualização consolidada de sessões, participantes e métricas.  | ✅ Concluído                                 |
| **Segurança e Login (Feature 005)**                   | Autenticação via Google OAuth no Supabase e controle de acesso. | ✅ Concluído                                 |
| **Exportação de Participantes (Feature 007)**         | Geração e download de arquivo CSV administrativo.               | ❌ Não iniciado (Postergado para a Sprint 3) |

---

## 2. Linha do Tempo da Sprint 2

1. **Setup Inicial da Sprint (18/07)**: Ativação dos endpoints públicos e definição da modelagem de dados complementar (Time Slots, Sessions, Participants).
2. **Integração Calendar (18/07 - 19/07)**: Conexão das APIs Google e suporte a timezones.
3. **Mecanismo de Alocação Concorrente (19/07)**: Lançamento do script de concorrência atômica no banco de dados e testes paralelos automatizados.
4. **Painel do Administrador (20/07)**: Criação de queries de agregação para métricas de ocupação e proteção de rotas no middleware.
5. **Autenticação Google e Escopos (20/07 - 21/07)**: Atualização do middleware de segurança para cobrir roles `admin` e `super_admin`. Criação de banner de permissão de escrita e barreira visual de erros `/auth/error`.

---

## 3. Estado Atual do Sistema

### Público (Candidato)

- Visualização de horários de entrevistas disponíveis atualizados de acordo com a agenda.
- Inserção de dados obrigatórios de contato (Nome, E-mail, Telefone).
- Recebimento de link do Google Meet após a confirmação.

### Administrativo (Host/Administrador)

- Login social com contas institucionais do Google.
- Acesso à barra superior com indicador de perfil ativo e botão de Logout funcional.
- Exibição de cards estatísticos: Inscritos Confirmados, Slots Disponíveis e Sessões Ativas.
- Listagem cronológica agrupada por data contendo sessões abertas, ocupação e participantes vinculados.
- Alerta visual (`CalendarAuthBanner`) caso os escopos do Calendar estejam indisponíveis ou revogados.

### Backend & UI

- **Implementados**: Services e Repositories locais, Middleware de controle de rotas, Server Actions para autenticação, consultas e modificações, e barreira de erro visual `/auth/error`.
- **Pendências de UI**: As ações administrativas de criar/excluir slots, mover ou cancelar participantes não possuem interface gráfica nativa (são disparadas exclusivamente via Server Actions / API de serviços).

---

## 4. Análise de Atingimento dos Objetivos da Sprint

- **O objetivo de ponta a ponta (E2E) foi atingido?** **Sim**. É possível realizar o login administrativo, visualizar o dashboard, acessar a página pública, selecionar horários livres, concluir a alocação de participantes no banco, registrar o evento no Google Calendar e gerar a sala do Meet de forma nativa.
- **Fração Concluída**: Estima-se que **90%** da Sprint planejada foi integralmente entregue e validada, com a exportação CSV postergada para a Sprint de evolução para mitigar riscos de prazo de entrega do MVP.

---

## 5. Próximas Features (Roadmap Sugerido)

### Alta Prioridade

- **Gerenciamento visual de Slots (CRUD na UI)**: Interface administrativa com botões/formulários para que o administrador possa cadastrar, atualizar e fechar horários sem necessitar de seeds ou scripts.
- **Exportação CSV**: Cumprimento do item planejado restante para permitir geração de relatórios físicos de candidatos.

### Média Prioridade

- **Notificações por E-mail/WhatsApp**: Alertas de confirmação adicionais aos candidatos.

---

## 6. Parecer Final e Baseline

A Sprint 2 está **PRONTA para merge**. O core do produto foi amplamente testado contra regressões estáticas, padrões de estilo e testes funcionais (87/87 testes verdes).

---

## Questão Estratégica (MVP E2E Mínimo)

> _"Considerando a visão do produto, qual é o menor conjunto de funcionalidades restante para que um administrador consiga abrir horários e um usuário consiga agendar uma sessão de ponta a ponta (E2E), permitindo iniciar testes reais com usuários?"_

O menor conjunto restante consiste em **uma interface administrativa básica para criação/cadastro de novos Time Slots**. Atualmente, o fluxo público depende de horários pré-existentes criados via banco de dados ou scripts de seed. Ao construir uma interface simples de formulário contendo `Data`, `Hora de Início`, `Hora de Fim` e `Capacidade` no Dashboard administrativamente protegido, o sistema torna-se 100% autônomo para o início de testes reais de ponta a ponta com usuários de teste.
