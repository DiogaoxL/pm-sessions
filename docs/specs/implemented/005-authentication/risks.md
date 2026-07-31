# Riscos Identificados — Feature 005

| Risco                                             | Impacto | Mitigação Recomendada                                                                                                                                      |
| :------------------------------------------------ | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Revogação do consentimento do Google Calendar** | Alto    | O dashboard da Task 05 detectará falhas nas chamadas à API e renderizará um banner interativo com opção de re-autenticação.                                |
| **Refresh Token Expirado/Inválido**               | Médio   | O middleware intercepta falhas de getUser() e limpa cookies locais, forçando redirecionamento com parâmetro explicativo de expiração.                      |
| **Inconsistência da tabela admins**               | Alto    | Criação de index único para `email` ou `auth_user_id` no banco local, além de validação rigorosa no middleware aceitando as roles `admin` e `super_admin`. |
