# Task 02: Criar Instanciação do Service via Factory

[← Voltar para RC](README.md) | [← Task Anterior](task-01.md) | [Próxima Task ➔](task-03.md) | [Decisões](../../decisions.md) | [Riscos](../../risks.md)

---

# Objetivo

Criar uma função factory (ex. `createSchedulingService`) que centraliza a instanciação do `SchedulingService` injetando todos os repositórios necessários inicializados com o cliente do Supabase adequado.

---

# Contexto

A factory evita duplicação de lógica de instanciação de dependências (`TimeSlotRepository`, `SessionRepository`, `ParticipantRepository`) em múltiplas Server Actions, garantindo consistência no uso do cliente de Supabase do lado do servidor (Server Context).

---

# Dependências

- [Task 01](task-01.md)

---

# Arquivos que serão alterados

- **Criar**: `apps/web/src/features/scheduling/actions/factory.ts`

---

# Arquivos que NÃO podem ser alterados

Nenhum.

---

# Ordem de Implementação

1. Criar o arquivo `factory.ts` no diretório `actions/`.
2. Importar o `createServerClient` do shared library (`@/shared/lib/supabase/server`).
3. Importar a classe `SchedulingService`, e os repositórios concretos (`TimeSlotRepository`, `SessionRepository`, `ParticipantRepository`).
4. Definir a função `getSchedulingService(): Promise<SchedulingService>` (ou `createSchedulingService`).
5. Dentro da função:
   - Chamar `await createServerClient()`.
   - Instanciar cada repositório passando o cliente do Supabase criado.
   - Instanciar e retornar a classe `SchedulingService` passando as instâncias dos repositórios via construtor.

---

# Checklist Técnico

- [ ] Criar arquivo `factory.ts`.
- [ ] Obter o cliente do Supabase do contexto do servidor de forma assíncrona.
- [ ] Instanciar os repositórios de dados.
- [ ] Instanciar o `SchedulingService` usando Dependency Injection.
- [ ] Exportar a factory de forma limpa.

---

# Critérios de Aceite

- O typecheck da aplicação finaliza com sucesso.
- O serviço e os repositórios são instanciados corretamente usando o cliente assíncrono de banco de dados do servidor do Next.js.

---

# Como Testar

Verificar a compilação do TypeScript no monorepo:

```bash
pnpm --filter web typecheck
```

---

# Rollback

Excluir o arquivo `factory.ts`.

---

# Riscos

- Vazamento de contexto ou problemas de concorrência se o cliente de Supabase for instanciado de forma estática e global (mitigado instanciando-o de forma dinâmica a cada chamada da factory).

---

# Definition of Done

A factory para criação do `SchedulingService` está pronta e compilando corretamente.

---

# Commits sugeridos

- `feat(scheduling): implement SchedulingService factory for server actions`

---

# Observações

Nenhuma.
