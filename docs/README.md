# PM Sessions

> Plataforma interna para gerenciamento de entrevistas, mentorias e sessões simultâneas utilizando Google Calendar como agenda principal.

---

# Visão Geral

O **PM Sessions** é uma plataforma desenvolvida para apoiar a equipe da **Pulse Mais** na organização de processos seletivos que utilizam entrevistas em grupo.

A aplicação permite que candidatos realizem seus agendamentos de forma simples e intuitiva, enquanto distribui automaticamente os participantes entre múltiplas sessões paralelas de um mesmo horário, eliminando limitações encontradas nas ferramentas tradicionais de agendamento.

Embora tenha nascido para atender ao Programa de Mentoria da Pulse Mais, sua arquitetura foi concebida para suportar qualquer processo seletivo, programa ou evento que necessite de gerenciamento de sessões simultâneas.

---

# Problema

Durante a organização dos programas da Pulse Mais foram identificadas limitações importantes nas ferramentas disponíveis no mercado:

- impossibilidade de criar múltiplas sessões independentes no mesmo horário;
- distribuição manual dos candidatos entre entrevistadores;
- necessidade de enviar links do Google Meet manualmente;
- dificuldade para acompanhar participantes de cada sessão;
- ausência de um fluxo pensado para entrevistas simultâneas.

O PM Sessions nasce para resolver exatamente esse cenário.

---

# Objetivos

- Automatizar o processo de agendamento.
- Utilizar o Google Calendar como fonte oficial da agenda.
- Distribuir automaticamente candidatos entre sessões.
- Simplificar a operação da equipe organizadora.
- Proporcionar uma experiência semelhante ao Calendly para o candidato.

---

# Principais Funcionalidades

## Público

- Agendamento online
- Calendário interativo
- Escolha de data e horário
- Confirmação automática
- Convite enviado pelo Google Calendar
- Link do Google Meet automático

## Administração

- Login com Google
- Configuração de capacidade por sessão
- Configuração do número máximo de sessões paralelas
- Distribuição automática dos participantes
- Visualização das sessões
- Exportação dos participantes
- Integração completa com Google Calendar

---

# Stack Tecnológica

| Camada           | Tecnologia               |
| ---------------- | ------------------------ |
| Front-end        | Next.js                  |
| Linguagem        | TypeScript               |
| UI               | Tailwind CSS + shadcn/ui |
| Banco de Dados   | Supabase                 |
| Agenda           | Google Calendar          |
| Videoconferência | Google Meet              |
| Hospedagem       | Vercel                   |

---

# Estrutura do Projeto

A documentação completa encontra-se na pasta `docs/`.

```
docs/
├── architecture/
├── adr/
├── product/
│   ├── product-vision.md
│   └── sprint-plan.md
├── specs/
├── sessions/
├── README.md
├── roadmap.md
├── milestones.md
├── architecture.md
├── architecture-decisions.md
├── business-context-lite.md
├── technical-context-lite.md
├── onion-cycles.md
└── development/
    ├── sprint-2-Kickoff.md
    └── sprint-2-closing-report.md
```

---

# Documentação

A documentação do projeto está organizada em camadas.

| Documento         | Objetivo                            |
| ----------------- | ----------------------------------- |
| Project Charter   | Visão estratégica do projeto        |
| Business Context  | Regras de negócio                   |
| Technical Context | Arquitetura técnica                 |
| Architecture      | Diagramas e arquitetura             |
| Roadmap           | Planejamento evolutivo              |
| Specs             | Especificações das funcionalidades  |
| ADR               | Registro das decisões arquiteturais |
| docs/product      | Documentos estratégicos do produto  |
| Sessions          | Registro de sessões                 |
| Design            | Documentos de design                |
| Onion Cycles      | Ciclos de desenvolvimento Onion     |
| Sprint 2 Report   | Relatório de fechamento da Sprint 2 |

---

# Roadmap

## Foundation

- Estrutura do projeto
- Documentação
- Arquitetura

## MVP

- Agendamento público
- Painel administrativo
- Google Calendar
- Google Meet
- Distribuição automática entre sessões

## Futuras Evoluções

- Lista de espera
- Reagendamento
- Dashboard
- Estatísticas
- Notificações
- Integrações adicionais

---

# Como executar

A documentação técnica para configuração do ambiente será disponibilizada após a conclusão da fase de especificação do projeto.

---

# Licença

Projeto de uso interno da Pulse Mais.

Todos os direitos reservados.
