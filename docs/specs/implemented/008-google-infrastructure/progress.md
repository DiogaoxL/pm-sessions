# Histórico de Atividades & Progresso — RC-008

## Logs de Atividades

- **2026-07-24**: Criação da documentação de visão de negócio da RC-008 concluída. Infraestrutura e dependências mapeadas.
- **Próximo Passo**: Aguardar aprovação do plano de negócio pelo USER para iniciar a criação das tasks operacionais de implementação.

## Progresso Geral: 0%

### GCP Project & APIs

- [ ] Criar projeto isolado no Google Cloud Console (`PM Sessions Prod`)
- [ ] Ativar a Google Calendar API
- [ ] Ativar a Google Meet API

### OAuth Consent Screen

- [ ] Configurar Tela de Consentimento no GCP
- [ ] Declarar escopos (`calendar`, `calendar.events`)
- [ ] Adicionar e-mails de teste autorizados (se modo Sandbox)

### OAuth Credentials (Web App Client)

- [ ] Criar ID do cliente OAuth 2.0
- [ ] Configurar URIs de redirecionamento autorizados para Produção e Localhost
- [ ] Copiar Client ID e Client Secret gerados

### Refresh Token Acquisition

- [ ] Disparar fluxo OAuth administrativo local com `access_type: 'offline'`
- [ ] Conceder permissões e gerar `GOOGLE_REFRESH_TOKEN` de longa duração
- [ ] Validar expiração automática do token e fluxo de renovação

### Vercel Integration

- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Executar deploy/re-deploy produtivo
- [ ] Limpar logs de teste de desenvolvimento locais

### Homologação & Smoke Tests

- [ ] Testar agendamento real e criação de evento
- [ ] Validar links do Google Meet gerados automaticamente
- [ ] Validar sincronização de horários ocupados via FreeBusy no calendário
- [ ] Testes de concorrência com calendário ativo
