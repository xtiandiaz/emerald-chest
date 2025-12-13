import { Point } from 'pixi.js'
import '@/assets/emerald/extensions/pixi.extensions'
import 'pixi.js/math-extras'
import { World, System, Vector, Screen, Direction, type SignalBus } from '@/assets/emerald/core'
import { RigidBody } from '@/assets/emerald/components'
import { CollisionSignal, GestureSignal } from '@/assets/emerald/signals'
import { GesturePhase, type DragGesture } from '@/assets/emerald/input'
import { clamp, directionVector } from '@/assets/emerald/core/utils'
import { connectDocumentEvent } from '@/assets/emerald/input/utils'
import { Movement } from './components'
import { ItemCollected } from './signals'

export class CollisionSystem extends System {
  init(world: World, sb: SignalBus): void {
    sb.connect(CollisionSignal, (s) => {
      if (world.getEntity(s.collidedId)?.label === 'collectable') {
        world.removeEntity(s.collidedId)
        sb.emit(new ItemCollected(1))
      }
    })
  }
}

export class ControlSystem extends System {
  private startControlPoint?: Point

  init(world: World, sb: SignalBus): void {
    this.connections.push(
      sb.connect(GestureSignal<DragGesture>, (s) => this.setMovement(s.gesture, world)),
      connectDocumentEvent('keydown', (e) => this.handleKeyboardInput(e, world)),
    )
  }

  update(world: World, sb: SignalBus, dt: number): void {
    const ecs = world.getEntitiesWithComponent(Movement)
    for (const { e, c: mc } of ecs) {
      const b = e.getComponent(RigidBody)!
      const nextPos = b.position.add(mc.pos.subtract(b.position).divideByScalar(5))
      nextPos.x = clamp(nextPos.x, 0, Screen.width)
      nextPos.y = clamp(nextPos.y, 0, Screen.height)
      b.position.set(nextPos.x, nextPos.y)
    }
  }

  private setMovement(g: DragGesture, w: World) {
    const ecs = w.getEntitiesWithComponent(Movement)
    for (const { e, c } of ecs) {
      const pc = e.getComponent(RigidBody)!
      if (g.phase == GesturePhase.Began) {
        c.startPos.set(pc.position.x, pc.position.y)
        this.startControlPoint = g.startWorldPos
      }
      c.pos = c.startPos.add(g.worldPos.subtract(this.startControlPoint!).multiplyScalar(4))

      if (c.pos.x <= 0 || c.pos.x >= Screen.width) {
        this.startControlPoint!.x = g.worldPos.x
        c.startPos.x = clamp(c.pos.x, 0, Screen.width)
      }
      if (c.pos.y <= 0 || c.pos.y >= Screen.height) {
        this.startControlPoint!.y = g.worldPos.y
        c.startPos.y = clamp(c.pos.y, 0, Screen.height)
      }
    }
  }

  private handleKeyboardInput(e: KeyboardEvent, world: World) {
    const b = world.getEntityByLabel('player')?.getComponent(RigidBody)
    const applyForce = (dir: Vector) => {
      if (b) {
        b.force.copyFrom(dir.multiplyScalar(0.1))
      }
    }
    switch (e.key) {
      case 'ArrowUp':
        applyForce(directionVector(Direction.Up))
        break
      case 'ArrowRight':
        applyForce(directionVector(Direction.Right))
        break
      case 'ArrowDown':
        applyForce(directionVector(Direction.Down))
        break
      case 'ArrowLeft':
        applyForce(directionVector(Direction.Left))
        break
    }
  }
}
