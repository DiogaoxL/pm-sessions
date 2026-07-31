# Task 01: Proteção de Rotas e Middleware Administrativo

[← Voltar para RC](README.md) | [Próxima Task →](task-02.md)

---

# Objetivo

Garantir que apenas usuários autenticados com permissão de administrador possam acessar as rotas do painel administrativo (`/admin/*`), bloqueando acessos não autorizados de candidatos e visitantes.

# Escopo

- **Middleware de Proteção**:
  - Adicionar ou estender o Middleware do Next.js para interceptar acessos ao path `/admin/*`.
  - Validar a sessão do usuário e verificar o campo `role` (deve ser `admin`) associado ao usuário autenticado.
- **Redirecionamento**:
  - Redirecionar usuários não autenticados para a página de Login.
  - Redirecionar usuários autenticados sem permissão de `admin` para a página inicial pública ou exibir uma tela de erro de acesso negado (403 Forbidden).

# Dependências

- Nenhuma dependência direta desta RC (depende apenas do bootstrap de auth).

## Observabilidade

Durante a implementação deverá existir alguma forma de validar visualmente o comportamento.

Pode ser:

- Console
- Network
- URL
- Banco
- Logs

Não é permitido implementar comportamento invisível.

# Critérios de Aceite

- [ ] Acessar `/admin` ou qualquer sub-rota sem login redireciona para `/login`.
- [ ] Acessar `/admin` logado com uma conta cuja role NÃO seja `admin` resulta em erro 403 ou redirecionamento seguro para a home pública.
- [ ] Acessar `/admin` logado com conta com a role `admin` renderiza a página de administração sem bloqueios.
- [ ] Testes unitários validam as regras de filtragem do middleware.
- [ ]Usuários autenticados não sofrem redirecionamento em loop (evitar redirect infinito)
