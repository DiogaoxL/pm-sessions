# Project Charter

> Documento Estratégico do Projeto

---

# Informações Gerais

| Campo              | Valor                           |
| ------------------ | ------------------------------- |
| Projeto            | PM Sessions _(nome provisório)_ |
| Tipo               | Plataforma Web                  |
| Status             | Em Especificação                |
| Metodologia        | Onion Spec-as-Code              |
| Responsável        | Equipe Pulse Mais               |
| Última atualização | Julho/2026                      |

---

# Visão do Projeto

O **PM Sessions** é uma plataforma web desenvolvida para apoiar a equipe da Pulse Mais na organização de processos seletivos que utilizam entrevistas em grupo.

O projeto nasceu da necessidade de eliminar atividades operacionais repetitivas relacionadas ao agendamento de entrevistas, distribuição de participantes e gerenciamento de múltiplas sessões simultâneas, utilizando o Google Calendar como infraestrutura oficial de agenda.

A proposta é oferecer uma experiência simples para candidatos e uma operação altamente automatizada para a equipe organizadora.

---

# Problema

Durante a execução dos programas da Pulse Mais foram identificadas limitações nas plataformas atuais de agendamento.

Entre os principais problemas estão:

- impossibilidade de trabalhar com múltiplas sessões independentes no mesmo horário;
- necessidade de distribuir participantes manualmente;
- envio manual de links das entrevistas;
- excesso de atividades operacionais durante o processo seletivo;
- ausência de uma ferramenta focada em entrevistas simultâneas.

---

# Objetivo

Desenvolver uma plataforma capaz de automatizar a organização de entrevistas em grupo, permitindo que candidatos realizem seus agendamentos de forma intuitiva enquanto o sistema distribui automaticamente os participantes entre sessões paralelas, integrando-se totalmente ao Google Calendar.

---

# Público-Alvo

## Usuários Administradores

- Equipe da Pulse Mais
- Equipe de Mentores
- Assistente de Tecnologia e Projetos

## Usuários Públicos

- Candidatos dos programas
- Participantes de processos seletivos

---

# Stakeholders

| Stakeholder          | Responsabilidade                           |
| -------------------- | ------------------------------------------ |
| Pulse Mais           | Organização dos programas                  |
| Equipe de Tecnologia | Desenvolvimento e manutenção               |
| Equipe de Mentores   | Realização das entrevistas                 |
| Candidatos           | Agendamento e participação nas entrevistas |

---

# Escopo do MVP

O MVP contempla:

- autenticação via Google;
- integração com Google Calendar;
- integração com Google Meet;
- agendamento público;
- distribuição automática entre sessões;
- múltiplas sessões paralelas;
- painel administrativo;
- exportação de participantes.

---

# Fora do Escopo

Nesta primeira versão não serão desenvolvidos:

- integração com Zoom;
- integração com Microsoft Teams;
- pagamentos;
- notificações por WhatsApp;
- aplicativo mobile;
- múltiplos idiomas;
- dashboard analítico avançado;
- lista de espera;
- reagendamento pelo candidato;
- edição de agenda pelos candidatos.

Esses itens poderão ser considerados em versões futuras.

---

# Premissas

O projeto parte das seguintes premissas:

- o Google Calendar será a fonte oficial da agenda;
- todos os administradores possuirão uma conta Google;
- cada sessão possuirá um Google Meet associado;
- os horários serão previamente definidos pelos administradores;
- a distribuição dos candidatos será realizada automaticamente pelo sistema.

---

# Restrições

- utilização exclusiva do Google Calendar;
- hospedagem utilizando serviços gratuitos durante o MVP;
- arquitetura preparada para crescimento;
- foco inicial em uso interno pela Pulse Mais.

---

# Riscos

## Operacionais

- alterações na Google Calendar API;
- indisponibilidade temporária dos serviços Google;
- configuração incorreta das agendas.

## Negócio

- mudanças no fluxo de seleção;
- crescimento da demanda acima do previsto.

## Segurança

- dados dos candidatos não poderão ser visíveis entre participantes da mesma sessão;
- somente administradores autenticados poderão visualizar listas de participantes;
- todas as operações administrativas deverão exigir autenticação.

---

# Tecnologias Aprovadas

| Camada           | Tecnologia               |
| ---------------- | ------------------------ |
| Front-end        | Next.js                  |
| Linguagem        | TypeScript               |
| UI               | Tailwind CSS + shadcn/ui |
| Banco            | Supabase                 |
| Agenda           | Google Calendar          |
| Videoconferência | Google Meet              |
| Hospedagem       | Vercel                   |

---

# Critérios de Sucesso

O projeto será considerado bem-sucedido quando for capaz de:

- reduzir significativamente o tempo de organização das entrevistas;
- eliminar o envio manual de links;
- automatizar a distribuição entre sessões;
- permitir múltiplas sessões simultâneas;
- proporcionar uma experiência simples para candidatos e administradores.

---

# Definition of Done (MVP)

O MVP será considerado concluído quando:

- todos os fluxos de agendamento estiverem funcionando;
- a integração com Google Calendar estiver validada;
- os convites forem enviados automaticamente;
- o painel administrativo permitir o gerenciamento das sessões;
- os testes de aceitação forem aprovados pela equipe da Pulse Mais.

---

# Roadmap Macro

```text
Foundation
    ↓
Produto
    ↓
Engenharia
    ↓
Bootstrap
    ↓
MVP
    ↓
Testes
    ↓
Deploy
```

---

# Aprovação

Este documento estabelece a direção estratégica do projeto e servirá como referência para todas as decisões de produto e engenharia durante o desenvolvimento do PM Sessions.
