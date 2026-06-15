# Game Design Document - Wolf Squadron: Origins v2.0

## Visão Geral
Wolf Squadron: Origins é um shoot'em up (STG) lateral 2D inspirado em clássicos como Space Impact, com visual futurista e temática cyberpunk. O jogador controla uma nave da divisão Wolf Squadron e enfrenta drones, máquinas corrompidas e inteligências artificiais hostis.

## Objetivos do Projeto
- Criar um jogo web acessível
- Partidas rápidas (5 a 15 minutos)
- Simples de aprender
- Permitir futuras expansões
- Servir como projeto de portfólio full stack

## Gênero
- Shoot'em up (STG) lateral
- Arcade
- Roguelite (upgrades entre runs)

## Plataforma
- Web (HTML5 + JavaScript)
- PWA para dispositivos móveis e desktop

---

## Wireframes das Telas

### Menu Principal
```
┌─────────────────────────────────────┐
│  ██╗    ██╗ ██████╗ ██╗     ███████╗  │
│  ██║    ██║██╔═══██╗██║     ██╔════╝  │
│  ██║ █╗ ██║██║   ██║██║     █████╗    │
│  ██║███╗██║██║   ██║██║     ██╔══╝    │
│  ╚███╔███╔╝╚██████╔╝███████╗██║       │
│   ╚══╝╚══╝  ╚═════╝ ╚══════╝╚═╝       │
│                                         │
│          SQUADRON: ORIGINS              │
│                                         │
│           ╔═══════════════╗             │
│           ║  NOVA MISSÃO  ║             │
│           ╚═══════════════╝             │
│                                         │
│           ╔═══════════════╗             │
│           ║   RANKING     ║             │
│           ╚═══════════════╝             │
│                                         │
│           ╔═══════════════╗             │
│           ║   CRÉDITOS    ║             │
│           ╚═══════════════╝             │
│                                         │
│  [UPGRADES: Nenhum]      v1.0          │
└─────────────────────────────────────┘
```

### Seleção de Nave
```
┌─────────────────────────────────────┐
│         SELECIONE SUA NAVE           │
│                                         │
│   ┌──────┐    ┌──────┐    ┌──────┐   │
│   │      │    │      │    │      │   │
│   │  A-  │    │  B-  │    │  C-  │   │
│   │ WOLF │    │ WOLF │    │ WOLF │   │
│   │      │    │      │    │      │   │
│   └──────┘    └──────┘    └──────┘   │
│   LIGHTNING    PHANTOM     TITAN      │
│                                         │
│   Veloc: ████████░░  Veloc: ████░░░░  │
│   Armor: ████░░░░░░  Armor: ████████  │
│                                         │
│           ╔═══════════════╗             │
│           ║  CONFIRMAR    ║             │
│           ╚═══════════════╝             │
│                                         │
│           ╔═══════════════╗             │
│           ║   VOLTAR      ║             │
│           ╚═══════════════╝             │
└─────────────────────────────────────┘
```

### Gameplay / HUD
```
┌─────────────────────────────────────┐
│ HP ████████░░░░   SCORE: 012450     │
│ SHIELD ████░░░░   WAVE: 07/20       │
│─────────────────────────────────────│
│                                         │
│                                         │
│          ░░░░░░░░░░░░░                 │
│        ░░░  ░░░░░  ░░░░               │
│       ░░░  ░░░░░░░  ░░░               │
│          ░░░ ██░░░░                   │
│             ████                      │
│          ░░░ ██░░░░                   │
│       ░░░  ░░░░░░░  ░░░               │
│        ░░░  ░░░░░  ░░░░               │
│          ░░░░░░░░░░░░░                 │
│                                         │
│     >>>   >>>   >>>   >>>              │
│                                         │
│─────────────────────────────────────│
│ [LASER]  COMBO: x12   BOSS: ████░░  │
└─────────────────────────────────────┘
```

### Tela de Upgrades
```
┌─────────────────────────────────────┐
│         UPGRADES DISPONÍVEIS         │
│                                         │
│   ╔═══════════════════════════════╗   │
│   ║  +20% DANO          [ SELEC ] ║   │
│   ╚═══════════════════════════════╝   │
│                                         │
│   ╔═══════════════════════════════╗   │
│   ║  +15% VELOCIDADE     [ SELEC ] ║   │
│   ╚═══════════════════════════════╝   │
│                                         │
│   ╔═══════════════════════════════╗   │
│   ║  +1 PROJÉTIL          [ SELEC ] ║   │
│   ╚═══════════════════════════════╝   │
│                                         │
│   ╔═══════════════════════════════╗   │
│   ║  ESCUDO TEMPORÁRIO   [ SELEC ] ║   │
│   ╚═══════════════════════════════╝   │
│                                         │
│              PRÓXIMA ONDA               │
└─────────────────────────────────────┘
```

### Game Over
```
┌─────────────────────────────────────┐
│                                         │
│       ██████  ███    ███               │
│      ██       ████  ████               │
│      ██  ███  ██ ████ ██               │
│      ██   ██  ██  ██  ██               │
│       ██████  ██      ██               │
│                                         │
│         WOLF CAIU EM COMBATE            │
│                                         │
│   SCORE:     045.200                    │
│   WAVES:     15                         │
│   BOSS:      CORRUPTED CORE             │
│                                         │
│   ╔═══════════════════════════════╗    │
│   ║        TENTAR NOVAMENTE       ║    │
│   ╚═══════════════════════════════╝    │
│                                         │
│   ╔═══════════════════════════════╗    │
│   ║           RANKING             ║    │
│   ╚═══════════════════════════════╝    │
│                                         │
│   ╔═══════════════════════════════╗    │
│   ║           MENU                ║    │
│   ╚═══════════════════════════════╝    │
└─────────────────────────────────────┘
```

### Leaderboard / Ranking
```
┌─────────────────────────────────────┐
│           RANKING GLOBAL             │
│                                         │
│  ┌──────┬────────────┬──────────┐    │
│  │ RANK │ JOGADOR    │ PONTOS   │    │
│  ├──────┼────────────┼──────────┤    │
│  │ #01  │ ACE_WOLF   │ 125.400  │    │
│  │ #02  │ PHANTOM_X  │ 098.700  │    │
│  │ #03  │ NEO_DRIVER │ 087.200  │    │
│  │ #04  │ < VOCÊ >   │ 045.200  │    │
│  │ #05  │ CYBER_ACE  │ 042.100  │    │
│  └──────┴────────────┴──────────┘    │
│                                         │
│           ╔═══════════════╗             │
│           ║   VOLTAR      ║             │
│           ╚═══════════════╝             │
└─────────────────────────────────────┘
```

---

## Fluxo de Navegação (State Machine)

```
┌───────────┐
│   BOOT    │
└─────┬─────┘
      │
      ▼
┌───────────┐    ┌──────────────┐
│   MENU    │───▶│ SELEÇÃO NAVE │
└─────┬─────┘    └──────┬───────┘
      │                 │
      │                 ▼
      │            ┌───────────┐
      │            │ GAMEPLAY  │
      │            └─────┬─────┘
      │                  │
      │        ┌─────────┴──────────┐
      │        ▼                    ▼
      │  ┌──────────┐      ┌──────────────┐
      │  │ UPGRADES │      │  GAME OVER   │
      │  └─────┬────┘      └──────┬───────┘
      │        │                  │
      │        ▼                  ├──────────────┐
      │   ┌──────────┐           ▼              ▼
      │   │GAMEPLAY  │    ┌──────────┐   ┌──────────┐
      │   │(próx.onde│    │ RANKING  │   │   MENU   │
      │   └──────────┘    └──────────┘   └──────────┘
      │
      ├────────────────────────────────────┐
      ▼                                     ▼
┌──────────┐                        ┌──────────┐
│ RANKING  │                        │ CRÉDITOS │
└──────────┘                        └──────────┘

Transições:
- BOOT → MENU (inicialização)
- MENU → SELEÇÃO NAVE (Nova Missão)
- MENU → RANKING (Ranking)
- MENU → CRÉDITOS (Créditos)
- SELEÇÃO NAVE → GAMEPLAY (Confirmar)
- SELEÇÃO NAVE → MENU (Voltar)
- GAMEPLAY → UPGRADES (onda concluída)
- GAMEPLAY → GAME OVER (HP = 0)
- UPGRADES → GAMEPLAY (próxima onda)
- GAME OVER → RANKING (ver ranking)
- GAME OVER → MENU (voltar ao menu)
- GAME OVER → GAMEPLAY (tentar novamente)
- RANKING → MENU (voltar)
```

---

## Gameplay Loop
1. Iniciar missão
2. Sobreviver às ondas de inimigos
3. Destruir inimigos e coletar melhorias
4. Enfrentar mini-chefes
5. Avançar de fase
6. Derrotar chefe principal
7. Registrar pontuação

## Mecânicas Principais
- Nave com movimento livre em 8 direções
- Disparo automático e manual
- Ondas de inimigos com dificuldade progressiva
- Chefes no final de cada fase
- Sistema de upgrades entre fases
- Pontuação baseada em desempenho

## Controles
- **Desktop:** Teclado (setas/WASD + espaço para disparo)
- **Mobile:** Touch com joystick virtual

---

## Jogador

### Naves

| Nave | Velocidade | Armadura | Arma Inicial | Especial |
|------|-----------|----------|-------------|----------|
| A-Wolf Lightning | Alta | Baixa | Laser | Dash rápido |
| B-Wolf Phantom | Média | Média | Plasma | Invisibilidade |
| C-Wolf Titan | Baixa | Alta | Spread Shot | Barreira |

### Status Base
- **HP inicial:** 100
- **Dano:** Colisão com inimigos e projéteis inimigos
- **Invulnerabilidade:** 1 segundo após sofrer dano

---

## Armas

| Arma | Dano | Cadência | Projéteis | Descrição |
|------|------|----------|-----------|-----------|
| Laser | Médio (10) | Alta (0.2s) | 1 | Padrão, precisão |
| Plasma | Alto (25) | Baixa (0.6s) | 1 | Dano concentrado |
| Spread Shot | Baixo (6) | Média (0.4s) | 3 | Dispersão angular |
| Railgun | Muito Alto (50) | Muito Baixa (1.2s) | 1 | Atravessa inimigos |
| Pulse Ring | Médio (12) | Média (0.5s) | 1 | Dano em área circular |

---

## Inimigos - Especificação Detalhada

### Drone Scout
```
  ┌─────┐
  │ ██  │
  │ ██  │
  └─────┘
```
| Atributo | Valor |
|----------|-------|
| HP | 20 |
| Velocidade | 100 px/s |
| Dano colisão | 10 |
| Pontuação | 100 |
| Comportamento | Movimento linear horizontal, surgem em grupos de 3-5 |
| Padrão | Reto da direita para esquerda, leve senoide |
| Sprite | Drone pequeno, 1 olho LED vermelho |

### Drone Hunter
```
  ┌─────┐
  │ ██◄►│
  │ ██  │
  └─────┘
```
| Atributo | Valor |
|----------|-------|
| HP | 35 |
| Velocidade | 80 px/s |
| Dano colisão | 15 |
| Pontuação | 200 |
| Comportamento | Persegue a posição Y do jogador, velocidade moderada |
| Padrão | Movimento interpolationado suavemente em Y |
| Sprite | Drone médio, 2 olhos LED, antena |

### Kamikaze
```
  ┌─────┐
  │ ██! │
  │ ██  │
  └─────┘
```
| Atributo | Valor |
|----------|-------|
| HP | 10 |
| Velocidade | 200 px/s |
| Dano colisão | 30 |
| Pontuação | 150 |
| Comportamento | Acelera em direção ao jogador em linha reta, explode ao colidir |
| Padrão | Rush linear direto na posição do jogador, ignora outros alvos |
| Sprite | Drone pequeno, propulsores vermelhos, pisca ao acelerar |

### Turret Drone
```
  ┌─────┐
  │ ██  │
  │ ██▀▀│
  └─────┘
```
| Atributo | Valor |
|----------|-------|
| HP | 40 |
| Velocidade | 40 px/s (ou parado) |
| Dano colisão | 5 |
| Dano projétil | 12 |
| Pontuação | 250 |
| Comportamento | Posiciona-se e dispara projéteis em intervalos regulares |
| Padrão | Dispara 1 projétil a cada 2s na direção do jogador |
| Sprite | Drone médio, canhão acoplado, base fixa |

### Elite Drone
```
  ┌─────┐
  │ ██◄►│
  │ ████│
  └─────┘
```
| Atributo | Valor |
|----------|-------|
| HP | 80 |
| Velocidade | 60 px/s |
| Dano colisão | 20 |
| Dano projétil | 15 |
| Pontuação | 500 |
| Comportamento | Movimento avançado (zigzag + perseguição), dispara em salvas |
| Padrão | Alterna entre zigzag horizontal e perseguição vertical a cada 3s, dispara 3 projéteis em leque |
| Sprite | Drone grande, blindado, 4 LEDs, asas |

### Mini-Boss (aparece a cada 5 ondas)
| Atributo | Valor |
|----------|-------|
| HP | 200 |
| Velocidade | 50 px/s |
| Dano colisão | 25 |
| Dano projétil | 18 |
| Pontuação | 1000 |
| Comportamento | Dispara padrões alternados, mais lento mas resistente |
| Padrão | Alterna entre tiros frontais e rajadas a cada 4 golpes recebidos |

---

## Chefes

### Core Alpha
```
     ▄▄████▄▄
   ██        ██
  ██  ██  ██  ██
  ██  ██████  ██
   ██  ████  ██
     ▀▀████▀▀
```

| Atributo | Fase 1 | Fase 2 | Fase 3 |
|----------|--------|--------|--------|
| HP | 500 | 350 | 200 |
| Velocidade | Parado | Parado | Parado |
| Ataque | Tiros frontais (3 seguidos) | Mísseis guiados (2 simultâneos) | Rajadas circulares (8 direções) |
| Intervalo | 2s entre tiros | 3s entre mísseis | 4s entre rajadas |
| Pontos | 5000 (total) | - | - |

**Transição de fases:**
- Fase 1 → Fase 2: quando HP ≤ 60%
- Fase 2 → Fase 3: quando HP ≤ 30%
- Cada transição: animação de 1s, boss invulnerável durante troca

---

## Sistema de Upgrades - Árvore Completa

### Tier 1 (Ondas 1-3)
| Upgrade | Efeito | Custo |
|---------|--------|-------|
| Dano I | +20% dano da arma atual | Grátis (1ª escolha) |
| Velocidade I | +15% velocidade da nave | Grátis (1ª escolha) |
| Cadência I | +10% cadência de tiro | Grátis (1ª escolha) |

### Tier 2 (Ondas 4-6) - Requer 1 upgrade Tier 1
| Upgrade | Efeito | Pré-requisito |
|---------|--------|---------------|
| Dano II | +35% dano (acumulativo) | Dano I |
| Velocidade II | +25% velocidade (acumulativo) | Velocidade I |
| Cadência II | +20% cadência (acumulativo) | Cadência I |
| Projétil Extra | +1 projétil por disparo | - |

### Tier 3 (Ondas 7-9) - Requer 2 upgrades Tier 2
| Upgrade | Efeito | Pré-requisito |
|---------|--------|---------------|
| Dano III | +50% dano (acumulativo) | Dano II |
| Velocidade III | +40% velocidade (acumulativo) | Velocidade II |
| Cadência III | +35% cadência (acumulativo) | Cadência II |
| Escudo | Absorve 1 hit (recarrega a cada onda) | - |

### Tier 4 (Ondas 10+) - Requer 3 upgrades Tier 3
| Upgrade | Efeito | Pré-requisito |
|---------|--------|---------------|
| Super Dano | +75% dano + crítico (10% chance 2x) | Dano III |
| Teletransporte | Dash teleporta (invulnerável) | Velocidade III |
| Auto-Tiro | Disparo automático + overclock | Cadência III |
| Escudo Reforçado | Escudo +30 HP extra | Escudo |

### Árvore Visual
```
Tier 1              Tier 2              Tier 3              Tier 4
                    ┌────────┐
                    │ DanoII │───┐
┌────────┐    ┌────┤        │   │   ┌──────────┐       ┌────────────┐
│ Dano I │────┘    └────────┘   ├───│ Dano III │───────│ Super Dano │
└────────┘                      │   └──────────┘       └────────────┘
                                │
┌────────────┐    ┌────────┐    │   ┌──────────┐       ┌────────────┐
│ Veloc. I   │────│ Vel II │────┘───│ Vel III  │───────│ Teletransp │
└────────────┘    └────────┘        └──────────┘       └────────────┘

┌────────────┐    ┌────────┐        ┌──────────┐       ┌────────────┐
│ Cadência I │────│ Cad II │────────│ Cad III  │───────│ Auto-Tiro  │
└────────────┘    └────────┘        └──────────┘       └────────────┘

                   ┌────────┐        ┌──────────┐       ┌────────────┐
                   │ Projét │        │ Escudo   │───────│ Esc. Refor │
                   │ Extra  │        └──────────┘       └────────────┘
                   └────────┘
```

---

## Sistema de Pontuação
| Ação | Pontos |
|------|--------|
| Drone Scout | 100 |
| Drone Hunter | 200 |
| Kamikaze | 150 |
| Turret Drone | 250 |
| Elite Drone | 500 |
| Mini-chefe | 1000 |
| Chefe (Core Alpha) | 5000 |
| Bônus sobrevivência (por onda) | 50 × onda_atual |
| Combo (inimigos consecutivos sem errar) | 1.5x multiplicador no máximo |

## Direção Artística
- **Tema:** Futurista, cyberpunk, militar espacial
- **Paleta:** Preto (#0a0a0a), verde escuro (#0d2b1d), verde neon (#00ff41), branco (#e0e0e0)
- **Referência visual:** Interface tecnológica, linhas angulares, estética de laboratório futurista, HUD minimalista

## MVP
- Menu inicial
- Gameplay completo
- Sistema de ondas
- Sistema de upgrades
- Chefe final
- Ranking online
- Persistência de pontuações
