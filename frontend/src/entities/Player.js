export const SHIP_TYPES = {
  lightning: { speed: 240, hp: 80, weapon: 'laser', label: 'Lightning' },
  phantom: { speed: 200, hp: 100, weapon: 'plasma', label: 'Phantom' },
  titan: { speed: 160, hp: 130, weapon: 'spread', label: 'Titan' },
}

export class Player {
  constructor(shipType = 'phantom') {
    const config = SHIP_TYPES[shipType]
    this.shipType = shipType
    this.x = 0
    this.y = 0
    this.speed = config.speed
    this.maxHp = config.hp
    this.hp = config.hp
    this.weapon = config.weapon
    this.invulnerable = 0
    this.invulnDuration = 1
    this.radius = 10
    this.width = 28
    this.height = 28
    this.alive = true
    this.damageMultiplier = 1
    this.fireRateMultiplier = 1
    this.extraProjectiles = 0
  }

  reset(x, y) {
    this.x = x
    this.y = y
    this.hp = this.maxHp
    this.invulnerable = 0
    this.alive = true
    this.damageMultiplier = 1
    this.fireRateMultiplier = 1
    this.extraProjectiles = 0
  }

  update(dt, input, gameWidth, gameHeight) {
    if (!this.alive) return

    if (this.invulnerable > 0) {
      this.invulnerable -= dt
    }

    const dx = input.horizontal
    const dy = input.vertical
    if (dx !== 0 || dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy)
      this.x += (dx / len) * this.speed * dt
      this.y += (dy / len) * this.speed * dt
    }

    this.x = Math.max(this.radius, Math.min(gameWidth - this.radius, this.x))
    this.y = Math.max(this.radius, Math.min(gameHeight - this.radius, this.y))
  }

  takeDamage(amount) {
    if (this.invulnerable > 0 || !this.alive) return false
    this.hp -= amount
    this.invulnerable = this.invulnDuration
    if (this.hp <= 0) {
      this.hp = 0
      this.alive = false
    }
    return true
  }

  get fireRate() {
    const base = { laser: 0.2, plasma: 0.6, spread: 0.4 }
    return (base[this.weapon] || 0.2) / this.fireRateMultiplier
  }

  get projectileCount() {
    return 1 + this.extraProjectiles
  }

  get projectileDamage() {
    const base = { laser: 10, plasma: 25, spread: 6 }
    return (base[this.weapon] || 10) * this.damageMultiplier
  }

  render(ctx) {
    if (!this.alive) return
    if (this.invulnerable > 0 && Math.floor(this.invulnerable * 10) % 2 === 0) return

    const p = this
    ctx.fillStyle = '#00ff41'
    ctx.beginPath()
    ctx.moveTo(p.x, p.y - 18)
    ctx.lineTo(p.x - 14, p.y + 10)
    ctx.lineTo(p.x - 5, p.y + 6)
    ctx.lineTo(p.x, p.y + 14)
    ctx.lineTo(p.x + 5, p.y + 6)
    ctx.lineTo(p.x + 14, p.y + 10)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#0d2b1d'
    ctx.beginPath()
    ctx.arc(p.x, p.y - 4, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}
