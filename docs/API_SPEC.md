# API Specification - Wolf Squadron v2.0

## Base URL
```
Desenvolvimento: http://localhost:3000/api/v1
Produção:        https://api.wolf-squadron.com/api/v1
```

## Formato Padrão
- **Content-Type:** `application/json`
- **Encoding:** UTF-8
- **Data:** ISO 8601
- **Erros:** `{ "error": true, "message": "descrição", "code": "ERROR_CODE" }`

---

## Endpoints

### Health

#### GET /health
Verificar disponibilidade da API.

**Response (200):**
```json
{
    "status": "ok",
    "version": "1.0.0",
    "timestamp": "2026-06-15T10:30:00.000Z",
    "uptime": 3600
}
```

---

### Pontuação

#### POST /scores
Registrar pontuação do jogador.

**Request:**
```json
{
    "playerName": "ACE_WOLF",
    "score": 45200,
    "waves": 15,
    "shipType": "phantom",
    "bossesDefeated": 2,
    "upgradesSelected": ["dano_II", "velocidade_I", "escudo"]
}
```

**Validações:**
| Campo | Tipo | Restrição |
|-------|------|-----------|
| playerName | string | 3-20 caracteres, alfanumérico |
| score | number | >= 0, <= 9999999 |
| waves | number | >= 1, <= 999 |
| shipType | string | `lightning`, `phantom`, `titan` |
| bossesDefeated | number | Opcional, >= 0 |
| upgradesSelected | string[] | Opcional, max 10 itens |

**Response (201):**
```json
{
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "rank": 4,
    "message": "Score saved successfully"
}
```

**Response (400 - Erro de validação):**
```json
{
    "error": true,
    "message": "playerName must be between 3 and 20 characters",
    "code": "VALIDATION_ERROR",
    "fields": {
        "playerName": "Must be 3-20 alphanumeric characters"
    }
}
```

---

#### GET /scores
Listar leaderboard (ranking geral).

**Query Params:**
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| limit | number | 10 | Quantidade de resultados (max 100) |
| offset | number | 0 | Paginação |

**Response (200):**
```json
{
    "scores": [
        {
            "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "playerName": "ACE_WOLF",
            "score": 125400,
            "waves": 20,
            "shipType": "lightning",
            "rank": 1,
            "createdAt": "2026-06-15T10:30:00.000Z"
        },
        {
            "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
            "playerName": "PHANTOM_X",
            "score": 98700,
            "waves": 17,
            "shipType": "phantom",
            "rank": 2,
            "createdAt": "2026-06-15T09:15:00.000Z"
        }
    ],
    "total": 820,
    "limit": 10,
    "offset": 0
}
```

---

#### GET /scores/:id
Detalhes de uma pontuação específica.

**Response (200):**
```json
{
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "playerName": "ACE_WOLF",
    "score": 125400,
    "waves": 20,
    "shipType": "lightning",
    "bossesDefeated": 3,
    "upgradesSelected": ["dano_III", "velocidade_II", "escudo_reforcado", "projetil_extra"],
    "rank": 1,
    "createdAt": "2026-06-15T10:30:00.000Z"
}
```

**Response (404):**
```json
{
    "error": true,
    "message": "Score not found",
    "code": "NOT_FOUND"
}
```

---

#### GET /scores/player/:playerName
Buscar pontuações de um jogador específico.

**Query Params:**
| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| limit | number | 5 | Quantidade de resultados (max 50) |

**Response (200):**
```json
{
    "playerName": "ACE_WOLF",
    "scores": [
        {
            "id": "a1b2c3d4-...",
            "score": 125400,
            "waves": 20,
            "shipType": "lightning",
            "createdAt": "2026-06-15T10:30:00.000Z"
        }
    ],
    "total": 15,
    "bestScore": 125400
}
```

---

### Leaderboard

#### GET /leaderboard/top/:limit
Top jogadores do ranking (versão simplificada).

**Response (200):**
```json
[
    {
        "rank": 1,
        "playerName": "ACE_WOLF",
        "score": 125400
    },
    {
        "rank": 2,
        "playerName": "PHANTOM_X",
        "score": 98700
    },
    {
        "rank": 3,
        "playerName": "NEO_DRIVER",
        "score": 87200
    }
]
```

---

### Jogadores (futuro)

#### POST /players
Registrar novo jogador.

**Request:**
```json
{
    "username": "ace_wolf",
    "email": "ace@wolf.com",
    "password": "securePass123"
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "username": "ace_wolf",
    "token": "jwt_token_aqui",
    "message": "Player registered successfully"
}
```

#### POST /players/login
Autenticar jogador.

**Request:**
```json
{
    "email": "ace@wolf.com",
    "password": "securePass123"
}
```

**Response (200):**
```json
{
    "token": "jwt_token_aqui",
    "player": {
        "id": "uuid",
        "username": "ace_wolf"
    }
}
```

---

### Estatísticas

#### GET /stats
Estatísticas gerais do jogo.

**Response (200):**
```json
{
    "totalPlayers": 150,
    "totalScores": 820,
    "totalWavesPlayed": 12450,
    "averageScore": 32450,
    "highestScore": 125400,
    "mostPlayedShip": "phantom",
    "topPlayer": "ACE_WOLF"
}
```

---

## Códigos de Erro
| Código | HTTP | Descrição |
|--------|------|-----------|
| VALIDATION_ERROR | 400 | Dados inválidos na requisição |
| NOT_FOUND | 404 | Recurso não encontrado |
| RATE_LIMITED | 429 | Muitas requisições |
| INTERNAL_ERROR | 500 | Erro interno do servidor |
| UNAUTHORIZED | 401 | Token inválido/expirado (futuro) |

## Rate Limiting
- **Limite:** 100 requisições por minuto por IP
- **Headers de resposta:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
