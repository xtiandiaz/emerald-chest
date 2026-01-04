import { FederatedPointerEvent, Point, Rectangle } from 'pixi.js'
import '@/assets/emerald/extensions/pixi.extensions'
import 'pixi.js/math-extras'
import {
  connectContainerEvent,
  Screen,
  Body,
  System,
  World,
  clamp,
  sign,
  ScreenResized,
  type SignalBus,
} from '@/assets/emerald'
import { ItemCollected } from './signals'
import { Collectable, Grid, Player } from './entities'
import { CollisionSensor } from '@/assets/emerald/components/CollisionSensor'

export class Resizing extends System {
  init(world: World, signalBus: SignalBus): void {
    this.connections.push(signalBus.connect(ScreenResized, (_) => this.resize(world)))

    this.resize(world)
  }

  private resize(world: World) {
    world.getEntityByType(Grid)!.resize()
  }
}

export class PlayerMorphing extends System {
  private player!: Player
  private prevPos!: Point
  private tailElongFactor = 1

  init(world: World, signalBus: SignalBus): void {
    this.player = world.getEntityByType(Player)!

    this.prevPos = this.player.position.clone()
  }

  update(world: World, sb: SignalBus, dt: number): void {
    const nextElongFactor = clamp(
      this.player.position.subtract(this.prevPos).magnitudeSquared() / (5 * 5),
      1,
      2,
    )
    this.tailElongFactor += (nextElongFactor - this.tailElongFactor) / 6

    this.player.redraw(this.tailElongFactor)

    this.prevPos.copyFrom(this.player.position)
  }
}

export class CollectablesSystem extends System {
  private sensor!: CollisionSensor

  init(world: World, signalBus: SignalBus): void {
    this.sensor = world.getEntityByType(Player)!.getComponent(CollisionSensor)!
    this.placeNewCollectable(world)
  }

  update(world: World, signalBus: SignalBus, dT: number): void {
    if (this.sensor.collidedIds.size == 0) {
      return
    }
    this.sensor.collidedIds.forEach((id) => world.removeEntity(id))

    signalBus.emit(new ItemCollected(1))

    this.placeNewCollectable(world)
  }

  private placeNewCollectable(world: World) {
    const screenPadding = 50
    world
      .createEntity(Collectable)
      .position.set(
        screenPadding + Math.random() * (Screen.width - 2 * screenPadding),
        screenPadding + Math.random() * (Screen.height - 2 * screenPadding),
      )
  }
}

interface PlayerControlState {
  playerStartPos: Point
  playerTargetPos: Point
  controlStartPoint?: Point
}

export class PlayerControlSystem extends System {
  private player!: Player
  private state?: PlayerControlState

  init(world: World, signalBus: SignalBus): void {
    world.eventMode = 'static'
    world.hitArea = new Rectangle(0, 0, Screen.width, Screen.height)

    this.player = world.getEntityByType(Player)!
    this.player.position.set(Screen.width / 2, Screen.height / 2)

    this.connections.push(
      connectContainerEvent('pointerdown', world, (e) => this.handlePointerInput(e)),
      connectContainerEvent('globalpointermove', world, (e) => this.handlePointerInput(e)),
      connectContainerEvent('pointerup', world, (e) => this.handlePointerInput(e)),
    )
  }

  update(world: World, sb: SignalBus, dt: number): void {
    if (!this.state) {
      return
    }
    const nextPos = this.player.position.add(
      this.state.playerTargetPos.subtract(this.player).divideByScalar(6),
    )
    const padding = this.player.radius
    // TODO make rectangle and inset by radius of player
    nextPos.x = clamp(nextPos.x, padding, Screen.width - padding)
    nextPos.y = clamp(nextPos.y, padding, Screen.height - padding)
    const deltaPos = nextPos.subtract(this.player)

    this.player.position.copyFrom(nextPos)

    let nextRot: number
    if (deltaPos.x == 0) {
      nextRot = sign(deltaPos.y) * Math.PI * 0.5
    } else {
      nextRot = Math.atan(deltaPos.y / deltaPos.x) + (deltaPos.x < 0 ? Math.PI : 0)
    }
    this.player.rotation = nextRot
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
}
