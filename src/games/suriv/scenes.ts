import { Scene, World, Screen, type SignalBus, type Disconnectable } from '@/assets/emerald/core'
import { GestureSystem, PhysicsSystem, CollisionSystem } from '@/assets/emerald/systems'
import { createBoundaries, createCollectable, createEnemy, createPlayer } from './entities'
import { CollectingSystem, PlayerControlSystem } from './systems'
import { DragGestureTracker } from '@/assets/emerald/input'
import { ItemCollected } from './signals'
import { connectContainerEvent } from '@/assets/emerald/input/utils'

export class DemoScene extends Scene {
  systems = [
    new PhysicsSystem(),
    new CollisionSystem(),
    new GestureSystem(),
    new PlayerControlSystem(),
    new CollectingSystem(),
  ]
  private draggingTracker = new DragGestureTracker()

  constructor() {
    super('demo')
  }

  build(world: World): void {
    world.addEntity(...createBoundaries(), createPlayer(), createCollectable(), createEnemy())
  }

  async init(world: World, sb: SignalBus): Promise<void> {
    await super.init(world, sb)

    this.connections.push(sb.connect(ItemCollected, (_) => world.addEntity(createCollectable())))

    // this.draggingTracker.init(this.slate, (g) => sb.queue(new GestureSignal(g)))
  }

  deinit(): void {
    super.deinit()

    this.draggingTracker.deinit()
  }
}
