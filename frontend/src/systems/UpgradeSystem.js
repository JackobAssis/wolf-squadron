const UPGRADE_TREE = [
  {
    id: 'dano_I', name: 'Dano I', tier: 1,
    desc: '+20% dano da arma atual',
    effect: { type: 'damage', value: 1.2 },
    prerequisites: [],
  },
  {
    id: 'velocidade_I', name: 'Velocidade I', tier: 1,
    desc: '+15% velocidade da nave',
    effect: { type: 'speed', value: 1.15 },
    prerequisites: [],
  },
  {
    id: 'cadencia_I', name: 'Cadência I', tier: 1,
    desc: '+10% cadência de tiro',
    effect: { type: 'fireRate', value: 1.1 },
    prerequisites: [],
  },
  {
    id: 'dano_II', name: 'Dano II', tier: 2,
    desc: '+35% dano (acumulativo)',
    effect: { type: 'damage', value: 1.35 },
    prerequisites: ['dano_I'],
  },
  {
    id: 'velocidade_II', name: 'Velocidade II', tier: 2,
    desc: '+25% velocidade (acumulativo)',
    effect: { type: 'speed', value: 1.25 },
    prerequisites: ['velocidade_I'],
  },
  {
    id: 'cadencia_II', name: 'Cadência II', tier: 2,
    desc: '+20% cadência (acumulativo)',
    effect: { type: 'fireRate', value: 1.2 },
    prerequisites: ['cadencia_I'],
  },
  {
    id: 'projetil_extra', name: 'Projétil Extra', tier: 2,
    desc: '+1 projétil por disparo',
    effect: { type: 'projectile', value: 1 },
    prerequisites: [],
  },
  {
    id: 'dano_III', name: 'Dano III', tier: 3,
    desc: '+50% dano (acumulativo)',
    effect: { type: 'damage', value: 1.5 },
    prerequisites: ['dano_II'],
  },
  {
    id: 'velocidade_III', name: 'Velocidade III', tier: 3,
    desc: '+40% velocidade (acumulativo)',
    effect: { type: 'speed', value: 1.4 },
    prerequisites: ['velocidade_II'],
  },
  {
    id: 'cadencia_III', name: 'Cadência III', tier: 3,
    desc: '+35% cadência (acumulativo)',
    effect: { type: 'fireRate', value: 1.35 },
    prerequisites: ['cadencia_II'],
  },
  {
    id: 'escudo', name: 'Escudo', tier: 3,
    desc: 'Absorve 1 hit (recarrega por onda)',
    effect: { type: 'shield', value: 1 },
    prerequisites: [],
  },
  {
    id: 'super_dano', name: 'Super Dano', tier: 4,
    desc: '+75% dano + 10% chance crítico (2x)',
    effect: { type: 'damage', value: 1.75 },
    prerequisites: ['dano_III'],
  },
  {
    id: 'teletransporte', name: 'Teletransporte', tier: 4,
    desc: 'Dash teleporta (invulnerável)',
    effect: { type: 'speed', value: 1.6 },
    prerequisites: ['velocidade_III'],
  },
  {
    id: 'auto_tiro', name: 'Auto-Tiro', tier: 4,
    desc: 'Disparo automático + overclock',
    effect: { type: 'fireRate', value: 1.5 },
    prerequisites: ['cadencia_III'],
  },
  {
    id: 'escudo_reforcado', name: 'Escudo Reforçado', tier: 4,
    desc: 'Escudo +30 HP máximo',
    effect: { type: 'hp', value: 30 },
    prerequisites: ['escudo'],
  },
]

const STORAGE_KEY = 'wolf_squadron_upgrades'

export class UpgradeSystem {
  constructor() {
    this.allUpgrades = UPGRADE_TREE
    this.selected = this._load()
    this.choices = []
  }

  getAvailable(tier) {
    const selectedIds = new Set(this.selected)
    const tierUpgrades = this.allUpgrades.filter(u => u.tier === tier)
    return tierUpgrades.filter(u => {
      if (selectedIds.has(u.id)) return false
      return u.prerequisites.every(p => selectedIds.has(p))
    })
  }

  generateChoices(tier) {
    for (let t = tier; t >= 1; t--) {
      const available = this.getAvailable(t)
      if (available.length > 0) {
        const shuffled = [...available].sort(() => Math.random() - 0.5)
        this.choices = shuffled.slice(0, Math.min(4, shuffled.length))
        return this.choices
      }
    }
    this.choices = []
    return this.choices
  }

  select(upgradeId) {
    if (!this.selected.includes(upgradeId)) {
      this.selected.push(upgradeId)
      this._save()
      return true
    }
    return false
  }

  applyToPlayer(player) {
    let dmgMult = 1
    let spdMult = 1
    let fireRateMult = 1
    let extraProj = 0
    let extraHp = 0

    for (const id of this.selected) {
      const upg = this.allUpgrades.find(u => u.id === id)
      if (!upg) continue
      switch (upg.effect.type) {
        case 'damage': dmgMult *= upg.effect.value; break
        case 'speed': spdMult *= upg.effect.value; break
        case 'fireRate': fireRateMult *= upg.effect.value; break
        case 'projectile': extraProj += upg.effect.value; break
        case 'hp': extraHp += upg.effect.value; break
        case 'shield': break
      }
    }

    player.damageMultiplier = dmgMult
    player.speed = (player.shipType === 'lightning' ? 240 : player.shipType === 'phantom' ? 200 : 160) * spdMult
    player.fireRateMultiplier = fireRateMult
    player.extraProjectiles = extraProj
    player.maxHp = (player.shipType === 'lightning' ? 80 : player.shipType === 'phantom' ? 100 : 130) + extraHp
    if (player.hp > player.maxHp) player.hp = player.maxHp
  }

  get hasShield() {
    return this.selected.includes('escudo') || this.selected.includes('escudo_reforcado')
  }

  reset() {
    this.selected = []
    this.choices = []
    this._save()
  }

  _load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.selected))
    } catch { }
  }
}
