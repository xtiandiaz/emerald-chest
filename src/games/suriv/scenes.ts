import { Scene, World, Screen, type SignalBus, type Disconnectable } from '@/assets/emerald/core'
import { createBoundaries, createCollectable, createEnemy, createPlayer } from './entities'
import { CollisionSystem, ControlSystem } from './systems'
import { GestureSignal } from '@/assets/emerald/signals'
import { DragGestureTracker } from '@/assets/emerald/input'
import { ItemCollected } from './signals'

export class DemoScene extends Scene {
  systems = [new ControlSystem(), new CollisionSystem()]
  private draggingTracker = new DragGestureTracker()

  constructor() {
    super('demo')
  }

  async init(world: World, sb: SignalBus): Promise<void> {
    await super.init(world, sb)

    world.addEntity(...createBoundaries(), createPlayer(), createCollectable(), createEnemy())

    this.connections.push(sb.connect(ItemCollected, (_) => world.addEntity(createCollectable())))

    this.draggingTracker.init(this.slate, (g) => sb.queue(new GestureSignal(g)))
  }

  deinit(): void {
    super.deinit()

    this.draggingTracker.deinit()
  }
}
