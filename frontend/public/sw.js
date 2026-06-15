const CACHE_NAME = 'wolf-squadron-v1'
const ASSETS = [
  '/',
  '/index.html',
  '/src/style.css',
  '/src/main.js',
  '/src/scenes/SceneManager.js',
  '/src/scenes/ShipSelectScene.js',
  '/src/scenes/RankingScene.js',
  '/src/scenes/CreditsScene.js',
  '/src/entities/Player.js',
  '/src/entities/Bullet.js',
  '/src/entities/Enemy.js',
  '/src/entities/Boss.js',
  '/src/systems/InputSystem.js',
  '/src/systems/CollisionSystem.js',
  '/src/systems/WaveSystem.js',
  '/src/systems/ParticleSystem.js',
  '/src/systems/UpgradeSystem.js',
  '/src/systems/ScoreSystem.js',
  '/src/systems/waves.json',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  )
})
