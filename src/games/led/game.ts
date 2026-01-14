import {
  Game,
  Body,
  Scene,
  System,
  World,
  Screen,
  Collider,
  PhysicsSystem,
  Input,
  CollisionSensor,
  CollisionSensorSystem,
  type BodyOptions,
} from '@/assets/emerald'
import { Graphics } from 'pixi.js'
import { BodyDumpSystem, TestSystem } from './systems'
import type { InputAction } from './types'

class DemoScene extends Scene {
  systems: System[] = [
    new PhysicsSystem({ iterations: 8, debug: { rendersCollisions: true } }),
    new CollisionSensorSystem(),
    new BodyDumpSystem(),
    new TestSystem(),
  ]

  inputMap: Record<InputAction, Input.Control> = {
    jump: Input.Control.keyboard('Space'),
    move_right: Input.Control.keyboard('ArrowRight'),
    move_left: Input.Control.keyboard('ArrowLeft'),
    spawn_entity: Input.Control.pointer('pointerdown'),
  }

  constructor() {
    super('demo')
  }

  build(world: World): void {
    const groundOptions: Partial<BodyOptions> = {
      isStatic: true,
      layer: 1,
      // restitution: 0,
      // friction: {
      //   static: 1,
      //   dynamic: 1,
      // },
    }
    world
      .createSimpleEntity(
        new Body(Collider.Shape.rectangle(0, 0, Screen.width - 100, 100), {
          ...groundOptions,
          position: { x: 50, y: Screen.height - 50 },
        }),
      )
      .tag('ground')
      .addChild(new Graphics().rect(0, 0, Screen.width - 100, 100).fill({ color: 0x000000 }))

    world
      .createSimpleEntity(
        new Body(Collider.Shape.rectangle(0, 0, 200, 100), {
          ...groundOptions,
          position: { x: Screen.width / 3, y: 400 },
          rotation: -Math.PI / 4,
        }),
      )
      .tag('ground')
      .addChild(new Graphics().rect(0, 0, 200, 100).fill({ color: 0x000000 }))

    world
      .createSimpleEntity(
        new CollisionSensor(
          Collider.Shape.rectangle(-Screen.width, Screen.height * 1.25, Screen.width * 3, 200),
        ),
      )
      .tag('dump')

    // world
    //   .createSimpleEntity(
    //     new Body(Collider.circle(0, 0, 25), {
    //       layer: 1,
    //       position: { x: Screen.width / 2, y: Screen.height / 2 },
    //       rotation: Math.PI / 4,
    //       // restitution: 0.5,
    //       // friction: {
    //       //   static: 0,
    //       //   dynamic: 0,
    //       // },
    //     }),
    //   )
    //   .tag('player')
    //   .addChild(new Graphics().circle(0, 0, 25).fill({ color: 0xffffff }))
  }
}

export const game = new Game({ isPaused: false }, [new DemoScene()])
