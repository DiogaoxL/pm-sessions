# Padrões de Código (Coding Standards)

[← Voltar para Playbook](README.md)

---

Diretrizes de formatação, nomenclatura e boas práticas para escrita de código no PM Sessions:

## 1. Nomenclatura e Organização de Arquivos

- **Componentes**: PascalCase (ex: `CalendarGrid.tsx`).
- **Arquivos e Pastas de utilitários/hooks**: kebab-case (ex: `use-scheduling.ts`, `appointment.validator.ts`).
- **Exports**: Preferir exports nomeados a default exports (exceto para páginas do App Router).

## 2. Tipagem TypeScript

- Tipagem explícita e obrigatória para parâmetros de funções, retornos e estados.
- Evitar o uso de `any`. Em caso de tipos dinâmicos, utilizar `unknown` ou generics `<T>`.
- Consumir a tipagem `Database` do Supabase para garantir sincronia estática com as colunas do PostgreSQL.

## 3. Tratamento de Erros e Fluxo Assíncrono

- Uso obrigatório de blocos `try/catch` em Server Actions e Services.
- Erros em Server Actions devem ser capturados e mapeados para os códigos padronizados do _Error Catalog_ da respectiva feature.
- Preferir `async/await` a promises encadeadas (`.then()`).

## 4. Validação de Dados

- Toda entrada de formulário recebida no servidor por Server Actions ou Route Handlers deve passar por validação Zod antes de qualquer chamada a repositórios ou APIs.
