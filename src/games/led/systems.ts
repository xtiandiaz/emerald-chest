// import {
//   Body,
//   System,
//   World,
//   Collider,
//   Input,
//   CollisionSensor,
//   Randomness,
//   Vector,
//   type SignalBus,
//   isNearlyEqual,
//   Physics,
//   ExtraMath,
// } from '@/assets/emerald'
// import { type PointData } from 'pixi.js'
// import { InputAction } from './types'

// export class BodyDumpSystem extends System {
//   fixedUpdate(world: World, signalBus: SignalBus, dT: number): void {
//     const sensors = world.getEntitiesByTag('dump').map((e) => e.getComponent(CollisionSensor)!)
//     for (const sensor of sensors) {
//       sensor.collidedIds.forEach((id) => world.removeEntity(id))
//     }
//   }
// }

// interface PlayerState {
//   targetSpeed: number
//   _speed: number
//   _isGrounded: boolean
// }
// export class ControlSystem extends System {
//   player!: Body
//   state: PlayerState = { targetSpeed: 0, _speed: 0, _isGrounded: false }

//   init(world: World, signalBus: SignalBus): void {
//     this.player = world.getEntitiesByTag('player')[0]!.getComponent(Body)!
//   }

//   update(world: World, signalBus: SignalBus, dT: number): void {
//     this.state._speed += (this.state.targetSpeed - this.state._speed) / 10
//   }

//   fixedUpdate(world: World, signalBus: SignalBus, dT: number): void {
//     this.state._isGrounded =
//       [...this.player.collidedIds].findIndex((id) => world.getEntityTag(id) == 'ground') != -1
//     // this.state._drag = this.state._isGrounded ? 0.95 : 0

//     if (Math.abs(this.state.targetSpeed) > 0) {
//       this.player.velocity.x = this.state._speed
//       this.player.setDrag({ x: 0 })
//     } else if (this.state._isGrounded) {
//       this.player.setDrag({ x: 0.25 })
//     }
//   }

//   onInput(signal: Input.Signal<any>, world: World): void {
//     if (signal instanceof Input.KeyboardSignal) {
//       switch (signal.action) {
//         case InputAction.JUMP:
//           if (signal.isKeyDown && !signal.isRepeated) {
//             this.player.applyForce({ x: 0, y: -25 })
//           }
//           break
//         case InputAction.MOVE_LEFT:
//         case InputAction.MOVE_RIGHT:
//           this.state.targetSpeed = signal.isKeyDown
//             ? ControlSystem.MAX_SPEED * (signal.action == InputAction.MOVE_LEFT ? -1 : 1)
//             : 0
//           if (signal.isKeyDown && !signal.isRepeated) {
//             this.player.angularVelocity = 0
//           }
//           break
//       }
//     }
//   }
// }
// export namespace ControlSystem {
//   export const MAX_SPEED = 20
//   export const JUMP_VELOCITY = -25
//   export const TERMINAL_FALLING_VELOCITY = 25
// }

// export class TestSystem extends System {
//   latestSpawnedId?: number
//   spawnsPolygon = true

//   init(world: World, signalBus: SignalBus): void {
//     this.connections.push(
//       Input.connectDocumentEvent('keydown', (e) => {
//         switch (e.code) {
//           case 'Digit1':
//             this.spawnsPolygon = true
//             break
//           case 'Digit2':
//             this.spawnsPolygon = false
//             break
//         }
//       }),
//     )
//   }

//   onInput(signal: Input.Signal<any>, world: World): void {
//     switch (signal.source) {
//       case Input.Source.KEYBOARD:
//         const body = this.latestSpawnedId
//           ? world.getComponent(this.latestSpawnedId, Body)
//           : undefined
//         if (!body) break
//         switch (signal.action) {
//           case InputAction.JUMP:
//             body.applyForce({ x: 0, y: -2 }, body.transform.position)
//             break
//           case InputAction.MOVE_RIGHT:
//             body.velocity.x = 10
//             break
//           case InputAction.MOVE_LEFT:
//             body.velocity.x -= 10
//             break
//         }
//         break
//       case Input.Source.POINTER:
//         const pointerSignal = signal as Input.PointerSignal
//         this.latestSpawnedId = this.spawnEntity(world, world.toLocal(pointerSignal.event.global))
//         break
//     }
//   }

//   private spawnEntity(world: World, position: PointData) {
//     if (this.spawnsPolygon) {
//       return this.createPolygon(world, position)
//     } else {
//       return this.createCircle(world, position)
//     }
//   }

//   private createPolygon(world: World, position: PointData) {
//     const w = 40 + Math.random() * 120
//     const h = 40 + Math.random() * 120
//     const r = 20 + Math.random() * 60
//     const sides = Randomness.randomInteger(3, 8)

//     return world.createSimpleEntity(
//       new Body(
//         sides == 4
//           ? Collider.Shape.rectangle(-w / 2, -h / 2, w, h)
//           : Collider.Shape.regularPolygon(sides, r),
//         {
//           position,
//           // scale: 2,
//           // rotation: Math.random() * Math.PI,
//           // restitution: 0,
//           // friction: {
//           //   static: 1,
//           //   dynamic: 1,
//           // },
//         },
//       ),
//     ).id
//   }

//   private createCircle(world: World, position: PointData) {
//     const r = 15 + Math.random() * 85

//     return world.createSimpleEntity(
//       new Body(Collider.Shape.circle(0, 0, r), {
//         position,
//         scale: 2,
//         // restitution: 1,
//         // friction: {
//         //   static: 0,
//         //   dynamic: 0,
//         // },
//         angularDrag: 0.15,
//       }),
//     ).id
//   }
// }
