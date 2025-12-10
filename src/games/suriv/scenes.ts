import { Scene, World, type SignalBus } from '@/assets/emerald/core'
import { createBoundaries, createPlayer } from './entities'
import { CollisionSystem, ControlSystem } from './systems'
import { GestureSignal } from '@/assets/emerald/signals'
import { GestureKey, DragGestureTracker } from '@/assets/emerald/input'

export class DemoScene extends Scene {
  systems = [
    // new CollisionSystem(),
    new ControlSystem(),
  ]
  private dragTracker = new DragGestureTracker()

  constructor() {
    super('demo')
  }

  async init(world: World, sb: SignalBus): Promise<void> {
    await super.init(world, sb)

    world.addEntity(...createBoundaries(), createPlayer())

    this.dragTracker.init(this.slate, (g) => {
      sb.emit(new GestureSignal(g))
    })
  }

  deinit(): void {
    super.deinit()

    this.dragTracker.deinit()
  }
}
