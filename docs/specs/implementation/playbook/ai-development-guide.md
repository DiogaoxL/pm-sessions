# Guia de Desenvolvimento para Agentes de IA

[← Voltar para Playbook](README.md)

---

Este documento estabelece o protocolo de atuação para agentes de Inteligência Artificial operando na base de código do PM Sessions.

## 1. Fluxo de Execução de Tarefas para IA

Quando uma IA recebe uma tarefa de codificação, ela deve seguir estritamente as etapas abaixo:

1. **Leitura da Feature**: Ler a especificação do produto em `specs/approved/` correspondente.
2. **Leitura do RC & Task**: Localizar e ler o planejamento técnico do RC e o arquivo `task-XX.md` correspondente.
3. **Limitação de Escopo**: Implementar **apenas** o escopo estrito definido na tarefa ativa. É proibido adiantar código de outras tarefas ou RCs.
4. **Testes**: Executar a suíte de testes do projeto e garantir que tudo está compilando.
5. **Atualização de Progresso**: Atualizar a respectiva linha da tarefa no arquivo `progress.md` para `DONE`.
6. **Mapeamento de Changelog**: Registrar o incremento de código em `changelog.md`.
7. **Encerrar Turno**: Apresentar os resultados ao usuário sem modificações destrutivas na documentação.

## 2. Restrições do Agente de IA

### O que NUNCA fazer:

- Excluir especificações aprovadas ou documentações de histórico.
- Versionar ou expor arquivos de variáveis de ambiente (`.env`).
- Escrever código sem tipagem explícita ou contornar as validações Zod/TypeScript.
- Mesclar branches ou rodar comandos destrutivos sem aprovação do usuário.

### O que PODE modificar:

- Os arquivos identificados na seção _Arquivos que serão alterados_ da task ativa.
- Os logs de progresso, changelogs e métricas correspondentes à feature sob desenvolvimento.
