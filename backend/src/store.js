import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = resolve(__dirname, '../data.json')

let data = { scores: [] }

function load() {
  try {
    if (existsSync(DATA_FILE)) {
      data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
    }
  } catch { }
}

function save() {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch { }
}

load()

export const store = {
  createScore(entry) {
    const score = {
      id: crypto.randomUUID(),
      playerName: entry.playerName,
      score: entry.score,
      waves: entry.waves,
      shipType: entry.shipType,
      bossesDefeated: entry.bossesDefeated || 0,
      upgradesSelected: entry.upgradesSelected || [],
      createdAt: new Date().toISOString(),
    }
    data.scores.push(score)
    data.scores.sort((a, b) => b.score - a.score)
    save()
    return score
  },

  getScores({ limit = 10, offset = 0 } = {}) {
    return data.scores.slice(offset, offset + limit)
  },

  getScoreById(id) {
    return data.scores.find(s => s.id === id) || null
  },

  getPlayerScores(playerName, limit = 5) {
    const scores = data.scores.filter(s => s.playerName === playerName).sort((a, b) => b.score - a.score)
    return {
      scores: scores.slice(0, limit),
      total: scores.length,
      bestScore: scores[0]?.score || 0,
    }
  },

  getTopPlayers(limit = 10) {
    return data.scores.slice(0, limit).map((s, i) => ({
      rank: i + 1,
      playerName: s.playerName,
      score: s.score,
    }))
  },

  getStats() {
    if (data.scores.length === 0) {
      return {
        totalPlayers: 0,
        totalScores: 0,
        averageScore: 0,
        highestScore: 0,
        mostPlayedShip: 'none',
        topPlayer: 'none',
      }
    }

    const players = new Set(data.scores.map(s => s.playerName))
    const avg = data.scores.reduce((a, s) => a + s.score, 0) / data.scores.length
    const max = Math.max(...data.scores.map(s => s.score))
    const shipCounts = {}
    data.scores.forEach(s => { shipCounts[s.shipType] = (shipCounts[s.shipType] || 0) + 1 })
    const mostPlayed = Object.entries(shipCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      totalPlayers: players.size,
      totalScores: data.scores.length,
      averageScore: Math.round(avg),
      highestScore: max,
      mostPlayedShip: mostPlayed?.[0] || 'unknown',
      topPlayer: data.scores[0]?.playerName || 'none',
    }
  },

  getRank(score) {
    return data.scores.findIndex(s => s.score < score) + 1 || data.scores.length + 1
  },

  count() {
    return data.scores.length
  },
}
