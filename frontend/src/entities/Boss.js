export class Boss {
  constructor() {
    this.x = 0
    this.y = 0
    this.maxHp = 500
    this.hp = 500
    this.phase = 1
    this.alive = false
    this.active = false
    this.radius = 30
    this.score = 5000
    this.entering = false
    this.enterTimer = 0
    this.fireTimer = 0
    this.phaseTransitionTimer = 0
    this.invulnerable = false
    this.time = 0
    this.damageFlash = 0
  }

  spawn(gameWidth, gameHeight) {
    this.x = gameWidth + 50
    this.y = gameHeight / 2
    this.hp = this.maxHp
    this.phase = 1
    this.alive = true
    this.active = false
    this.entering = true
    this.enterTimer = 2
    this.fireTimer = 1.5
    this.phaseTransitionTimer = 0
    this.invulnerable = true
    this.time = 0
    return this
  }

  update(dt, player, gameWidth, gameHeight) {
    if (!this.alive) return
    this.time += dt
    if (this.damageFlash > 0) this.damageFlash -= dt

    if (this.entering) {
      this.enterTimer -= dt
      this.x = Math.max(gameWidth - 100, this.x - 60 * dt)
      if (this.enterTimer <= 0) {
        this.entering = false
        this.active = true
        this.invulnerable = false
        this.fireTimer = 1.5
      }
      return
    }

    if (this.phaseTransitionTimer > 0) {
      this.phaseTransitionTimer -= dt
      this.invulnerable = true
      if (this.phaseTransitionTimer <= 0) {
        this.phase++
        this.invulnerable = false
        this.fireTimer = this.phase === 2 ? 2.5 : 3.0
      }
      return
    }

    const hpRatio = this.hp / this.maxHp
    if (hpRatio <= 0.3 && this.phase === 2) {
      this.phaseTransitionTimer = 1.5
      this.invulnerable = true
      return
    }
    if (hpRatio <= 0.6 && this.phase === 1) {
      this.phaseTransitionTimer = 1.5
      this.invulnerable = true
      return
    }

    this.y += Math.sin(this.time * 0.8) * 40 * dt
    this.y = Math.max(60, Math.min(gameHeight - 60, this.y))

    this.fireTimer -= dt
  }

  getAttacks(player) {
    if (!this.active || this.invulnerable || this.fireTimer > 0) return []
    this.fireTimer = this.phase === 1 ? 2.0 : this.phase === 2 ? 2.5 : 3.0
    const bullets = []

    if (this.phase === 1) {
      for (let i = 0; i < 3; i++) {
        const delay = i * 0.15
        bullets.push({
          x: this.x - 20, y: this.y,
          vx: -1, vy: 0,
          speed: 280 + delay * 100,
          damage: 12,
          radius: 5,
          delay,
        })
      }
    } else if (this.phase === 2) {
      for (let i = 0; i < 2; i++) {
        const dx = player.x - this.x
        const dy = (player.y - this.y) * 0.3
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const offX = (i === 0 ? -1 : 1) * 15
        bullets.push({
          x: this.x + offX, y: this.y,
          vx: (dx + offX * 2) / dist,
          vy: dy / dist,
          speed: 200,
          damage: 18,
          radius: 6,
        })
      }
    } else {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i
        bullets.push({
          x: this.x, y: this.y,
          vx: Math.cos(angle),
          vy: Math.sin(angle),
          speed: 180,
          damage: 15,
          radius: 5,
        })
      }
    }

    return bullets
  }

  takeDamage(amount) {
    if (this.invulnerable || !this.alive) return false
    this.hp -= amount
    this.damageFlash = 0.1
    if (this.hp <= 0) {
      this.hp = 0
      this.alive = false
      this.active = false
      return true
    }
    return false
  }

  render(ctx) {
    if (!this.alive) return
    const flash = this.damageFlash > 0

    if (this.invulnerable && this.phaseTransitionTimer > 0) {
      if (Math.floor(this.phaseTransitionTimer * 10) % 2 === 0) return
    }

    ctx.fillStyle = flash ? '#ffffff' : '#ff6600'
    ctx.fillRect(this.x - 24, this.y - 20, 48, 40)
    ctx.fillRect(this.x - 30, this.y - 6, 60, 12)

    ctx.fillStyle = flash ? '#ffffff' : (this.phase === 1 ? '#ff4444' : this.phase === 2 ? '#ff8800' : '#ff00ff')
    ctx.beginPath()
    ctx.arc(this.x - 8, this.y - 4, 6, 0, Math.PI * 2)
    ctx.arc(this.x + 8, this.y - 4, 6, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = flash ? '#ffffff' : '#00ff41'
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`CORE α-${this.phase}`, this.x, this.y - 32)

    if (this.hp < this.maxHp) {
      const barW = 80
      const ratio = this.hp / this.maxHp
      ctx.fillStyle = '#0d2b1d'
      ctx.fillRect(this.x - barW / 2, this.y - 42, barW, 4)
      ctx.fillStyle = '#ff6600'
      ctx.fillRect(this.x - barW / 2, this.y - 42, barW * ratio, 4)
    }
  }
}
