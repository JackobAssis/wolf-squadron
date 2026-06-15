# Technical Specification - Wolf Squadron v2.0

## Stack

### Frontend
| Tecnologia | Finalidade |
|------------|------------|
| HTML5 | Estrutura |
| CSS3 | Estilização |
| JavaScript (ES Modules) | Lógica do jogo |
| Canvas API | Renderização |
| Vite | Bundler + dev server |
| Service Worker | PWA / offline |

### Backend
| Tecnologia | Finalidade |
|------------|------------|
| Node.js | Runtime |
| Express | Framework HTTP |
| PostgreSQL | Banco de dados |
| Prisma ORM | Camada de dados |

### Infraestrutura
| Serviço | Finalidade |
|---------|------------|
| Cloudflare Pages | Deploy frontend |
| Railway | Deploy backend |

## Arquitetura

### Frontend
```
main.js (entry point, game loop)
├── scenes/      (SceneManager)
├── entities/    (Player, Enemy, Bullet, Boss)
├── systems/     (Collision, Wave, Upgrade, Score)
└── ui/          (HUD, menus)
```

### Game Loop
```js
function gameLoop(timestamp) {
    update(deltaTime)
    render()
    requestAnimationFrame(gameLoop)
}
```

### Padrões
- SOLID quando aplicável
- Separação de responsabilidades
- Classes para entidades
- Sistemas independentes (ECS simplificado)

## Performance
| Meta | Desktop | Mobile |
|------|---------|--------|
| FPS alvo | 60 FPS | 30 FPS |

- Object pooling para projéteis
- Spatial hashing para colisões
- Renderização otimizada com Canvas 2D
- Asset loading assíncrono

## Responsividade
- Desktop
- Tablet
- Mobile
- Canvas escalável (proporção 16:9 mantida, letterbox quando necessário)

## Segurança
- Rate limiting
- Validação de entrada
- Sanitização
- CORS configurado

## Versionamento
- **main:** produção
- **develop:** desenvolvimento
- **feature/***: novas funcionalidades

## Estrutura de Pastas
```
wolf-squadron/
├── frontend/
│   ├── assets/
│   │   ├── sprites/
│   │   ├── audio/
│   │   └── effects/
│   ├── src/
│   │   ├── entities/
│   │   ├── systems/
│   │   ├── scenes/
│   │   ├── ui/
│   │   └── main.js
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── middlewares/
│   ├── prisma/
│   └── database/
└── docs/
```

---

## Sistema de Ondas (Wave System)

### Estrutura JSON de Definição

```jsonc
// frontend/src/systems/waves.json
{
  "totalFases": 3,
  "fases": [
    {
      "id": 1,
      "name": "Zona de Patrulha",
      "bossFight": false,
      "background": "city_skyline",
      "music": "phase1_ambient",
      "waves": [
        {
          "id": "1-1",
          "enemies": [
            { "type": "scout", "count": 3, "interval": 0.8, "spawnPattern": "line" }
          ],
          "spawnDelay": 1.0,
          "clearCondition": "destroy_all"
        },
        {
          "id": "1-2",
          "enemies": [
            { "type": "scout", "count": 3, "interval": 0.6, "spawnPattern": "line" },
            { "type": "hunter", "count": 1, "interval": 1.5, "spawnPattern": "top" }
          ],
          "spawnDelay": 1.5,
          "clearCondition": "destroy_all"
        },
        {
          "id": "1-3",
          "enemies": [
            { "type": "kamikaze", "count": 4, "interval": 1.0, "spawnPattern": "rush" },
            { "type": "turret", "count": 1, "interval": 0.0, "spawnPattern": "fixed" }
          ],
          "spawnDelay": 2.0,
          "clearCondition": "destroy_all"
        },
        {
          "id": "1-4",
          "enemies": [
            { "type": "scout", "count": 5, "interval": 0.5, "spawnPattern": "line" },
            { "type": "hunter", "count": 2, "interval": 2.0, "spawnPattern": "alternating" },
            { "type": "turret", "count": 1, "interval": 0.0, "spawnPattern": "fixed" }
          ],
          "spawnDelay": 2.0,
          "clearCondition": "destroy_all"
        },
        {
          "id": "1-5",
          "enemies": [
            { "type": "elite", "count": 1, "interval": 3.0, "spawnPattern": "boss_intro" },
            { "type": "scout", "count": 2, "interval": 1.0, "spawnPattern": "flanking" }
          ],
          "spawnDelay": 2.5,
          "clearCondition": "destroy_all",
          "isMiniBoss": true
        }
      ]
    },
    {
      "id": 2,
      "name": "Complexo Industrial",
      "bossFight": false,
      "background": "factory_interior",
      "music": "phase2_industrial",
      "waves": [
        {
          "id": "2-1",
          "enemies": [
            { "type": "hunter", "count": 3, "interval": 1.2, "spawnPattern": "alternating" },
            { "type": "turret", "count": 2, "interval": 0.0, "spawnPattern": "fixed" }
          ],
          "spawnDelay": 1.0,
          "clearCondition": "destroy_all",
          "difficultyMultiplier": 1.3
        },
        {
          "id": "2-2",
          "enemies": [
            { "type": "kamikaze", "count": 6, "interval": 0.8, "spawnPattern": "rush" },
            { "type": "elite", "count": 1, "interval": 3.0, "spawnPattern": "top" }
          ],
          "spawnDelay": 1.5,
          "clearCondition": "destroy_all",
          "difficultyMultiplier": 1.3
        },
        {
          "id": "2-3",
          "enemies": [
            { "type": "scout", "count": 8, "interval": 0.4, "spawnPattern": "line" },
            { "type": "hunter", "count": 3, "interval": 1.5, "spawnPattern": "flanking" },
            { "type": "turret", "count": 2, "interval": 0.0, "spawnPattern": "fixed" }
          ],
          "spawnDelay": 2.0,
          "clearCondition": "destroy_all",
          "difficultyMultiplier": 1.4
        },
        {
          "id": "2-4",
          "enemies": [
            { "type": "elite", "count": 2, "interval": 2.5, "spawnPattern": "boss_intro" },
            { "type": "kamikaze", "count": 4, "interval": 1.0, "spawnPattern": "rush" }
          ],
          "spawnDelay": 2.0,
          "clearCondition": "destroy_all",
          "difficultyMultiplier": 1.5
        },
        {
          "id": "2-5",
          "enemies": [
            { "type": "elite", "count": 2, "interval": 2.0, "spawnPattern": "alternating" },
            { "type": "hunter", "count": 4, "interval": 1.0, "spawnPattern": "flanking" },
            { "type": "turret", "count": 1, "interval": 0.0, "spawnPattern": "fixed" }
          ],
          "spawnDelay": 2.5,
          "clearCondition": "destroy_all",
          "isMiniBoss": true,
          "difficultyMultiplier": 1.6
        }
      ]
    },
    {
      "id": 3,
      "name": "Núcleo Central",
      "bossFight": true,
      "background": "core_reactor",
      "music": "phase3_boss",
      "waves": [
        {
          "id": "3-1",
          "enemies": [
            { "type": "elite", "count": 3, "interval": 2.0, "spawnPattern": "boss_intro" },
            { "type": "turret", "count": 3, "interval": 0.0, "spawnPattern": "fixed" },
            { "type": "kamikaze", "count": 6, "interval": 0.8, "spawnPattern": "rush" }
          ],
          "spawnDelay": 1.0,
          "clearCondition": "destroy_all",
          "difficultyMultiplier": 1.8
        },
        {
          "id": "3-2",
          "enemies": [
            { "type": "elite", "count": 4, "interval": 1.5, "spawnPattern": "alternating" },
            { "type": "hunter", "count": 6, "interval": 0.8, "spawnPattern": "flanking" },
            { "type": "scout", "count": 10, "interval": 0.3, "spawnPattern": "line" }
          ],
          "spawnDelay": 1.5,
          "clearCondition": "destroy_all",
          "difficultyMultiplier": 2.0
        },
        {
          "id": "3-3",
          "enemies": [
            { "type": "boss", "id": "core_alpha" }
          ],
          "spawnDelay": 3.0,
          "clearCondition": "destroy_boss",
          "isBossWave": true
        }
      ]
    }
  ]
}
```

### Schema do Wave JSON
```typescript
interface WaveConfig {
  totalFases: number
  fases: Fase[]
}

interface Fase {
  id: number
  name: string
  bossFight: boolean
  background: string
  music: string
  waves: Wave[]
}

interface Wave {
  id: string
  enemies: EnemySpawn[]
  spawnDelay: number          // segundos antes de iniciar a onda
  clearCondition: "destroy_all" | "survive" | "destroy_boss"
  isMiniBoss?: boolean
  isBossWave?: boolean
  difficultyMultiplier?: number  // escala HP e dano dos inimigos
}

interface EnemySpawn {
  type: "scout" | "hunter" | "kamikaze" | "turret" | "elite" | "boss"
  count?: number              // para boss, não usa count
  interval: number            // segundos entre spawns
  spawnPattern: "line" | "top" | "rush" | "fixed" | "alternating" | "flanking" | "boss_intro"
  id?: string                 // usado apenas para boss
}
```

### Parâmetros de Dificuldade Progressiva
```jsonc
{
  "difficultyScaling": {
    "hpMultiplierPerWave": 0.05,       // +5% HP por onda
    "speedMultiplierPerWave": 0.03,    // +3% velocidade por onda
    "spawnRateReduction": 0.02,        // -2% intervalo entre spawns por onda
    "extraEnemiesPerWave": 0.15,       // +15% de inimigos por onda (fracionário = chance)
    "bossWaveInterval": 5,             // mini-boss a cada 5 ondas
    "upgradeWaves": [3, 6, 9, 12]     // ondas onde upgrades são oferecidos
  }
}
```

---

## Backlog Técnico - Sprints

### Sprint 1 - Setup e Fundação (3 dias)
- Configurar Vite + projeto frontend
- HTML/CSS base com Canvas
- main.js com game loop (requestAnimationFrame)
- Sistema de cenas (SceneManager)
- Sistema de input (teclado + touch mock)

### Sprint 2 - Entidades Core (4 dias)
- Player.js (movimento 8 direções, HP, invulnerabilidade)
- Bullet.js (object pooling, tipos Laser/Plasma/Spread)
- Enemy.js (Drone Scout, Hunter, Kamikaze)
- CollisionSystem.js (AABB simples)
- Sistema de disparo da nave

### Sprint 3 - Progressão e Chefes (4 dias)
- Enemy.js (Turret, Elite)
- Boss.js (Core Alpha com 3 fases)
- WaveSystem.js (leitura de JSON, spawn, clearCondition)
- Sistema de dano e morte
- Mini-chefes (a cada 5 ondas)

### Sprint 4 - Upgrades e Pontuação (3 dias)
- UpgradeSystem.js (árvore 4 tiers, persistência local)
- ScoreSystem.js (pontuação, combo, bônus)
- Tela de upgrades (UI Canvas)
- Salvamento de upgrades em localStorage

### Sprint 5 - UI e Experiência (4 dias)
- Menu principal
- Tela de game over
- HUD (HP, shield, score, wave, arma)
- Tela de ranking (offline/mock)
- Transições entre cenas (animações simples)

### Sprint 6 - Backend (4 dias)
- Node.js + Express setup
- Prisma schema + migrations
- POST /scores (validação + persistência)
- GET /scores + GET /scores/:id
- GET /leaderboard/top/:limit
- GET /health + GET /stats

### Sprint 7 - Integração e PWA (3 dias)
- Conexão frontend → backend (fetch API)
- Tela de ranking online
- Service Worker (cache assets)
- Manifest.json + ícones
- Responsividade desktop/mobile
- Joystick virtual para touch

### Sprint 8 - Polimento Final (3 dias)
- Sprites placeholder → finais
- Efeitos sonoros (Web Audio API)
- Efeitos visuais (partículas, explosões, trail)
- Balanceamento de dificuldade (testes)
- Testes cross-browser e mobile
- Deploy frontend (Cloudflare Pages)
- Deploy backend (Railway)
