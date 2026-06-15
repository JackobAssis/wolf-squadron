import wavesData from './waves.json'

export class WaveSystem {
  constructor() {
    this.data = wavesData
    this.currentPhase = 0
    this.currentWave = 0
    this.waveActive = false
    this.phaseComplete = false
    this.allComplete = false

    this.spawnQueue = []
    this.spawnTimer = 0
    this.totalSpawned = 0
    this.totalInWave = 0
    this.waveDelay = 0
    this.inWaveDelay = false

    this.bossActive = false
    this.bossSpawned = false
    this.miniBossSpawned = false
    this.miniBossActive = false

    this.difficultyMultiplier = 1
    this.consecutiveWaves = 0
  }

  get currentPhaseData() {
    return this.data.fases[this.currentPhase]
  }

  get currentWaveData() {
    const phase = this.currentPhaseData
    if (!phase || this.currentWave >= phase.waves.length) return null
    return phase.waves[this.currentWave]
  }

  get isBossFight() {
    return this.currentPhaseData?.bossFight && this.bossActive
  }

  get isComplete() {
    return this.allComplete
  }

  reset() {
    this.currentPhase = 0
    this.currentWave = 0
    this.waveActive = false
    this.phaseComplete = false
    this.allComplete = false
    this.spawnQueue = []
    this.spawnTimer = 0
    this.totalSpawned = 0
    this.totalInWave = 0
    this.waveDelay = 0
    this.inWaveDelay = false
    this.bossActive = false
    this.bossSpawned = false
    this.miniBossSpawned = false
    this.miniBossActive = false
    this.difficultyMultiplier = 1
    this.consecutiveWaves = 0
  }

  startNextWave() {
    const wave = this.currentWaveData
    if (!wave) {
      this.currentWave = 0
      this.currentPhase++
      if (this.currentPhase >= this.data.fases.length) {
        this.allComplete = true
        return false
      }
      return this.startNextWave()
    }

    this.waveActive = true
    this.waveDelay = wave.spawnDelay || 1
    this.inWaveDelay = true
    this.spawnQueue = []
    this.totalSpawned = 0
    this.totalInWave = 0

    for (const group of wave.enemies) {
      for (let i = 0; i < (group.count || 1); i++) {
        this.spawnQueue.push({
          type: group.type,
          id: group.id,
          spawnPattern: group.spawnPattern || 'line',
          delay: (group.interval || 0.5) * i,
        })
        this.totalInWave++
      }
    }

    this.spawnTimer = 0
    this.consecutiveWaves++
    this.difficultyMultiplier = 1 + (this.consecutiveWaves - 1) * 0.1
    return true
  }

  update(dt, _gameWidth, _gameHeight) {
    if (!this.waveActive || this.allComplete) return null

    const spawns = []

    if (this.inWaveDelay) {
      this.waveDelay -= dt
      if (this.waveDelay <= 0) {
        this.inWaveDelay = false
        this.spawnTimer = 0
      }
      return spawns
    }

    this.spawnTimer -= dt
    if (this.spawnTimer <= 0 && this.totalSpawned < this.totalInWave) {
      const nextSpawn = this.spawnQueue[this.totalSpawned]
      if (nextSpawn) {
        if (nextSpawn.type === 'boss') {
          this.bossSpawned = true
          this.bossActive = true
        } else {
          spawns.push({
            type: nextSpawn.type,
            pattern: nextSpawn.spawnPattern,
            difficultyMultiplier: this.difficultyMultiplier,
          })
        }
        this.totalSpawned++
        this.spawnTimer = 0.3
      }
    }

    return spawns
  }

  get isWaveCleared() {
    return this.totalSpawned >= this.totalInWave
  }

  get isUpgradeWave() {
    const upgradeWaves = this.data.difficultyScaling?.upgradeWaves || [3, 6, 9, 12]
    return upgradeWaves.includes(this.consecutiveWaves)
  }

  advanceWave() {
    this.waveActive = false
    this.currentWave++
  }

  getBonusScore() {
    const basePerWave = 50
    return basePerWave * this.consecutiveWaves
  }
}
