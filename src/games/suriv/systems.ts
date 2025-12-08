import Matter from 'matter-js'
import 'pixi.js/math-extras'
import '@/assets/emerald/extensions/pixi.extensions'
import {
  World,
  System,
  Vector,
  type SignalBus,
  type SignalEmitter,
  Screen,
  Entity,
} from '@/assets/emerald/core'
import { PhysicsComponent, GestureComponent } from '@/assets/emerald/components'
import { CollisionSignal, GestureSignal, ScreenResizeSignal } from '@/assets/emerald/signals'
import { PlayerComponent } from './components'
import { directionVector } from '@/assets/emerald/utils'
import { GestureKey, Gesture, DragGesture, GesturePhase } from '@/assets/emerald/input'

export class CollisionSystem extends System {
  init(world: World, sbe: SignalBus & SignalEmitter): void {
    sbe.connect(CollisionSignal, (s) => {
      const pc = world.getEntity(s.colliderId)?.getComponent(PhysicsComponent)
      if (pc) {
        Matter.Body.setVelocity(pc.body, { x: (Math.random() < 0.5 ? -1 : 1) * 5, y: -12 })
      }
    })
  }
}

export class ControlSystem extends System {
  static readonly MAX_SPEED = 10
  private screenSpan = new Vector(100, 100)

  init(world: World, sbe: SignalBus & SignalEmitter): void {
    this.disconnectables.push(sbe.connect(ScreenResizeSignal, (s) => this.resetScreenSpan()))
    this.resetScreenSpan()
  }

  update(world: World, se: SignalEmitter, dt: number): void {
    const ecs = world.getEntitiesWithComponent(GestureComponent)
    for (const [e, c] of ecs) {
      const tg = c.getGesture(GestureKey.Tap)
      if (tg) {
        e.getComponent(PhysicsComponent)?.setPosition(tg.worldPos)
      }
    }
  }

  private resetScreenSpan() {
    this.screenSpan = new Vector(Screen.width, Screen.height).divideByScalar(4)
  }
}
