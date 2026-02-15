import { CameraSystem, PhysicsSystem, Scene, Screen } from '@emerald'
import type { LedComponents } from './components'
import type { LedSignals } from './signals'
import { createBounds } from '../entities.shared'
import { createForest, createPlayer } from './entities'
import { ControlsSystem } from './systems'
import { Assets, Rectangle } from 'pixi.js'
import { LedColor, LedCollisionLayer } from './types'

export class MainScene extends Scene<LedComponents, LedSignals> {
  constructor() {
    super(
      [
        new PhysicsSystem({ debug: { rendersColliders: false } }),
        new ControlsSystem(),
        new CameraSystem(),
      ],
      {
        bounds: new Rectangle(0, 0, Screen.width * 2, Screen.height * 4),
      },
    )
  }

  async load(): Promise<void> {
    await Assets.loadBundle('led')
  }

  build(): void {
    createBounds(this.boundsArea, this, {
      color: LedColor.FOREGROUND,
      thickness: Screen.height * 0.25,
      layer: LedCollisionLayer.PLATFORMS,
      restitution: 0,
      friction: {
        static: 0,
        dynamic: 1,
      },
    })

    createForest(this, { baseScale: 0.5, tint: LedColor.FOREGROUND_3 })
    createForest(this, { baseScale: 0.75, tint: LedColor.FOREGROUND_2 })
    createForest(this, { tint: LedColor.FOREGROUND })

    const player = createPlayer(this)

    this.setCurrentCamera(player.id)
  }

  async unload(): Promise<void> {
    await Assets.unloadBundle('led')
  }
}
//   systems: System[] = [
//     new PhysicsSystem({ iterations: 8, debug: { rendersCollisions: true } }),
//     new CollisionSensorSystem({ usesOnlyAABBIntersectionForCollisionDetection: true }),
//     new BodyDumpSystem(),
//     // new TestSystem(),
//     new ControlSystem(),
//   ]

//   inputMap: Record<InputAction, Input.Control> = {
//     jump: Input.Control.keyboard('Space'),
//     move_right: Input.Control.keyboard('ArrowRight'),
//     move_left: Input.Control.keyboard('ArrowLeft'),
//     spawn_entity: Input.Control.pointer('pointerdown'),
//   }

//   constructor() {
//     super('demo')
//   }

//   build(world: World): void {
//     const groundOptions: Partial<BodyOptions> = {
//       isStatic: true,
//       layer: 1,
//       // restitution: 0.5,
//       friction: {
//         dynamic: 1,
//       },
//     }
//     world
//       .createSimpleEntity(
//         new Body(Collider.Shape.rectangle(Screen.width - 100, 100), {
//           ...groundOptions,
//           position: { x: Screen.width / 2, y: Screen.height },
//         }),
//       )
//       .tag('ground')

//     world.createSimpleEntity(
//       new Body(Collider.Shape.rectangle(400, 100), {
//         ...groundOptions,
//         position: { x: Screen.width / 3, y: 350 },
//         rotation: -Math.PI / 4,
//       }),
//     )
//     // .tag('ground')

//     world
//       .createSimpleEntity(new CollisionSensor(Collider.Shape.rectangle(Screen.width * 3, 200)))
//       .tag('dump')
//       .position.set(0, Screen.height * 1.25)

//     world
//       .createSimpleEntity(
//         new Body(Collider.Shape.circle(40), {
//           // isKinematic: true,
//           layer: 1,
//           position: { x: Screen.width / 2, y: Screen.height / 2 },
//           // angularDrag: 0.5,
//           friction: {
//             dynamic: 1,
//             static: 0,
//           },
//         }),
//       )
//       .tag('player')
//       .addChild(new Graphics().circle(0, 0, 40).fill({ color: 0x000000 }))
//   }
// }
