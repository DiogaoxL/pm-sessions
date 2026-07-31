# Task 03: Parametrização e Sincronização em Produção (Vercel Env Setup)

# Objetivo

Integrar as credenciais nas variáveis de ambiente criptografadas do projeto de produção da Vercel e homologar a sincronização dinâmica do agendamento de ponta a ponta com a geração de videoconferências no Meet.

# Escopo

- **Vercel Settings**:
  - Injetar `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` e `GOOGLE_CALENDAR_ID` nas Secrets do painel da Vercel.
  - Executar o re-deploy da aplicação de produção na Vercel.
- **Homologação E2E**:
  - Validar se a tela administrativa mostra os badges de integração verdes.
  - Validar se novas inscrições criam eventos e links de videoconferência do Meet na agenda do host de produção.
  - Validar se novos eventos bloqueados na agenda do host se refletem na tela pública em até 3 segundos.

# Dependências

- Task 02.

# Critérios de Aceite

- [ ] Variáveis inseridas e criptografadas na Vercel.
- [ ] Re-deploy executado sem quebras de build.
- [ ] Inscrições de teste gerando salas de Meet e eventos de Calendar de produção funcionais.

# Critérios de Homologação

1. Realizar inscrição na rota `/scheduling` de produção e validar a recepção dos convites no e-mail.
2. Clicar no link do Google Meet gerado no evento e testar o acesso à sala de conferência.
3. Bloquear uma faixa de horário no calendário do host e verificar o desaparecimento automático do slot no agendamento em até 3 segundos.

# Evidências Esperadas

- Variáveis de ambiente configuradas na Vercel.
- Deploy de produção ativo.
- Eventos de teste criados no Google Calendar de produção.

# Observações

Esta task encerra a validação e homologação da infraestrutura em produção.
