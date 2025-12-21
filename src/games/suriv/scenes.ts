import { Graphics } from 'pixi.js'
import {
  Collider,
  ColliderShape,
  CollisionSystem,
  DragGestureTracker,
  GestureKey,
  GestureSystem,
  GestureTarget,
  Scene,
  World,
} from '@/assets/emerald'
import { CollectablesSystem, PlayerControlSystem, Skinning } from './systems'
import { PlayerSkin } from './components'
import { CollisionLayer, Color } from './types'

export class DemoScene extends Scene {
  systems = [
    new Skinning(),
    new GestureSystem(),
    new CollisionSystem(
      new Map([[CollisionLayer.Player, CollisionLayer.Collectable | CollisionLayer.Enemy]]),
    ),
    new PlayerControlSystem(),
    new CollectablesSystem(),
  ]
  private draggingTracker = new DragGestureTracker()

  constructor() {
    super('demo')
  }

  build(world: World): void {
    world
      .createEntity('player')
      .addComponent(new PlayerSkin(24))
      .addComponent(new Collider(ColliderShape.circle(0, 0, 24), CollisionLayer.Player))
      .addComponent(new GestureTarget([GestureKey.Drag]))
  }

  deinit(): void {
    super.deinit()

    this.draggingTracker.deinit()
  }
}
