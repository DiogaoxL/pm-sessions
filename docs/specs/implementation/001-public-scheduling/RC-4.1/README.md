# RC-4.1 — Integração da Interface e Homologação Visual

[← Voltar para Feature](../README.md) | [Dashboard](../dashboard.md) | [Decisões](../decisions.md) | [Progresso](../progress.md)

---

## Objetivo

Este Release Candidate (RC-4.1) existe exclusivamente para integrar a interface e os componentes desenvolvidos no RC-4 ao App Router do Next.js, criando uma rota navegável e testável. Além disso, serão implementadas as melhorias de UX e Acessibilidade (a11y) apontadas durante as auditorias finais do RC-4, concluindo a homologação visual completa da funcionalidade de agendamento público.

---

## Escopo

### O que entra:

- **Integração no App Router**: Criação da rota `/scheduling` com a página correspondente integrada ao App Router.
- **UX & Acessibilidade (a11y)**:
  - Associação de erros de campo com inputs via `aria-describedby` e `aria-invalid` no `SchedulingForm`.
  - Adição de `role="alert"` em banners de erros dinâmicos no formulário e no container.
  - Adição de `autoComplete` nos inputs do formulário.
  - Correção do banner de erro global redundante quando houver apenas erros inline de validação.
- **Feedback Visual de Sucesso**: Criação de um estado de sucesso visual (uma tela/mensagem de confirmação) exibido dentro do fluxo de agendamento quando o callback `onSuccess` for disparado.
- **Smoke Test & Homologação**: Validação manual visual de todos os estados (Loading, Empty, Error, Validation, Business Errors, Pending, Success).
- **Sincronização de Documentos**: Sincronização documental nos arquivos `progress.md`, `changelog.md`, `dashboard.md`, `timeline.md` e `decisions.md`.

### O que NÃO entra:

- Novas regras de negócio na camada de serviço ou persistência.
- Alterações na infraestrutura ou esquemas do banco de dados (exceto consumo).
- Telas de administração (escopo da feature admin).

---

## Dependências

- **RC-4** concluído e homologado.

---

## Tasks

- [x] [Task 01: Criar Rota e Página de Agendamento Público](task-01.md)
- [x] [Task 02: Resolver Acessibilidade (a11y) e UX no Form e Banners](task-02.md)
- [x] [Task 03: Implementar Feedback Visual de Sucesso](task-03.md)
- [x] [Task 04: Smoke Test e Sincronização de Documentação](task-04.md)

---

## Critérios de Conclusão

- [x] Existe a página `apps/web/src/app/scheduling/page.tsx` integrada ao App Router.
- [x] A rota `/scheduling` abre corretamente no navegador sem erro 404 ou erros de runtime JS.
- [x] Inputs possuem `aria-describedby`, `aria-invalid` e `autoComplete` corretos.
- [x] Banners de erro dinâmicos possuem `role="alert"`.
- [x] Erros de validação Zod não exibem o banner global redundante "Dados inválidos".
- [x] O fluxo de sucesso exibe uma confirmação visual amigável com os detalhes do agendamento.
- [x] Smoke Test executado com sucesso e todos os estados validados visualmente.
- [x] Toda a documentação atualizada com a conclusão do RC-4.1.

---

## Riscos

- **Timezone offset**: Risco de inconsistências na exibição de datas/horários da página devido a timezone do cliente. Mitigado pelo uso das helpers do `TimeSlotList`.
- **Estilos css desajustados**: Adaptação da largura e padding dos componentes na página. Mitigado pelo uso do container responsivo do Tailwind.

---

## Próximos RCs

- [RC-5](../RC-5/README.md) (caso seja planejado)
