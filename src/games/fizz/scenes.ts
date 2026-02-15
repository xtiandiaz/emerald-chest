import { Assets } from 'pixi.js'
import { Collision, PhysicsSystem, Scene } from '@emerald'
import type { FizzComponents } from './components'
import { createCollectible, createFoe, Player } from './entities'
import { createBounds } from '../entities.shared'
import { FizzSystems } from './systems'
import type { FizzSignals } from './signals'
import { FizzCollisionLayer } from './types'
import { createStaticGrid } from './utils'

const collisionLayerMap: Collision.LayerMap = new Map([
  [FizzCollisionLayer.PLAYER, FizzCollisionLayer.COLLECTIBLE],
  [FizzCollisionLayer.FOE, FizzCollisionLayer.PLAYER],
  [
    FizzCollisionLayer.BULLET,
    FizzCollisionLayer.PLAYER | FizzCollisionLayer.BOUND | FizzCollisionLayer.BULLET,
  ],
])

export class MainScene extends Scene<FizzComponents, FizzSignals> {
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
  }

  async load(): Promise<void> {
    await Assets.loadBundle('fizz')
  }

  build(): void {
    this.addChild(createStaticGrid())

    createBounds(this.boundsArea, this, {
      layer: FizzCollisionLayer.BOUND,
      restitution: 0,
      friction: { static: 0, dynamic: 0 },
    })

    this.createEntity(Player)
    createFoe(this, 2)

    for (let i = 0; i < 4; i++) {
      createCollectible(this)
    }
  }

  async unload(): Promise<void> {
    await Assets.unloadBundle('fizz')
  }
}
