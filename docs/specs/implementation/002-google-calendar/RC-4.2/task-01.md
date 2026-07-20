# Task-01: Infraestrutura e Validação do OAuth/Cliente da API do Google

[← Voltar para RC](README.md) | [Próxima Task →](task-02.md)

---

# Objetivo

Configurar a infraestrutura básica do SDK do Google Calendar e validar a autenticação/permissões locais.

# Contexto

Esta tarefa prepara a base técnica de comunicação da nossa aplicação com os servidores do Google. Envolve o carregamento seguro de variáveis de ambiente de chaves da API e a inicialização de um cliente unificado de chamada.

# Dependências

Nenhuma.

# Arquivos que serão criados

- **Criar**: `apps/web/src/features/scheduling/services/google-calendar.service.ts`

# Arquivos que serão alterados

Nenhum.

# Arquivos proibidos de alteração

- Qualquer arquivo do banco de dados (migrações).

# Ordem de Implementação

1. **Configuração de Variáveis de Ambiente**:
   - Mapear variáveis `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `GOOGLE_REFRESH_TOKEN` no `.env.local`.
2. **Setup do SDK do Google**:
   - Em `google-calendar.service.ts`, configurar o cliente OAuth2 a partir do módulo `google-auth-library` ou `googleapis`.
   - Inicializar a instância de serviço do calendário (`google.calendar`).
3. **Teste Unitário de Validação**:
   - Criar arquivo `google-calendar.service.test.ts` e certificar-se de que o cliente inicializa corretamente se as chaves estiverem presentes.

# Checklist Técnico

- [ ] Mapear variáveis de ambiente do Google no escopo global.
- [ ] Inicializar cliente OAuth2 no construtor do serviço.
- [ ] Criar testes unitários mockando o carregamento de credenciais.

# Critérios de Aceite

- [ ] O SDK inicializa sem erros de runtime na ausência de chaves de teste.
- [ ] Teste unitário de inicialização passando verde.

# Como Testar

1. Executar `npx vitest run google-calendar.service.test.ts`.

# Rollback

- Remover arquivos criados via Git.

# Riscos

- **Credenciais inválidas**: Testado em nível unitário mockando as respostas da API de validação do OAuth.

# Definition of Done

- [ ] Compila sem erros de tipagem.
- [ ] Lint estático aprovado.
- [ ] Teste básico passando.
