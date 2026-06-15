# Database Schema - Wolf Squadron v2.0

## Tecnologia
- **Banco:** PostgreSQL 15+
- **ORM:** Prisma 5+
- **Ferramenta:** Prisma Migrate

## Estrutura

### scores
Registro de pontuações dos jogadores.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | UUID | PK, default uuid() | Identificador único |
| player_name | VARCHAR(50) | NOT NULL | Nome do jogador |
| score | INTEGER | NOT NULL, >= 0 | Pontuação final |
| waves | INTEGER | NOT NULL, >= 1 | Número de ondas vencidas |
| ship_type | VARCHAR(20) | NOT NULL | Tipo de nave (`lightning`, `phantom`, `titan`) |
| bosses_defeated | INTEGER | DEFAULT 0 | Chefes derrotados na run |
| upgrades_selected | JSONB | DEFAULT '[]' | Lista de upgrades escolhidos |
| created_at | TIMESTAMPTZ | NOT NULL, default now() | Data da pontuação |

**Índices:**
| Coluna | Tipo | Finalidade |
|--------|------|------------|
| score | DESC | Leaderboard (ranking) |
| created_at | DESC | Histórico recente |
| player_name | Hash | Busca por jogador |

### players (futuro)
Cadastro de jogadores para autenticação.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | UUID | PK, default uuid() | Identificador único |
| username | VARCHAR(30) | UNIQUE, NOT NULL | Nome de usuário |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Email |
| password_hash | VARCHAR(255) | NOT NULL | Hash (bcrypt) da senha |
| created_at | TIMESTAMPTZ | NOT NULL, default now() | Data de cadastro |
| last_login | TIMESTAMPTZ | - | Último login |

**Índices:**
| Coluna | Tipo | Finalidade |
|--------|------|------------|
| email | UNIQUE | Login único |
| username | UNIQUE | Nome único |

### upgrades (futuro)
Catálogo de upgrades disponíveis.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | VARCHAR(30) | PK | Identificador (ex: `dano_I`, `escudo`) |
| name | VARCHAR(50) | NOT NULL | Nome exibido na UI |
| tier | INTEGER | NOT NULL, 1-4 | Tier do upgrade |
| description | TEXT | NOT NULL | Descrição do efeito |
| effect_type | VARCHAR(20) | NOT NULL | `damage`, `speed`, `fire_rate`, `shield`, `projectile` |
| effect_value | DECIMAL(5,2) | NOT NULL | Valor do efeito (percentual ou absoluto) |
| prerequisites | JSONB | DEFAULT '[]' | Lista de IDs de upgrades necessários |

### run_stats (futuro)
Estatísticas agregadas por jogador.

| Coluna | Tipo | Restrições | Descrição |
|--------|------|------------|-----------|
| id | UUID | PK | Identificador único |
| player_id | UUID | FK → players.id | Referência ao jogador |
| total_runs | INTEGER | DEFAULT 0 | Total de partidas |
| best_score | INTEGER | DEFAULT 0 | Melhor pontuação |
| total_kills | INTEGER | DEFAULT 0 | Total de inimigos destruídos |
| total_waves | INTEGER | DEFAULT 0 | Total de ondas vencidas |
| updated_at | TIMESTAMPTZ | default now() | Última atualização |

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Score {
  id               String   @id @default(uuid())
  playerName       String   @map("player_name")
  score            Int
  waves            Int
  shipType         String   @map("ship_type")
  bossesDefeated   Int      @default(0) @map("bosses_defeated")
  upgradesSelected Json     @default("[]") @map("upgrades_selected")
  createdAt        DateTime @default(now()) @map("created_at")

  @@index([score(sort: Desc)])
  @@index([createdAt(sort: Desc)])
  @@index([playerName])
  @@map("scores")
}

model Player {
  id           String   @id @default(uuid())
  username     String   @unique
  email        String   @unique
  passwordHash String   @map("password_hash")
  createdAt    DateTime @default(now()) @map("created_at")
  lastLogin    DateTime? @map("last_login")

  @@map("players")
}

model Upgrade {
  id            String   @id
  name          String
  tier          Int
  description   String
  effectType    String   @map("effect_type")
  effectValue   Float    @map("effect_value")
  prerequisites Json     @default("[]")

  @@map("upgrades")
}

model RunStats {
  id         String   @id @default(uuid())
  playerId   String   @unique @map("player_id")
  player     Player   @relation(fields: [playerId], references: [id])
  totalRuns  Int      @default(0) @map("total_runs")
  bestScore  Int      @default(0) @map("best_score")
  totalKills Int      @default(0) @map("total_kills")
  totalWaves Int      @default(0) @map("total_waves")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@map("run_stats")
}
```

## Diagrama ER (texto)
```
┌──────────┐       ┌──────────┐
│  Player  │       │  Score   │
├──────────┤       ├──────────┤
│ id (PK)  │──┐    │ id (PK)  │
│ username │  │    │ player   │── (relação futura)
│ email    │  │    │ score    │
│ password │  │    │ waves    │
│ created  │  │    │ ship     │
└──────────┘  │    │ bosses   │
              │    │ upgrades │
              │    │ created  │
              │    └──────────┘
              │
              │    ┌──────────┐       ┌──────────┐
              │    │ RunStats │       │ Upgrade  │
              └────├──────────┤       ├──────────┤
                   │ id (PK)  │       │ id (PK)  │
                   │ playerId │       │ name     │
                   │ totalRun │       │ tier     │
                   │ bestScore│       │ effect   │
                   │ totalKills│      │ preReqs  │
                   └──────────┘       └──────────┘
```
