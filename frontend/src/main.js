import { SceneManager, Scene } from './scenes/SceneManager.js'
import { InputSystem } from './systems/InputSystem.js'
import { ShipSelectScene } from './scenes/ShipSelectScene.js'
import { RankingScene } from './scenes/RankingScene.js'
import { CreditsScene } from './scenes/CreditsScene.js'
import { Player } from './entities/Player.js'
import { BulletPool } from './entities/Bullet.js'
import { spawnEnemy } from './entities/Enemy.js'
import { Boss } from './entities/Boss.js'
import { CollisionSystem } from './systems/CollisionSystem.js'
import { WaveSystem } from './systems/WaveSystem.js'
import { ParticleSystem } from './systems/ParticleSystem.js'
import { UpgradeSystem } from './systems/UpgradeSystem.js'
import { ScoreSystem } from './systems/ScoreSystem.js'

const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

const GAME_WIDTH = 480
const GAME_HEIGHT = 720

const input = new InputSystem(canvas, GAME_WIDTH, GAME_HEIGHT)
const sceneManager = new SceneManager()
sceneManager.setInput(input)
sceneManager.gameWidth = GAME_WIDTH
sceneManager.gameHeight = GAME_HEIGHT

function resize() {
  const ratio = GAME_WIDTH / GAME_HEIGHT
  let w = window.innerWidth
  let h = window.innerHeight
  if (w / h > ratio) { w = h * ratio } else { h = w / ratio }
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  canvas.width = GAME_WIDTH
  canvas.height = GAME_HEIGHT
}

window.addEventListener('resize', resize)
resize()

class BootScene extends Scene {
  enter() { this.timer = 0.5 }
  update() {
    this.timer -= 0.016
    if (this.timer <= 0) this.manager.switchTo('menu')
  }
  render(ctx, gw, gh) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, gw, gh)
    ctx.fillStyle = '#00ff41'
    ctx.font = '16px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('INITIALIZING SYSTEM...', gw / 2, gh / 2)
    ctx.fillText('WOLF SQUADRON', gw / 2, gh / 2 + 30)
  }
}

class MenuScene extends Scene {
  enter() {
    this.selectedOption = 0
    this.options = ['NOVA MISSÃO', 'RANKING', 'CRÉDITOS']
    this.particles = new ParticleSystem(50)
  }
  update(input) {
    if (input.justPressed('ArrowDown') || input.justPressed('KeyS')) {
      this.selectedOption = (this.selectedOption + 1) % this.options.length
    }
    if (input.justPressed('ArrowUp') || input.justPressed('KeyW')) {
      this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length
    }
    if (input.justPressed('Enter') || input.justPressed('Space')) {
      switch (this.selectedOption) {
        case 0: this.manager.switchTo('shipSelect'); break
        case 1: this.manager.switchTo('ranking'); break
        case 2: this.manager.switchTo('credits'); break
      }
    }
    this.particles.update(0.016)
  }
  render(ctx, gw, gh) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, gw, gh)

    this.particles.render(ctx)

    ctx.fillStyle = '#00ff41'
    ctx.font = 'bold 28px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('WOLF SQUADRON', gw / 2, 120)
    ctx.font = '14px monospace'
    ctx.fillStyle = '#0d2b1d'
    ctx.fillText('ORIGINS', gw / 2, 145)

    const startY = 280
    const spacing = 50
    for (let i = 0; i < this.options.length; i++) {
      const y = startY + i * spacing
      if (i === this.selectedOption) {
        ctx.fillStyle = '#00ff41'
        ctx.fillText(`> ${this.options[i]} <`, gw / 2, y)
      } else {
        ctx.fillStyle = '#0d2b1d'
        ctx.fillText(this.options[i], gw / 2, y)
      }
    }

    ctx.fillStyle = '#0d2b1d'
    ctx.font = '10px monospace'
    ctx.fillText('↑↓ navegar | ENTER selecionar', gw / 2, gh - 60)
    ctx.fillText('ESPAÇO para disparar em jogo', gw / 2, gh - 45)
  }
}

class GameplayScene extends Scene {
  enter() {
    const shipType = this.manager.gameState?.shipType || 'phantom'
    this.player = new Player(shipType)
    this.player.reset(GAME_WIDTH / 2, GAME_HEIGHT - 100)

    this.playerBullets = new BulletPool(200)
    this.enemyBullets = new BulletPool(100)

    this.enemies = []
    this.boss = null
    this.particles = new ParticleSystem(300)

    this.waveSystem = new WaveSystem()
    this.upgradeSystem = new UpgradeSystem()
    this.scoreSystem = new ScoreSystem()
    this.fireTimer = 0
    this.gameTime = 0
    this.bossDefeated = 0
    this.upgradesSelected = []

    this.showWaveClear = false
    this.waveClearedTimer = 0

    this.upgradeMode = false
    this.upgradeChoices = []
    this.upgradeSelectedIndex = 0

    this.gameOver = false
    this.gameOverTimer = 0

    this.bossDelayedAttacks = []
    this.waveTimer = 0

    this.upgradeSystem.applyToPlayer(this.player)
    this.waveSystem.startNextWave()
  }

  update(input, dt) {
    this.gameTime += dt
    this.particles.update(dt)
    this.scoreSystem.update(dt)

    if (this.gameOver) {
      this.gameOverTimer -= dt
      if (this.gameOverTimer <= 0) {
        this.scoreSystem.saveScore(
          'ACE_WOLF',
          this.waveSystem.consecutiveWaves,
          this.player.shipType,
          this.bossDefeated,
          this.upgradeSystem.selected
        )
        this.manager.switchTo('ranking')
      }
      return
    }

    if (this.upgradeMode) {
      this._handleUpgradeInput(input)
      return
    }

    this.player.update(dt, input, GAME_WIDTH, GAME_HEIGHT)

    if (this.player.alive && input.firing) {
      this.fireTimer -= dt
      if (this.fireTimer <= 0) {
        this.fireTimer = this.player.fireRate
        this.playerBullets.firePlayer(
          this.player.x, this.player.y,
          this.player.weapon,
          this.player.projectileDamage,
          this.player.extraProjectiles
        )
      }
    } else {
      this.fireTimer = 0
    }

    const waveSpawns = this.waveSystem.update(dt, GAME_WIDTH, GAME_HEIGHT)
    if (waveSpawns && waveSpawns.length > 0) {
      for (const s of waveSpawns) {
        const enemy = spawnEnemy(s.type, GAME_WIDTH, s.difficultyMultiplier || 1)
        this.enemies.push(enemy)
      }
    }

    if (this.waveSystem.bossSpawned && !this.boss) {
      this.boss = new Boss()
      this.boss.spawn(GAME_WIDTH, GAME_HEIGHT)
    }

    this.playerBullets.update(dt, GAME_WIDTH, GAME_HEIGHT)
    this.enemyBullets.update(dt, GAME_WIDTH, GAME_HEIGHT)

    for (const e of this.enemies) {
      e.update(dt, this.player, GAME_WIDTH, GAME_HEIGHT)
      if (e.readyToFire) {
        let shots = []
        if (e.type === 'miniboss') shots = e.fireMinibossPattern(this.player)
        else if (e.type === 'elite') shots = e.fireEliteBurst(this.player)
        else { const shot = e.fireAtPlayer(this.player); if (shot) shots = [shot] }
        for (const s of shots) {
          this.enemyBullets.fire(s.x, s.y, s.vx, s.vy, 'enemy', { speed: s.speed, damage: s.damage, radius: s.radius })
        }
      }
    }

    if (this.boss && this.boss.alive) {
      this.boss.update(dt, this.player, GAME_WIDTH, GAME_HEIGHT)
      const attacks = this.boss.getAttacks(this.player)
      for (const a of attacks) {
        if (a.delay) {
          this.bossDelayedAttacks.push({ ...a, timer: a.delay })
        } else {
          this.enemyBullets.fire(a.x, a.y, a.vx, a.vy, 'boss', { speed: a.speed, damage: a.damage, radius: a.radius })
        }
      }
    }

    for (let i = this.bossDelayedAttacks.length - 1; i >= 0; i--) {
      this.bossDelayedAttacks[i].timer -= dt
      if (this.bossDelayedAttacks[i].timer <= 0) {
        const a = this.bossDelayedAttacks[i]
        this.enemyBullets.fire(a.x, a.y, a.vx, a.vy, 'boss', { speed: a.speed, damage: a.damage, radius: a.radius })
        this.bossDelayedAttacks.splice(i, 1)
      }
    }

    this.enemies = this.enemies.filter(e => e.alive && e.x > -80)

    const bulletHits = CollisionSystem.checkBulletsEnemies(this.playerBullets.getActive(), this.enemies)
    for (const { bullet, enemy } of bulletHits) {
      bullet.active = false
      this.playerBullets.activeCount--
      if (enemy.takeDamage(bullet.damage)) {
        this.scoreSystem.addKill(enemy.score)
        this.particles.emitExplosion(enemy.x, enemy.y, '#ff3344')
        this.waveSystem.registerKill()
      }
    }

    if (this.boss && this.boss.alive) {
      const bossHits = CollisionSystem.checkBulletsEnemies(this.playerBullets.getActive(), [this.boss])
      for (const { bullet } of bossHits) {
        bullet.active = false
        this.playerBullets.activeCount--
        if (this.boss.takeDamage(bullet.damage)) {
          this.scoreSystem.addKill(this.boss.score)
          this.bossDefeated++
          this.particles.emitExplosion(this.boss.x, this.boss.y, '#ff8800')
          this.waveSystem.registerKill()
        }
      }
    }

    const playerHitsEnemies = CollisionSystem.checkPlayerEnemies(this.player, this.enemies)
    for (const enemy of playerHitsEnemies) {
      if (this.player.takeDamage(enemy.collisionDamage)) this.particles.emitExplosion(this.player.x, this.player.y, '#00ff41')
      enemy.alive = false
    }

    const playerHitsBullets = CollisionSystem.checkBulletsEnemies(this.enemyBullets.getActive(), [this.player])
    for (const { bullet } of playerHitsBullets) {
      bullet.active = false
      this.enemyBullets.activeCount--
      if (this.player.takeDamage(bullet.damage)) this.particles.emitExplosion(this.player.x, this.player.y, '#00ff41')
    }

    if (!this.player.alive && !this.gameOver) {
      this.gameOver = true
      this.gameOverTimer = 2.0
      this.particles.emitExplosion(this.player.x, this.player.y, '#ff0000')
      setTimeout(() => this.particles.emitExplosion(this.player.x, this.player.y, '#ffff00'), 150)
    }

    if (this.waveSystem.waveActive && !this.waveSystem.bossActive) {
      const aliveEnemies = this.enemies.filter(e => e.alive)
      if (this.waveSystem.isWaveCleared && aliveEnemies.length === 0 && !this.waveSystem.inWaveDelay) {
        if (!this.showWaveClear) { this.showWaveClear = true; this.waveClearedTimer = 1.2 }
        this.waveClearedTimer -= dt
        if (this.waveClearedTimer <= 0) {
          this.showWaveClear = false
          this.scoreSystem.addBonus(this.waveSystem.getBonusScore())
          if (this.waveSystem.isUpgradeWave) {
            const tier = Math.min(Math.floor(this.waveSystem.consecutiveWaves / 3), 4)
            this.upgradeChoices = this.upgradeSystem.generateChoices(tier)
            this.upgradeSelectedIndex = 0
            this.upgradeMode = true
          }
          this.waveSystem.advanceWave()
          this.waveTimer = 0.3
        }
      }
    }

    if (this.waveTimer > 0) {
      this.waveTimer -= dt
      if (this.waveTimer <= 0 && !this.waveSystem.isComplete) {
        this.waveSystem.startNextWave()
      }
    }

    if (this.boss && !this.boss.alive && this.waveSystem.isBossFight) {
      this.gameOver = true
      this.gameOverTimer = 3.0
    }
  }

  _handleUpgradeInput(input) {
    if (this.upgradeChoices.length === 0) {
      this.upgradeMode = false
      return
    }
    if (input.justPressed('ArrowDown') || input.justPressed('KeyS')) {
      this.upgradeSelectedIndex = (this.upgradeSelectedIndex + 1) % this.upgradeChoices.length
    }
    if (input.justPressed('ArrowUp') || input.justPressed('KeyW')) {
      this.upgradeSelectedIndex = (this.upgradeSelectedIndex - 1 + this.upgradeChoices.length) % this.upgradeChoices.length
    }
    if (input.justPressed('Enter') || input.justPressed('Space')) {
      const chosen = this.upgradeChoices[this.upgradeSelectedIndex]
      if (chosen) {
        this.upgradeSystem.select(chosen.id)
        this.upgradeSystem.applyToPlayer(this.player)
        this.upgradesSelected = [...this.upgradeSystem.selected]
        this.upgradeMode = false
        this.upgradeChoices = []
      }
    }
  }

  render(ctx, gw, gh) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, gw, gh)
    ctx.strokeStyle = '#0d2b1d'
    ctx.lineWidth = 1
    for (let i = 0; i < gh; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(gw, i); ctx.stroke() }

    if (!this.upgradeMode) {
      this.player.render(ctx)
      this.playerBullets.render(ctx)
      for (const e of this.enemies) { e.render(ctx) }
      if (this.boss) this.boss.render(ctx)
      this.enemyBullets.render(ctx)
    }

    this.particles.render(ctx)

    if (this.upgradeMode) { this._renderUpgradeScreen(ctx, gw, gh); return }

    ctx.fillStyle = '#00ff41'
    ctx.font = '12px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`HP: ${this.player.hp}/${this.player.maxHp}`, 10, 20)
    if (this.scoreSystem.combo > 1) {
      ctx.fillStyle = '#ffff00'
      ctx.fillText(`COMBO x${this.scoreSystem.combo} (${this.scoreSystem.multiplier.toFixed(2)}x)`, 10, 35)
    }
    ctx.fillStyle = '#00ff41'
    ctx.textAlign = 'right'
    ctx.fillText(`SCORE: ${this.scoreSystem.score}`, gw - 10, 20)
    const phase = this.waveSystem.currentPhaseData
    if (phase) ctx.fillText(phase.name, gw - 10, 35)

    if (this.showWaveClear) {
      ctx.fillStyle = 'rgba(0, 10, 0, 0.7)'
      ctx.fillRect(0, gh / 2 - 40, gw, 80)
      ctx.fillStyle = '#00ff41'
      ctx.font = 'bold 22px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('WAVE CLEAR', gw / 2, gh / 2 + 5)
      ctx.fillStyle = '#0d2b1d'
      ctx.font = '12px monospace'
      ctx.fillText(`BONUS: +${this.waveSystem.getBonusScore()}`, gw / 2, gh / 2 + 30)
    }

    if (this.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      ctx.fillRect(0, 0, gw, gh)
      ctx.fillStyle = '#ff3344'
      ctx.font = 'bold 24px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', gw / 2, gh / 2 - 20)
      ctx.fillStyle = '#00ff41'
      ctx.font = '14px monospace'
      ctx.fillText(`SCORE: ${this.scoreSystem.score}`, gw / 2, gh / 2 + 15)
      ctx.fillStyle = '#0d2b1d'
      ctx.font = '12px monospace'
      ctx.fillText(`WAVES: ${this.waveSystem.consecutiveWaves} | BOSSES: ${this.bossDefeated}`, gw / 2, gh / 2 + 40)
    }

    if (input.touch.active) {
      const bx = input.touch.startX
      const by = input.touch.startY
      const dx = input.touch.currentX - bx
      const dy = input.touch.currentY - by
      const dist = Math.sqrt(dx * dx + dy * dy)
      const clamp = Math.min(dist, 60)
      const angle = Math.atan2(dy, dx)
      ctx.strokeStyle = '#0d2b1d'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(bx, by, 40, 0, Math.PI * 2); ctx.stroke()
      ctx.beginPath(); ctx.arc(bx + Math.cos(angle) * clamp, by + Math.sin(angle) * clamp, 12, 0, Math.PI * 2); ctx.stroke()
    }
  }

  _renderUpgradeScreen(ctx, gw, gh) {
    ctx.fillStyle = 'rgba(0, 5, 0, 0.92)'
    ctx.fillRect(0, 0, gw, gh)
    ctx.fillStyle = '#00ff41'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('UPGRADES DISPONÍVEIS', gw / 2, 120)
    ctx.font = '12px monospace'
    ctx.fillStyle = '#0d2b1d'
    ctx.fillText('Escolha 1 melhoria', gw / 2, 145)

    const startY = 200
    const spacing = 90
    for (let i = 0; i < this.upgradeChoices.length; i++) {
      const upg = this.upgradeChoices[i]
      const y = startY + i * spacing
      const selected = i === this.upgradeSelectedIndex
      ctx.strokeStyle = selected ? '#00ff41' : '#0d2b1d'
      ctx.lineWidth = selected ? 2 : 1
      ctx.strokeRect(60, y - 25, gw - 120, 70)
      if (selected) { ctx.fillStyle = '#00ff41'; ctx.fillText('>', 45, y + 5) }
      ctx.fillStyle = '#00ff41'
      ctx.font = 'bold 14px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`${upg.name} (Tier ${upg.tier})`, 75, y)
      ctx.fillStyle = '#0d2b1d'
      ctx.font = '11px monospace'
      ctx.fillText(upg.desc, 75, y + 18)
    }
    ctx.fillStyle = '#0d2b1d'
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('↑↓ navegar | ENTER/ESPAÇO selecionar', gw / 2, gh - 60)
  }
}

sceneManager
  .add('boot', new BootScene())
  .add('menu', new MenuScene())
  .add('shipSelect', new ShipSelectScene())
  .add('gameplay', new GameplayScene())
  .add('ranking', new RankingScene())
  .add('credits', new CreditsScene())

sceneManager.start('boot')

let lastTime = 0

function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05)
  lastTime = timestamp
  input.clearJustPressed()
  sceneManager.update(dt)
  sceneManager.render(ctx)
  requestAnimationFrame(gameLoop)
}

requestAnimationFrame((timestamp) => {
  lastTime = timestamp
  requestAnimationFrame(gameLoop)
})
