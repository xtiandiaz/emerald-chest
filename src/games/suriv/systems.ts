import { FederatedPointerEvent, Point } from 'pixi.js'
import '@/assets/emerald/extensions/pixi.extensions'
import 'pixi.js/math-extras'
import {
  CollisionSignal,
  connectContainerEvent,
  connectDocumentEvent,
  Screen,
  Entity,
  HUD,
  RigidBody,
  System,
  World,
  clamp,
  Direction,
  Vector,
  directionVector,
  type SignalBus,
} from '@/assets/emerald'
import { ItemCollected } from './signals'

export class CollectingSystem extends System {
  init(world: World, hud: HUD, sb: SignalBus): void {
    sb.connect(CollisionSignal, (s) => {
      if (world.getEntity(s.collidedId)?.label === 'collectable') {
        world.removeEntity(s.collidedId)
        sb.emit(new ItemCollected(1))
      }
    })
  }
}

interface PlayerControlState {
  playerStartPos: Point
  playerTargetPos: Point
  controlStartPoint?: Point
}

export class PlayerControlSystem extends System {
  private player!: Entity
  private state?: PlayerControlState

  init(world: World, hud: HUD, sb: SignalBus): void {
    hud.eventMode = 'static'

    this.player = world.getEntityByLabel('player')!

    this.connections.push(
      connectContainerEvent('pointerdown', hud, (e) => this.handlePointerInput(e)),
      connectContainerEvent('globalpointermove', hud, (e) => this.handlePointerInput(e)),
      connectContainerEvent('pointerup', hud, (e) => this.handlePointerInput(e)),

      connectDocumentEvent('keydown', (e) => this.handleKeyboardInput(e, world)),
    )
  }

  update(world: World, sb: SignalBus, dt: number): void {
    if (!this.state) {
      return
    }
    const nextPos = this.player.position.add(
      this.state.playerTargetPos.subtract(this.player.position).divideByScalar(6),
    )
    nextPos.x = clamp(nextPos.x, 0, Screen.width)
    nextPos.y = clamp(nextPos.y, 0, Screen.height)
    this.player.position.set(nextPos.x, nextPos.y)
  }

  private handlePointerInput(e: FederatedPointerEvent) {
    switch (e.type) {
      case 'pointerdown':
        this.state = {
          controlStartPoint: e.global.clone(),
          playerStartPos: this.player.position.clone(),
          playerTargetPos: this.player.position.clone(),
        }
        break
      case 'pointermove':
        if (!this.state?.controlStartPoint) {
          break
        }
        const dPos = e.global.subtract(this.state.controlStartPoint).multiplyScalar(4)
        const tPos = this.state.playerStartPos.add(dPos)
        if (tPos.x <= 0 || tPos.x >= Screen.width) {
          this.state.controlStartPoint!.x = e.globalX
          this.state.playerStartPos.x = clamp(tPos.x, 0, Screen.width)
        }
        if (tPos.y <= 0 || tPos.y >= Screen.height) {
          this.state.controlStartPoint!.y = e.globalY
          this.state.playerStartPos.y = clamp(tPos.y, 0, Screen.height)
        }
        this.state.playerTargetPos.set(tPos.x, tPos.y)
        break
      case 'pointerup':
        this.state!.controlStartPoint = undefined
        break
    }
  }

  private handleKeyboardInput(e: KeyboardEvent, world: World) {
    const b = world.getEntityByLabel('player')?.getComponent(RigidBody)
    const applyForce = (dir: Vector) => {
      if (b) {
        b.force?.copyFrom(dir.multiplyScalar(0.1))
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
