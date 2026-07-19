# Estratégia de Testes (Testing Strategy)

[← Voltar para Playbook](README.md)

---

Garantir a integridade da aplicação através de uma pirâmide de testes bem estruturada.

## 1. Tipos de Testes

### Testes Unitários (Unit Tests):

- Focados em lógica de domínio isolada (ex: validações Zod, algoritmos de alocação de hosts, tratamentos de data/horário).
- Não interagem com banco ou APIs de terceiros. Utilizam mocks rápidos.

### Testes de Integração (Integration Tests):

- Validação física de interações entre repositórios e Supabase PostgreSQL local.
- Simulação de erros na chamada do Google Calendar para atestar o funcionamento do rollback atômico.

### Testes E2E (End-to-End):

- Simulam a navegação do candidato no frontend escolhendo um horário e preenchendo o formulário de reserva pública.

## 2. Cobertura de Testes e Dados

- **Cobertura Mínima**: 90% para a camada de serviços e lógica de negócio.
- **Fixtures**: Dados estáticos e consistentes armazenados em arquivos de teste dedicados para evitar geração de lixo no banco durante a execução das suítes de testes.
