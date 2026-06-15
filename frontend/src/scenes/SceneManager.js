export class SceneManager {
  constructor() {
    this.scenes = new Map()
    this.currentScene = null
    this.currentSceneName = null
    this.transitioning = false
    this.transitionAlpha = 0
    this.gameWidth = 480
    this.gameHeight = 720
    this.gameState = {}
    this.input = null
  }

  setInput(input) {
    this.input = input
  }

  add(name, scene) {
    this.scenes.set(name, scene)
    scene.manager = this
    return this
  }

  start(name) {
    if (this.currentScene) this.currentScene.exit()
    this.currentSceneName = name
    this.currentScene = this.scenes.get(name)
    this.currentScene.enter()
  }

  switchTo(name) {
    if (this.transitioning || name === this.currentSceneName) return
    this.transitioning = true
    this.transitionAlpha = 0
    this._nextScene = name
  }

  update(dt) {
    if (this.transitioning) {
      this.transitionAlpha += dt * 4
      if (this.transitionAlpha >= 1) {
        this.transitionAlpha = 1
        if (this.currentScene) this.currentScene.exit()
        this.currentSceneName = this._nextScene
        this.currentScene = this.scenes.get(this._nextScene)
        this.currentScene.enter()
        this._nextScene = null
      } else if (this.transitionAlpha > 0.5 && this._nextScene) {
        this.transitionAlpha = 0.5
      }
    }

    if (this.currentScene) {
      this.currentScene.update(this.input, dt)
    }
  }

  render(ctx) {
    if (this.currentScene) {
      this.currentScene.render(ctx, this.gameWidth, this.gameHeight)
    }

    if (this.transitioning) {
      ctx.fillStyle = `rgba(0, 0, 0, ${this.transitionAlpha})`
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      if (this.transitionAlpha >= 1) {
        this.transitioning = false
        this.transitionAlpha = 0
      }
    }
  }
}

export class Scene {
  constructor() {
    this.manager = null
  }

  enter() {}
  exit() {}
  update(_input, _dt) {}
  render(_ctx, _gw, _gh) {}
}
