# Análise de Riscos — RC-1.0

Este documento apresenta os principais riscos operacionais identificados e suas respectivas estratégias de mitigação.

## 1. Concorrência Simultânea Extrema (Double Booking)

- **Risco**: Dois candidatos tentarem reservar a última vaga no mesmo milésimo de segundo.
- **Mitigação**: O banco de dados realiza lock transacional atômico via RPC `allocate_participant`. O frontend deve apenas capturar o erro `P0001` de forma graciosa e renderizar a tela de "Vaga Indisponível" redirecionando o candidato.

## 2. Telefone Inválido ou Mal Formatado

- **Risco**: Candidato ignorar a máscara ou burlar a validação e salvar dados vazios ou corrompidos.
- **Mitigação**: O formulário do client-side sanitizará e validará o tamanho de dígitos válidos (10 ou 11 dígitos) e o regex de e-mail impedirá submissões de dados inválidos.
