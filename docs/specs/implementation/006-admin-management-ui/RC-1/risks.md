# Riscos Identificados — Feature 006

| Risco                            | Impacto | Mitigação Recomendada                                                                                                                 |
| :------------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Spam de Cliques Duplicados**   | Médio   | Desabilitar os botões de ação e exibir spinners visuais de loading utilizando `isPending` das transições do React.                    |
| **Ações destrutivas acidentais** | Alto    | Exigir confirmação via Diálogo Modal explícito contendo botão vermelho antes de enviar exclusões para o servidor (Task 03 e Task 05). |
| **Erros silenciosos de rede**    | Médio   | Capturar todas as falhas de Server Actions e exibir as mensagens amigáveis em Toasts vermelhos de aviso na interface.                 |
