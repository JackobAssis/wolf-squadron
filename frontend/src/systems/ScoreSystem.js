import { api } from './ApiClient.js'

const STORAGE_KEY = 'wolf_squadron_scores'

export class ScoreSystem {
  constructor() {
    this.score = 0
    this.combo = 0
    this.maxCombo = 0
    this.comboTimer = 0
    this.comboWindow = 2.0
    this.hitsSinceLastMiss = 0
  }

  addKill(baseScore) {
    this.hitsSinceLastMiss++
    this.combo++
    if (this.combo > this.maxCombo) this.maxCombo = this.combo
    this.comboTimer = this.comboWindow

    const multiplier = Math.min(1 + this.combo * 0.05, 1.5)
    const points = Math.round(baseScore * multiplier)
    this.score += points
    return { points, multiplier, combo: this.combo }
  }

  addBonus(points) {
    this.score += points
  }

  update(dt) {
    if (this.comboTimer > 0) {
      this.comboTimer -= dt
      if (this.comboTimer <= 0) {
        this.combo = 0
      }
    }
  }

  reset() {
    this.score = 0
    this.combo = 0
    this.maxCombo = 0
    this.comboTimer = 0
    this.hitsSinceLastMiss = 0
  }

  get multiplier() {
    return Math.min(1 + this.combo * 0.05, 1.5)
  }

  saveScore(playerName, waves, shipType, bossesDefeated, upgradesSelected) {
    const entry = {
      id: crypto.randomUUID?.() || Date.now().toString(36),
      playerName,
      score: this.score,
      waves,
      shipType,
      bossesDefeated,
      upgradesSelected,
      maxCombo: this.maxCombo,
      createdAt: new Date().toISOString(),
    }

    this._saveLocal(entry)
    this._saveApi(entry)
    return entry
  }

  _saveLocal(entry) {
    try {
      const scores = this.getScores()
      scores.push(entry)
      scores.sort((a, b) => b.score - a.score)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, 100)))
    } catch { }
  }

  async _saveApi(entry) {
    try {
      await api.submitScore({
        playerName: entry.playerName,
        score: entry.score,
        waves: entry.waves,
        shipType: entry.shipType,
        bossesDefeated: entry.bossesDefeated,
        upgradesSelected: entry.upgradesSelected,
      })
    } catch { }
  }

  getScores() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  }

  getRank(newScore) {
    const scores = this.getScores()
    const pos = scores.findIndex(s => s.score < newScore)
    return pos === -1 ? scores.length + 1 : pos + 1
  }
}
