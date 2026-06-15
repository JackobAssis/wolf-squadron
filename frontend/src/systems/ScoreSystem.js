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
      id: crypto.randomUUID(),
      playerName,
      score: this.score,
      waves,
      shipType,
      bossesDefeated,
      upgradesSelected,
      maxCombo: this.maxCombo,
      createdAt: new Date().toISOString(),
    }

    const scores = this.getScores()
    scores.push(entry)
    scores.sort((a, b) => b.score - a.score)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, 100)))
    } catch { }
    return entry
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
    return scores.findIndex(s => s.score < newScore) + 1 || scores.length + 1
  }
}
