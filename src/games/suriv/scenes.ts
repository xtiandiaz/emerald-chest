import { Scene, World, type SignalBus, type SignalEmitter } from '@/assets/emerald/core'
import { createBoundaries, createPlayer } from './entities'
import { CollisionSystem, ControlSystem } from './systems'
import { GestureSignal } from '@/assets/emerald/signals'
import { GestureKey } from '@/assets/emerald/input'
import { InputController } from '@/assets/emerald/controllers'

export class DemoScene extends Scene {
  systems = [
    // new CollisionSystem(),
    new ControlSystem(),
  ]
  private input = new InputController()

  constructor() {
    super('demo')
  }

  async init(world: World, sbe: SignalBus & SignalEmitter): Promise<void> {
    await super.init(world, sbe)

    world.addEntity(...createBoundaries(), createPlayer())

    this.input.trackGesture(GestureKey.Tap, this.slate, (g) => {
      sbe.emit(new GestureSignal(g))
    })
  }
}
