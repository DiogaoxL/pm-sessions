# 005 — Authentication

> Especificação da autenticação administrativa do PM Sessions.

---

# Status

🟢 Approved

---

# Objetivo

Permitir que administradores acessem o painel do PM Sessions utilizando autenticação via Google OAuth, garantindo acesso seguro às funcionalidades administrativas e às integrações com o Google Calendar.

---

# Contexto

Todos os administradores do sistema utilizam contas Google institucionais ou pessoais.

Como a aplicação depende diretamente da Google Calendar API, utilizar Google OAuth elimina a necessidade de gerenciamento próprio de usuários e senhas.

---

# Escopo

Esta Specification contempla:

- Login com Google;
- Logout;
- Persistência de sessão;
- Controle de acesso ao painel administrativo;
- Concessão de permissões para Google Calendar.

---

# Fora do Escopo

Esta Specification não contempla:

- Cadastro de usuários;
- Recuperação de senha;
- Login por e-mail e senha;
- Controle avançado de perfis;
- Multi-organização.

---

# Fluxo do Usuário

```text
Acessar Painel

↓

Entrar com Google

↓

Conceder permissões

↓

Autenticação concluída

↓

Acessar Dashboard
```

---

# Fluxo Técnico

```text
Google OAuth

↓

Receber Tokens

↓

Validar Sessão

↓

Persistir Sessão

↓

Liberar Painel
```

---

# Regras de Negócio

## RN-001

O acesso administrativo será realizado exclusivamente via Google OAuth.

---

## RN-002

A autenticação deverá solicitar apenas as permissões necessárias para funcionamento da aplicação.

---

## RN-003

Usuários não autenticados não poderão acessar rotas administrativas.

---

## RN-004

A sessão deverá permanecer ativa até logout ou expiração do token.

---

## RN-005

As permissões concedidas serão utilizadas para gerenciamento do Google Calendar do administrador autenticado.

---

## RN-006

O logout deverá invalidar a sessão local da aplicação.

---

## RN-007

A autenticação via Google não garante acesso administrativo.

Após a autenticação, o sistema deverá verificar se o e-mail autenticado pertence à lista de administradores autorizados.

Caso contrário, o acesso ao painel deverá ser negado.

---

# Critérios de Aceite

- [ ] Login funcionando.
- [ ] Apenas administradores autorizados acessam o painel.
- [ ] Logout funcionando.
- [ ] Sessão persistida.
- [ ] Rotas protegidas.
- [ ] Integração com Google Calendar autorizada.

---

# Plano de Implementação

(Plano padronizado da Specification)

---

# Checklist Técnico

- [ ] Configurar Google OAuth.
- [ ] Configurar NextAuth/Auth.js.
- [ ] Persistir sessão.
- [ ] Middleware de proteção.
- [ ] Logout.
- [ ] Tratamento de erros.

---

# Dependências

- 000-bootstrap

---

# Contrato de Negócio

## Entrada

Solicitação de autenticação via Google.

## Saída

Administrador autenticado e autorizado para acessar o painel e utilizar o Google Calendar.

---

# Riscos

- Revogação das permissões pelo usuário.
- Expiração de tokens.
- Indisponibilidade do Google OAuth.

---

# Testes Esperados

## Cenário 1

Login com conta Google válida.

Resultado esperado:

Acesso concedido.

---

## Cenário 2

Usuário não autenticado acessa rota administrativa.

Resultado esperado:

Redirecionamento para login.

---

## Cenário 3

Logout.

Resultado esperado:

Sessão encerrada.

---

## Cenário 4

Permissão do Google Calendar revogada.

Resultado esperado:

Usuário informado e solicitado a reconectar a conta.

---

## Cenário 5

Usuário autenticado com Google, porém sem autorização.

Resultado esperado:

Acesso negado.

---

# Observações Técnicas

A autenticação será implementada utilizando Auth.js (NextAuth) integrado ao Google OAuth.

A aplicação não armazenará senhas nem realizará autenticação própria.

Toda a gestão de identidade será delegada ao Google.

---

# Definition of Done

A Specification será considerada concluída quando:

- autenticação implementada;
- rotas protegidas;
- integração com Google Calendar validada;
- testes aprovados;
- documentação atualizada;
- revisão técnica concluída.
