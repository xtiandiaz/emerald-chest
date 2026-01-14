import {
  Body,
  System,
  World,
  Collider,
  Input,
  CollisionSensor,
  type SignalBus,
} from '@/assets/emerald'
import { ExtraColor } from '@/assets/emerald/extras'
import { Graphics, type PointData } from 'pixi.js'
import { InputAction } from './types'

export class BodyDumpSystem extends System {
  fixedUpdate(world: World, signalBus: SignalBus, dT: number): void {
    const sensors = world.getEntitiesByTag('dump').map((e) => e.getComponent(CollisionSensor)!)
    for (const sensor of sensors) {
      sensor.collidedIds.forEach((id) => world.removeEntity(id))
    }
  }
}

export class TestSystem extends System {
  latestSpawnedId?: number
  spawnsPolygon = true

  init(world: World, signalBus: SignalBus): void {
    this.connections.push(
      Input.connectDocumentEvent('keydown', (e) => {
        switch (e.code) {
          case 'Digit1':
            this.spawnsPolygon = true
            break
          case 'Digit2':
            this.spawnsPolygon = false
            break
        }
      }),
    )
  }

  onInput(signal: Input.Signal, world: World): void {
    switch (signal.source) {
      case Input.Source.KEYBOARD:
        const body = this.latestSpawnedId
          ? world.getComponent(this.latestSpawnedId, Body)
          : undefined
        if (!body) break
        switch (signal.action) {
          case InputAction.JUMP:
            body.applyForce({ x: 0, y: -2 }, body.position)
            break
          case InputAction.MOVE_RIGHT:
            body.velocity.x = 10
            break
          case InputAction.MOVE_LEFT:
            body.velocity.x -= 10
            break
        }
        break
      case Input.Source.POINTER:
        const pointerSignal = signal as Input.PointerSignal
        this.latestSpawnedId = this.spawnEntity(world, world.toLocal(pointerSignal.event.global))
        break
    }
  }

  private spawnEntity(world: World, position: PointData) {
    if (this.spawnsPolygon) {
      return this.createPolygon(world, position)
    } else {
      return this.createCircle(world, position)
    }
  }

  private createPolygon(world: World, position: PointData) {
    const w = 40 + Math.random() * 120
    const h = 40 + Math.random() * 120
    const e = world.createSimpleEntity(
      new Body(Collider.Shape.rectangle(-w / 2, -h / 2, w, h), {
        position,
        // rotation: Math.random() * Math.PI,
        // restitution: 0,
        // friction: {
        //   static: 1,
        //   dynamic: 1,
        // },
      }),
    )
    e.addChild(
      new Graphics()
        .rect(-w / 2, -h / 2, w, h)
        .fill({ color: ExtraColor.getRandomColor() })
        .stroke({ color: 0x000000, width: 2 }),
    )

    return e.id
  }

  private createCircle(world: World, position: PointData) {
    const r = 15 + Math.random() * 85
    const e = world.createSimpleEntity(
      new Body(Collider.Shape.circle(0, 0, r), {
        position,
        // restitution: 1,
        // friction: {
        //   static: 0,
        //   dynamic: 0,
        // },
        angularDrag: 0.25,
      }),
    )
    e.addChild(
      new Graphics()
        .circle(0, 0, r)
        .fill({ color: ExtraColor.getRandomColor() })
        .stroke({ color: 0x000000, width: 2 })
        .moveTo(0, 0)
        .lineTo(0, -r)
        .stroke({ color: 0x000000, width: 2 }),
    )
    return e.id
  }
}
