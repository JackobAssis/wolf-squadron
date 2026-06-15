import { Scene } from './SceneManager.js'
import { ScoreSystem } from '../systems/ScoreSystem.js'

export class RankingScene extends Scene {
  enter() {
    this.scoreSystem = new ScoreSystem()
    this.scores = this.scoreSystem.getScores()
  }

  update(input) {
    if (input.justPressed('Enter') || input.justPressed('Space') || input.justPressed('Escape')) {
      this.manager.switchTo('menu')
    }
  }

  render(ctx, gw, gh) {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, gw, gh)

    ctx.fillStyle = '#00ff41'
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('RANKING', gw / 2, 60)

    if (this.scores.length === 0) {
      ctx.fillStyle = '#0d2b1d'
      ctx.font = '14px monospace'
      ctx.fillText('Nenhuma pontuação registrada', gw / 2, gh / 2)
    } else {
      const sorted = this.scores.sort((a, b) => b.score - a.score).slice(0, 10)
      const startY = 110
      const spacing = 38

      ctx.fillStyle = '#0d2b1d'
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.fillText('RANK', 60, startY - 10)
      ctx.fillText('JOGADOR', 110, startY - 10)
      ctx.textAlign = 'right'
      ctx.fillText('PONTOS', gw - 60, startY - 10)

      sorted.forEach((s, i) => {
        const y = startY + i * spacing
        ctx.fillStyle = i === 0 ? '#ffff00' : i < 3 ? '#ff8800' : '#00ff41'
        ctx.font = 'bold 13px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(`#${String(i + 1).padStart(2, '0')}`, 70, y)
        ctx.textAlign = 'left'
        ctx.fillText(s.playerName || 'ACE_WOLF', 110, y)
        ctx.textAlign = 'right'
        ctx.fillStyle = '#00ff41'
        ctx.font = '12px monospace'
        ctx.fillText(String(s.score).padStart(7, '0'), gw - 60, y)
      })
    }

    ctx.fillStyle = '#0d2b1d'
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('ENTER/ESC para voltar', gw / 2, gh - 60)
  }
}
