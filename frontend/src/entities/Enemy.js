const ENEMY_CONFIGS = {
  scout: {
    hp: 20, speed: 100, collisionDamage: 10, score: 100, radius: 10,
    behavior: 'linear', fireRate: 0,
  },
  hunter: {
    hp: 35, speed: 80, collisionDamage: 15, score: 200, radius: 12,
    behavior: 'chase', fireRate: 0,
  },
  kamikaze: {
    hp: 10, speed: 200, collisionDamage: 30, score: 150, radius: 8,
    behavior: 'rush', fireRate: 0,
  },
  turret: {
    hp: 40, speed: 30, collisionDamage: 5, score: 250, radius: 14,
    behavior: 'stationary', fireRate: 2.0,
  },
  elite: {
    hp: 80, speed: 60, collisionDamage: 20, score: 500, radius: 16,
    behavior: 'zigzag', fireRate: 1.5,
  },
  miniboss: {
    hp: 200, speed: 50, collisionDamage: 25, score: 1000, radius: 22,
    behavior: 'miniboss', fireRate: 2.5,
  },
}

export class Enemy {
  constructor(type, difficultyMultiplier = 1) {
    const cfg = ENEMY_CONFIGS[type]
    this.type = type
    this.maxHp = Math.round(cfg.hp * difficultyMultiplier)
    this.hp = this.maxHp
    this.speed = cfg.speed * (1 + (difficultyMultiplier - 1) * 0.5)
    this.collisionDamage = cfg.collisionDamage
    this.score = cfg.score
    this.radius = cfg.radius
    this.baseFireRate = cfg.fireRate
    this.behavior = cfg.behavior
    this.x = 0
    this.y = 0
    this.alive = true
    this.time = 0
    this.fireTimer = cfg.fireRate > 0 ? Math.random() * cfg.fireRate : 0
    this.readyToFire = false
    this.zigPhase = 0
    this.damageFlash = 0
  }

  spawn(gameWidth) {
    if (this.behavior === 'stationary') {
      this.x = gameWidth - 60
      this.y = 100 + Math.random() * (400 - 100)
    } else {
      this.x = gameWidth + this.radius * 2
      this.y = 50 + Math.random() * 300
    }
    this.hp = this.maxHp
    this.alive = true
    this.time = 0
    this.readyToFire = false
    this.fireTimer = this.baseFireRate > 0 ? Math.random() * this.baseFireRate : 0
    return this
  }

  update(dt, player, gameWidth, gameHeight) {
    if (!this.alive) return
    this.time += dt
    if (this.damageFlash > 0) this.damageFlash -= dt

    switch (this.behavior) {
      case 'linear':
        this.x -= this.speed * dt
        this.y += Math.sin(this.time * 3) * 60 * dt
        break
      case 'chase': {
        const targetY = player.y
        const diffY = targetY - this.y
        this.x -= this.speed * 0.7 * dt
        this.y += Math.sign(diffY) * Math.min(Math.abs(diffY), this.speed * dt)
        break
      }
      case 'rush': {
        const dx = player.x - this.x
        const dy = player.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 0) {
          this.x += (dx / dist) * this.speed * 1.5 * dt
          this.y += (dy / dist) * this.speed * 1.5 * dt
        }
        break
      }
      case 'stationary':
        this.x += Math.sin(this.time * 1.5) * 20 * dt
        break
      case 'zigzag': {
        this.zigPhase += dt * 2
        this.x -= this.speed * 0.6 * dt
        this.y += Math.sin(this.zigPhase) * 120 * dt
        break
      }
      case 'miniboss': {
        this.zigPhase += dt * 1.2
        this.x -= this.speed * 0.4 * dt
        this.y += Math.sin(this.zigPhase) * 80 * dt
        break
      }
    }

    this.x = Math.max(this.radius, Math.min(gameWidth + 50, this.x))
    this.y = Math.max(this.radius, Math.min(gameHeight - this.radius, this.y))

    if (this.baseFireRate > 0) {
      this.fireTimer -= dt
      if (this.fireTimer <= 0) {
        this.fireTimer = this.baseFireRate * (0.7 + Math.random() * 0.6)
        this.readyToFire = true
      }
    }

    if (this.x < -this.radius * 2) {
      this.alive = false
    }
  }

  takeDamage(amount) {
    this.hp -= amount
    this.damageFlash = 0.1
    if (this.hp <= 0) {
      this.hp = 0
      this.alive = false
      return true
    }
    return false
  }

  render(ctx) {
    if (!this.alive) return
    const e = this
    const flash = e.damageFlash > 0

    ctx.fillStyle = flash ? '#ffffff' : '#ff3344'
    switch (e.type) {
      case 'scout':
        ctx.fillRect(e.x - 8, e.y - 6, 16, 12)
        ctx.fillStyle = flash ? '#ffffff' : '#ff0000'
        ctx.fillRect(e.x - 2, e.y - 2, 4, 4)
        break
      case 'hunter':
        ctx.beginPath()
        ctx.moveTo(e.x + 10, e.y)
        ctx.lineTo(e.x - 8, e.y - 8)
        ctx.lineTo(e.x - 8, e.y + 8)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = flash ? '#ffffff' : '#ff0000'
        ctx.fillRect(e.x - 4, e.y - 2, 4, 4)
        break
      case 'kamikaze':
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = flash ? '#ffffff' : '#ffaa00'
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.radius * 0.4, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'turret':
        ctx.fillRect(e.x - 10, e.y - 8, 20, 16)
        ctx.fillStyle = flash ? '#ffffff' : '#cc2222'
        ctx.fillRect(e.x - 2, e.y - 12, 4, 8)
        ctx.fillStyle = flash ? '#ffffff' : '#ff0000'
        ctx.beginPath()
        ctx.arc(e.x, e.y, 4, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'elite':
        ctx.beginPath()
        ctx.moveTo(e.x + 14, e.y)
        ctx.lineTo(e.x - 8, e.y - 12)
        ctx.lineTo(e.x - 12, e.y)
        ctx.lineTo(e.x - 8, e.y + 12)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = flash ? '#ffffff' : '#cc2222'
        ctx.fillRect(e.x - 4, e.y - 2, 8, 4)
        break
      case 'miniboss':
        ctx.fillRect(e.x - 16, e.y - 14, 32, 28)
        ctx.fillStyle = flash ? '#ffffff' : '#cc2222'
        ctx.fillRect(e.x - 12, e.y - 18, 24, 8)
        ctx.fillStyle = flash ? '#ffffff' : '#ff0000'
        ctx.beginPath()
        ctx.arc(e.x - 5, e.y, 4, 0, Math.PI * 2)
        ctx.arc(e.x + 5, e.y, 4, 0, Math.PI * 2)
        ctx.fill()
        break
    }

    if (e.hp < e.maxHp) {
      const barW = 20
      const ratio = e.hp / e.maxHp
      ctx.fillStyle = '#0d2b1d'
      ctx.fillRect(e.x - barW / 2, e.y - this.radius - 8, barW, 3)
      ctx.fillStyle = '#ff3344'
      ctx.fillRect(e.x - barW / 2, e.y - this.radius - 8, barW * ratio, 3)
    }
  }

  fireAtPlayer(player) {
    if (!this.readyToFire) return null
    this.readyToFire = false
    const dx = player.x - this.x
    const dy = player.y - this.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    return {
      x: this.x,
      y: this.y + 8,
      vx: dx / dist,
      vy: dy / dist,
      speed: 250,
      damage: 12,
      radius: 4,
    }
  }

  fireEliteBurst(player) {
    if (!this.readyToFire || this.type !== 'elite') return []
    this.readyToFire = false
    const bullets = []
    for (let i = -1; i <= 1; i++) {
      const angle = Math.atan2(player.y - this.y, player.x - this.x) + i * 0.2
      bullets.push({
        x: this.x,
        y: this.y,
        vx: Math.cos(angle),
        vy: Math.sin(angle),
        speed: 220,
        damage: 15,
        radius: 4,
      })
    }
    return bullets
  }

  fireMinibossPattern(player) {
    if (!this.readyToFire) return []
    this.readyToFire = false
    if (this.time % 4 < 2) {
      const dx = player.x - this.x
      const dy = player.y - this.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      return [{
        x: this.x, y: this.y,
        vx: dx / dist, vy: dy / dist,
        speed: 200, damage: 18, radius: 5,
      }]
    } else {
      const bullets = []
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i
        bullets.push({
          x: this.x, y: this.y,
          vx: Math.cos(angle), vy: Math.sin(angle),
          speed: 180, damage: 15, radius: 4,
        })
      }
      return bullets
    }
  }
}

export function spawnEnemy(type, gameWidth, difficultyMultiplier) {
  return new Enemy(type, difficultyMultiplier).spawn(gameWidth)
}
