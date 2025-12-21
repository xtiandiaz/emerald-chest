import { FederatedPointerEvent, Graphics, Point } from 'pixi.js'
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
  sign,
  Collider,
  ColliderShape,
  Tweener,
  type SignalBus,
} from '@/assets/emerald'
import { ItemCollected } from './signals'
import { CollisionLayer, Color } from './types'
import { PlayerSkin } from './components'

export class Skinning extends System {
  private player!: Entity
  private skinGraphics = new Graphics()
  private prevPos!: Point
  private tailElongFactor = 1

  init(world: World, hud: HUD, sb: SignalBus): void {
    this.player = world.getEntitiesByTag('player')![0]!
    this.player.addChild(this.skinGraphics)

    this.prevPos = this.player.position.clone()
  }

  update(world: World, sb: SignalBus, dt: number): void {
    const skin = this.player.getComponent(PlayerSkin)!
    const nextElongFactor = clamp(
      this.player.position.subtract(this.prevPos).magnitudeSquared() / (5 * 5),
      1,
      2,
    )
    this.tailElongFactor += (nextElongFactor - this.tailElongFactor) / 6
    skin.tailPoint.x = -skin.radius * this.tailElongFactor

    this.skinGraphics.clear()
    this.skinGraphics
      .roundShape(skin.shapePoints, skin.radius, true, 0)
      .stroke({ width: 5, color: Color.Energy })

    this.prevPos.copyFrom(this.player.position)
  }
}

export class CollectablesSystem extends System {
  init(world: World, hud: HUD, sb: SignalBus): void {
    sb.connect(CollisionSignal, (s) => {
      if (world.getEntity(s.collidedId)?.tag == 'collectable') {
        world.removeEntity(s.collidedId)

        sb.emit(new ItemCollected(1))

        this.placeNewCollectable(world)
      }
    })

    this.placeNewCollectable(world)
  }

  private placeNewCollectable(world: World) {
    const screenPadding = 50
    const co = world
      .createEntity('collectable')
      .addComponent(new Collider(ColliderShape.circle(0, 0, 10), CollisionLayer.Collectable))

    co.addChild(new Graphics().roundPoly(0, 0, 12, 5, 2).stroke({ width: 3, color: Color.Energy }))
    co.position.set(
      screenPadding + Math.random() * (Screen.width - 2 * screenPadding),
      screenPadding + Math.random() * (Screen.height - 2 * screenPadding),
    )

    Tweener.shared
      .timeline()
      .to(co, {
        pixi: { rotation: 45 },
        startAt: { pixi: { rotation: -45 } },
        ease: 'power3.inOut',
        duration: 1,
      })
      .to(co, { pixi: { rotation: -45 }, ease: 'power3.inOut', duration: 1 })
      .repeat(-1)
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

    this.player = world.getEntitiesByTag('player')![0]!
    this.player.position.set(Screen.width / 2, Screen.height / 2)

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
    const deltaPos = nextPos.subtract(this.player.position)

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

  private handleKeyboardInput(e: KeyboardEvent, world: World) {
    const b = world.getEntitiesByTag('player')![0]!.getComponent(RigidBody)
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
