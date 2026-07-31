# Release Candidate 008 — Google Infrastructure Integration

Este diretório contém a documentação operacional e de visão de negócio para a estruturação, validação e configuração da infraestrutura Google Workspace (Google Calendar, Google Meet e fluxos OAuth) em ambiente real de produção do PM Sessions.

## Índice da Release Candidate

- [Overview & Arquitetura](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/008-google-infrastructure/overview.md)
- [Linha do Tempo & Ordem Recomendada](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/008-google-infrastructure/timeline.md)
- [Painel de Controle de Progresso](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/008-google-infrastructure/progress.md)
- [Decisões Arquiteturais de Infraestrutura](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/008-google-infrastructure/decisions.md)
- [Matriz de Riscos & Mitigações](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/008-google-infrastructure/risks.md)
- [Notas Técnicas & Referências](file:///c:/Users/edumo/OneDrive/Documentos/Projetos/pm-sessions/docs/specs/implementation/008-google-infrastructure/notes.md)

---

## Objetivo da RC-008

Garantir que a integração do PM Sessions com os serviços do Google Calendar e Google Meet funcione de ponta a ponta em ambiente real (produção) com alta resiliência, segurança e tratamento de falhas.

A RC-008 foca exclusivamente na **configuração da infraestrutura Google Cloud, OAuth institucional, parametrização de variáveis de ambiente e homologação de sincronização**, sem alterar lógica ou regras de negócio do código-fonte.

---

## Fora de Escopo

Esta RC **não** contempla:

- Alteração ou desenvolvimento de novas regras de negócio no código-fonte.
- Modificações de layout de telas, formulários ou componentes React.
- Criação de novas tabelas ou migrações de banco de dados no Supabase.
- Exportação de relatórios em CSV.

---

## Infraestrutura Governance & Compliance

A homologação da infraestrutura de produção exige a validação dos seguintes itens de conformidade:

- [ ] Projeto Google Cloud configurado sob a organização correta.
- [ ] Escopos mínimos de permissão OAuth configurados (Princípio do Menor Privilégio).
- [ ] Tela de consentimento configurada no modo externo ou interno (conforme a organização).
- [ ] Token de acesso do Google em modo offline configurado para longa duração.
- [ ] Secrets da Vercel criptografados e parametrizados.
- [ ] Agenda do Host compartilhada e configurada com acesso de gravação.
- [ ] Google Meet integrado e habilitado para todos os eventos criados via API.
