// import {
//   Body,
//   Scene,
//   System,
//   World,
//   Screen,
//   Collider,
//   PhysicsSystem,
//   Input,
//   CollisionSensor,
//   CollisionSensorSystem,
//   type BodyOptions,
// } from '@/assets/emerald'
// import { BodyDumpSystem, ControlSystem, TestSystem } from './systems'
// import type { InputAction } from './types'
// import { Graphics } from 'pixi.js'

import { Input, PhysicsSystem, Scene } from '@emerald'
import type { Bound } from '../types.shared'
import type { LedComponents } from './components'
import type { LedSignals } from './signals'
import { createBound } from '../entities.shared'
import { createPlayer } from './entities'
import { ControlsSystem } from './systems'
import type { LedActions } from './actions'

export class MainScene extends Scene<LedComponents, LedSignals, LedActions> {
  constructor() {
    super([new PhysicsSystem(), new ControlsSystem()])
  }

  build(): void {
    Array<Bound>('left', 'bottom', 'right').forEach((b) =>
      createBound(this, b, 1, { restitution: 0 }),
    )
    createPlayer(this)
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
