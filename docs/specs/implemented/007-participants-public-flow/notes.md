# Notas Gerais — RC-1.0

- **WAI-ARIA**: Utilizar os atributos `aria-invalid` nos inputs caso ocorra erro de validação e vincular ao respectivo ID da mensagem de erro com `aria-describedby`.
- **Validação de UI**: Recomenda-se realizar testes responsivos emulando resoluções de telas móveis do iOS/Android para garantir que a tela de sucesso renderize sem quebras de layout.
- **Tratamento de Estado**: Certifique-se de que a lista de horários disponíveis seja revalidada no Next.js chamando `router.refresh()` na conclusão com sucesso ou ao falhar por `SESSION_FULL`.
