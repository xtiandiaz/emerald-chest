import { Game, Body, Scene, System, World, Screen, Collider } from '@/assets/emerald'
import { Graphics } from 'pixi.js'
import { TestSystem } from './systems'

class DemoScene extends Scene {
  systems: System[] = [new TestSystem()]

  constructor() {
    super('demo', {
      PPM: 10,
    })
  }

  build(world: World): void {
    world
      .createSimpleEntity(
        new Body(Collider.rectangle(0, 0, Screen.width - 100, 100), {
          isStatic: true,
          layer: 1,
          position: { x: 50, y: Screen.height - 50 },
        }),
      )
      .tag('ground')
      .addChild(new Graphics().rect(0, 0, Screen.width - 100, 100).fill({ color: 0x000000 }))

    world
      .createSimpleEntity(
        new Body(Collider.circle(0, 0, 25), {
          layer: 1,
          position: { x: Screen.width / 2, y: Screen.height / 2 },
          rotation: Math.PI / 4,
          restitution: 0.5,
          // isKinematic: true,
        }),
      )
      .tag('player')
      .addChild(new Graphics().circle(0, 0, 25).fill({ color: 0xffffff }))
  }
}

export const game = new Game({ isPaused: false }, [new DemoScene()])
