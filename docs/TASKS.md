# Tasks - Wolf Squadron v2.0

> Backlog técnico organizado em 8 sprints.

---

## Sprint 1 - Setup e Fundação (3 dias)
**Objetivo:** Base do projeto rodando no navegador.

- [ ] Configurar Vite + projeto frontend
- [ ] HTML/CSS base com Canvas em tela cheia
- [ ] main.js com game loop (requestAnimationFrame + deltaTime)
- [ ] Implementar SceneManager (transições entre cenas)
- [ ] Implementar sistema de input (teclado: setas/WASD + espaço)
- [ ] Implementar sistema de input touch (joystick virtual)
- [ ] Configurar ESLint básico

## Sprint 2 - Entidades Core (4 dias)
**Objetivo:** Jogador navegando e atirando, inimigos básicos.

- [ ] Implementar Player.js (movimento 8 direções, HP 100, invulnerabilidade 1s)
- [ ] Implementar Bullet.js (object pooling, tipos: Laser, Plasma, Spread)
- [ ] Implementar Enemy.js - Drone Scout (movimento linear, HP 20)
- [ ] Implementar Enemy.js - Drone Hunter (persegue Y do jogador, HP 35)
- [ ] Implementar Enemy.js - Kamikaze (rush em direção ao jogador, HP 10)
- [ ] Implementar CollisionSystem.js (AABB, detecção projétil × inimigo)
- [ ] Implementar sistema de disparo da nave (automático ao segurar espaço)

## Sprint 3 - Progressão e Chefes (4 dias)
**Objetivo:** Ondas completas e chefe funcional.

- [ ] Implementar Enemy.js - Turret Drone (parado, dispara projéteis, HP 40)
- [ ] Implementar Enemy.js - Elite Drone (zigzag + perseguição, HP 80)
- [ ] Implementar Boss.js - Core Alpha (3 fases: tiros → mísseis → rajadas)
- [ ] Implementar sistema de dano e morte (partículas de destruição)
- [ ] Implementar WaveSystem.js (leitura de waves.json, spawn sequencial)
- [ ] Implementar ondas de mini-chefes (a cada 5 ondas)
- [ ] Testar progressão completa de 3 fases com 5 ondas cada

## Sprint 4 - Upgrades e Pontuação (3 dias)
**Objetivo:** Sistema de progressão entre ondas.

- [ ] Implementar UpgradeSystem.js (árvore 4 tiers: 4 ramos)
- [ ] Implementar lógica de pré-requisitos entre tiers
- [ ] Implementar ScoreSystem.js (pontuação por inimigo + combo)
- [ ] Implementar sistema de bônus por sobrevivência (50 × onda)
- [ ] Implementar tela de upgrades (UI no Canvas, 4 opções por vez)
- [ ] Salvar upgrades em localStorage (persistência entre sessões)

## Sprint 5 - UI e Experiência (4 dias)
**Objetivo:** Telas completas e fluxo de navegação.

- [ ] Implementar Menu principal (botões: Nova Missão, Ranking, Créditos)
- [ ] Implementar tela de seleção de nave (3 naves: Lightning, Phantom, Titan)
- [ ] Implementar HUD (HP, shield, score, wave atual, arma equipada)
- [ ] Implementar tela de game over (score, ondas, boss derrotado)
- [ ] Implementar tela de ranking local (mock offline)
- [ ] Implementar transições animadas entre cenas (fade in/out)
- [ ] Implementar tela de créditos

## Sprint 6 - Backend (4 dias)
**Objetivo:** API REST funcional com banco de dados.

- [ ] Inicializar Node.js + Express + Prisma
- [ ] Configurar PostgreSQL (Docker ou Railway)
- [ ] Criar schema Prisma (model Score)
- [ ] Implementar POST /api/v1/scores (validação + persistência)
- [ ] Implementar GET /api/v1/scores (leaderboard paginado)
- [ ] Implementar GET /api/v1/scores/:id (detalhes)
- [ ] Implementar GET /api/v1/leaderboard/top/:limit
- [ ] Implementar GET /api/v1/health (health check)
- [ ] Implementar GET /api/v1/stats (total jogadores + scores)
- [ ] Adicionar rate limiting e CORS

## Sprint 7 - Integração e PWA (3 dias)
**Objetivo:** Jogo completo online + pronto para mobile.

- [ ] Conectar frontend à API (fetch para scores e leaderboard)
- [ ] Implementar tela de ranking online (dados reais da API)
- [ ] Criar Service Worker (cache de assets estáticos)
- [ ] Criar manifest.json + ícones PWA (192px, 512px)
- [ ] Testar responsividade (desktop 1920×1080, tablet 1024×768, mobile 375×667)
- [ ] Ajustar joystick virtual para touch (feedback visual)
- [ ] Implementar lazy loading de assets (sprites e áudio)

## Sprint 8 - Polimento Final (3 dias)
**Objetivo:** MVP estável, bonito e deployado.

- [ ] Criar sprites finais (nave, 5 inimigos, boss, projéteis, fundos)
- [ ] Implementar efeitos visuais (partículas de explosão, trail de projéteis)
- [ ] Implementar efeitos sonoros (Web Audio API: tiros, explosões, hits)
- [ ] Balancear dificuldade (HP, dano, spawn rates)
- [ ] Testar performance (manter 60 FPS desktop, 30 FPS mobile)
- [ ] Testar fluxo completo (Menu → Gameplay → Upgrade → Boss → Score)
- [ ] Deploy frontend (Cloudflare Pages)
- [ ] Deploy backend (Railway com PostgreSQL)
- [ ] Testes finais cross-browser (Chrome, Firefox, Safari mobile)
- [ ] Criar GitHub Actions para CI (lint + build)

---

## Critérios de Conclusão do MVP
- [ ] Jogo funcional com início, meio e fim
- [ ] 3 fases com 5 ondas cada + boss final
- [ ] 5 tipos de inimigo + 1 chefe com 3 fases
- [ ] Árvore de upgrades com 4 tiers
- [ ] Ranking online com persistência
- [ ] PWA instalável (Service Worker + manifest)
- [ ] Responsivo (desktop, tablet, mobile)
- [ ] Deploy público (frontend + backend)

## Legendas
- `[ ]` = Não iniciado
- `[~]` = Em andamento
- `[x]` = Concluído
