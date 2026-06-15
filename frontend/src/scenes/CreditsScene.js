import { Scene } from './SceneManager.js'

export class CreditsScene extends Scene {
  enter() {
    this.scrollY = 720
    this.lines = [
      '',
      'WOLF SQUADRON: ORIGINS',
      '',
      '─────────────────────',
      '',
      'Desenvolvimento',
      'Wolf Squadron Team',
      '',
      'Game Design',
      'Wolf Squadron Team',
      '',
      'Programação',
      'JavaScript ES Modules',
      'Canvas 2D API',
      'Vite',
      '',
      'Arte e Som',
      'Placeholder Assets',
      '',
      'Inspirações',
      'Space Impact',
      'Classic Shoot\'em Ups',
      '',
      'Agradecimentos',
      'Comunidade open source',
      'Testadores',
      'Você por jogar!',
      '',
      '─────────────────────',
      '',
      'v1.0.0',
      '2026',
    ]
  }

  update(input, dt) {
    this.scrollY -= 40 * dt
    if (input.justPressed('Enter') || input.justPressed('Space') || input.justPressed('Escape')) {
      this.manager.switchTo('menu')
    }
  }

  render(ctx, gw, gh) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, gw, gh)

    const startY = this.scrollY
    ctx.textAlign = 'center'
    ctx.font = '12px monospace'

    this.lines.forEach((line, i) => {
      const y = startY + i * 22
      if (y < -30 || y > gh + 30) return
      ctx.fillStyle = line.includes('WOLF SQUADRON') ? '#00ff41' : '#0d2b1d'
      if (line.startsWith('─')) {
        ctx.fillStyle = '#0d2b1d'
      }
      ctx.fillText(line || ' ', gw / 2, y)
    })
  }
}
