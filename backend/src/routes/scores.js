import { Router } from 'express'
import { store } from '../store.js'

export const scoreRoutes = Router()

function validateScore(body) {
  const errors = {}
  if (!body.playerName || typeof body.playerName !== 'string') {
    errors.playerName = 'playerName is required and must be a string'
  } else if (body.playerName.length < 3 || body.playerName.length > 20) {
    errors.playerName = 'playerName must be between 3 and 20 characters'
  } else if (!/^[a-zA-Z0-9_]+$/.test(body.playerName)) {
    errors.playerName = 'playerName must be alphanumeric'
  }

  if (body.score === undefined || typeof body.score !== 'number') {
    errors.score = 'score is required and must be a number'
  } else if (body.score < 0 || body.score > 9999999) {
    errors.score = 'score must be between 0 and 9999999'
  }

  if (body.waves === undefined || typeof body.waves !== 'number') {
    errors.waves = 'waves is required and must be a number'
  } else if (body.waves < 1 || body.waves > 999) {
    errors.waves = 'waves must be between 1 and 999'
  }

  const validShips = ['lightning', 'phantom', 'titan']
  if (!body.shipType || !validShips.includes(body.shipType)) {
    errors.shipType = `shipType must be one of: ${validShips.join(', ')}`
  }

  if (body.bossesDefeated !== undefined && (typeof body.bossesDefeated !== 'number' || body.bossesDefeated < 0)) {
    errors.bossesDefeated = 'bossesDefeated must be a positive number'
  }

  return Object.keys(errors).length > 0 ? errors : null
}

scoreRoutes.post('/scores', (req, res) => {
  const errors = validateScore(req.body)
  if (errors) {
    return res.status(400).json({
      error: true,
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
      fields: errors,
    })
  }

  try {
    const score = store.createScore(req.body)
    const rank = store.getRank(score.score)
    res.status(201).json({ id: score.id, rank, message: 'Score saved successfully' })
  } catch (err) {
    console.error('Error saving score:', err)
    res.status(500).json({ error: true, message: 'Failed to save score', code: 'INTERNAL_ERROR' })
  }
})

scoreRoutes.get('/scores', (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 100)
    const offset = parseInt(req.query.offset) || 0
    const scores = store.getScores({ limit, offset })
    const total = store.count()

    const ranked = scores.map((s, i) => ({
      id: s.id,
      playerName: s.playerName,
      score: s.score,
      waves: s.waves,
      shipType: s.shipType,
      rank: offset + i + 1,
      createdAt: s.createdAt,
    }))

    res.json({ scores: ranked, total, limit, offset })
  } catch (err) {
    console.error('Error fetching scores:', err)
    res.status(500).json({ error: true, message: 'Failed to fetch scores', code: 'INTERNAL_ERROR' })
  }
})

scoreRoutes.get('/scores/:id', (req, res) => {
  try {
    const score = store.getScoreById(req.params.id)
    if (!score) {
      return res.status(404).json({ error: true, message: 'Score not found', code: 'NOT_FOUND' })
    }
    const rank = store.getRank(score.score)
    res.json({ ...score, rank })
  } catch (err) {
    console.error('Error fetching score:', err)
    res.status(500).json({ error: true, message: 'Failed to fetch score', code: 'INTERNAL_ERROR' })
  }
})

scoreRoutes.get('/scores/player/:playerName', (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 5, 50)
    const result = store.getPlayerScores(req.params.playerName, limit)
    res.json({ playerName: req.params.playerName, ...result })
  } catch (err) {
    console.error('Error fetching player scores:', err)
    res.status(500).json({ error: true, message: 'Failed to fetch player scores', code: 'INTERNAL_ERROR' })
  }
})

scoreRoutes.get('/leaderboard/top/:limit', (req, res) => {
  try {
    const limit = Math.min(parseInt(req.params.limit) || 10, 100)
    res.json(store.getTopPlayers(limit))
  } catch (err) {
    console.error('Error fetching leaderboard:', err)
    res.status(500).json({ error: true, message: 'Failed to fetch leaderboard', code: 'INTERNAL_ERROR' })
  }
})
