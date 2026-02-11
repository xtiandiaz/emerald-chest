import { Assets } from 'pixi.js'
import { Collision, PhysicsSystem, Scene } from '@emerald'
import type { FizzComponents } from './components'
import { createBound, createCollectible, createFoe, Player } from './entities'
import { FizzSystems } from './systems'
import type { DodgeSignals } from './signals'
import { FizzCollisionLayer, type Face } from './types'
import { createStaticGrid } from './utils'

const collisionLayerMap: Collision.LayerMap = new Map([
  [FizzCollisionLayer.PLAYER, FizzCollisionLayer.COLLECTIBLE],
  [FizzCollisionLayer.FOE, FizzCollisionLayer.PLAYER],
  [
    FizzCollisionLayer.BULLET,
    FizzCollisionLayer.PLAYER | FizzCollisionLayer.BOUND | FizzCollisionLayer.BULLET,
  ],
])

export class MainScene extends Scene<FizzComponents, DodgeSignals> {
  constructor() {
    super([
      new PhysicsSystem({ iterations: 1, collisionLayerMap, debug: { rendersColliders: false } }),
      new FizzSystems.PlayerControls(),
      new FizzSystems.Spawning(),
      new FizzSystems.Chasing(),
      new FizzSystems.Shooting(),
      new FizzSystems.Interaction(),
      new FizzSystems.Difficulty(),
    ])

    Assets.addBundle('all', [{ alias: 'grid', src: `${import.meta.env.BASE_URL}/dodge/grid.png` }])
  }

  deinit(): void {
    super.deinit()

    Assets.unloadBundle('all')
  }

  async load(): Promise<void> {
    await Assets.loadBundle('all')
  }

  build(): void {
    this.addChild(createStaticGrid())

    Array<Face>('top', 'right', 'bottom', 'left').forEach((f) => createBound(this, f))

    this.createEntity(Player)
    createFoe(this, 2)

    for (let i = 0; i < 4; i++) {
      createCollectible(this)
    }
  }
}
