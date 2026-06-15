# Regras opencode - Wolf Squadron v2.0

Você é responsável pelo desenvolvimento do projeto Wolf Squadron: Origins.

## Agentes Ativados
- frontend_agent.md
- vanilla_js_agent.md
- nodejs_agent.md
- database_agent.md
- pwa_agent.md
- automation_agent.md
- security_agent.md

## Regras Gerais
- Nunca remover funcionalidades existentes sem justificativa
- Sempre manter compatibilidade com mobile
- Sempre utilizar JavaScript moderno ES Modules
- Priorizar código simples e legível
- Evitar dependências desnecessárias

## Arquitetura
- Respeitar a estrutura de pastas definida em TECHNICAL_SPEC.md
- Manter separação entre entidades (entities/) e sistemas (systems/)
- Não criar lógica de negócio dentro da UI
- Sistemas devem ser independentes e testáveis isoladamente
- Utilizar ECS (Entity-Component-System) simplificado

## Frontend
- Código modular em ES Modules
- Canvas 2D para renderização
- Sistema de cenas (SceneManager) para transições
- Separação clara entre entities, systems, scenes e ui
- Utilizar requestAnimationFrame para o game loop
- Evitar dependências externas (exceto Vite)
- Componentizar sistemas (cada system tem responsabilidade única)
- Object pooling para projéteis e partículas
- Configurações de jogo centralizadas em arquivos JSON (ex: waves.json)

## Backend
- Express.js com rotas REST versionadas (/api/v1)
- Prisma como ORM, PostgreSQL como banco
- Validação de inputs em todas as rotas (campos obrigatórios, tipos, limites)
- Respostas JSON padronizadas com campo `error` e `message`
- Rate limiting configurado (100 req/min por IP)
- CORS configurado para origem do frontend

## Banco de Dados
- Seguir schema definido em DATABASE_SCHEMA.md
- Usar Prisma Migrate para versionamento do schema
- Nunca expor credenciais ou strings de conexão
- Índices nos campos usados em queries frequentes (score, created_at)

## Código
- Nomes em camelCase (JS/TS) e snake_case (banco)
- Funções puras onde possível (sem efeitos colaterais)
- Código comentado apenas quando a lógica não for óbvia
- Evitar duplicação (DRY)
- Ser modular e reutilizável
- Código em inglês (variáveis, funções, comentários)

## Segurança
- Validar sempre inputs do usuário (tamanho, tipo, caracteres permitidos)
- Usar JWT para autenticação futura
- Não expor dados sensíveis em logs ou respostas de erro
- Hash de senhas com bcrypt
- Sanitizar entradas para prevenir XSS e SQL Injection
- Configurar headers de segurança (Helmet)

## Qualidade
Todo código deve:
- Ser modular (um arquivo, uma responsabilidade)
- Ser reutilizável (evitar hardcoding)
- Ser legível (nomes descritivos, estrutura clara)
- Evitar duplicação

## Testes
Sempre validar:
- Responsividade (desktop, tablet, mobile)
- Erros de execução (console limpo)
- Performance (60 FPS desktop, 30 FPS mobile)
- Compatibilidade mobile (touch events, viewport)
- Fluxo completo do jogo (Menu → Gameplay → Upgrades → Boss → Score)

## Workflow
1. Verificar quais arquivos/documentos existem antes de criar novos
2. Explicar o plano antes de implementar
3. Implementar incrementalmente (uma funcionalidade por vez)
4. Explicar o que foi criado após implementar
5. Testar manualmente no navegador após cada funcionalidade
6. Refinar continuamente com base nos testes
7. Seguir a ordem das sprints definida em TASKS.md

## Arquivos de Configuração
- waves.json: definição de ondas e inimigos
- upgrades.json: definição de upgrades disponíveis (se extraído do código)
- .env: variáveis de ambiente (nunca commitar)

## Objetivo Final
Entregar um MVP completo, jogável, estável e pronto para deploy, seguindo o backlog de sprints em TASKS.md.
