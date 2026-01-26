import { Assets } from 'pixi.js'
import { Collision, PhysicsSystem, Scene } from '@emerald'
import type { DodgeComponents } from './components'
import { createBound, createCollectible, createFoe, createPlayer } from './entities'
import { DodgeSystems } from './systems'
import type { DodgeSignals } from './signals'
import { DodgeCollisionLayer, type Face } from './types'
import { createStaticGrid } from './utils'

const collisionLayerMap: Collision.LayerMap = new Map([
  [DodgeCollisionLayer.PLAYER, DodgeCollisionLayer.COLLECTIBLE],
  [DodgeCollisionLayer.FOE, DodgeCollisionLayer.PLAYER],
  [
    DodgeCollisionLayer.BULLET,
    DodgeCollisionLayer.PLAYER | DodgeCollisionLayer.BOUND | DodgeCollisionLayer.BULLET,
  ],
])

export namespace DodgeScenes {
  export class Main extends Scene<DodgeComponents, DodgeSignals> {
    constructor() {
      super('main', [
        new PhysicsSystem({ iterations: 1, collisionLayerMap, debug: { rendersColliders: false } }),
        new DodgeSystems.PlayerControls(),
        new DodgeSystems.Spawning(),
        new DodgeSystems.Chasing(),
        new DodgeSystems.Shooting(),
        new DodgeSystems.Interaction(),
        new DodgeSystems.Difficulty(),
      ])

      Assets.addBundle('all', [{ alias: 'grid', src: '/suriv/textures/grid.png' }])
    }

    deinit(): void {
      super.deinit()

      Assets.unloadBundle('all')
    }

    async load(): Promise<void> {
      await Assets.loadBundle('all')
    }

    build(): void {
      const grid = createStaticGrid()
      this.addChild(grid)

      Array<Face>('top', 'right', 'bottom', 'left').forEach((f) => createBound(this, f))

      createPlayer(this)
      createFoe(this, 2)

      for (let i = 0; i < 4; i++) {
        createCollectible(this)
      }
    }
  }
}
