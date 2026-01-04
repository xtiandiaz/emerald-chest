import {
  connectDocumentEvent,
  connectContainerEvent,
  Body,
  System,
  World,
  Screen,
  type SignalBus,
  Collider,
} from '@/assets/emerald'
import { Graphics, Rectangle, type PointData } from 'pixi.js'

export class TestSystem extends System {
  init(world: World, signalBus: SignalBus): void {
    const player = world.getEntitiesByTag('player')[0]!
    const playerBody = player.getComponent(Body)!
    let inflation = 0

    world.interactive = true
    world.hitArea = new Rectangle(0, 0, Screen.width, Screen.height)
    this.connections.push(
      connectContainerEvent('pointerdown', world, (e) => {
        this.spawnEntity(world, e.global)
      }),
      connectDocumentEvent('keydown', (e) => {
        switch (e.code) {
          case 'ArrowLeft':
            playerBody.velocity.x = -10
            break
          case 'ArrowRight':
            playerBody.velocity.x = 10
            break
        }
      }),
      connectDocumentEvent('keypress', (e) => {
        switch (e.code) {
          case 'KeyI':
            inflation++
            playerBody.scale = 1 + (inflation % 4)
            break
          case 'Space':
            playerBody.force.y += -2
            break
        }
      }),
      connectDocumentEvent('keyup', (e) => {
        switch (e.code) {
          case 'ArrowLeft':
          case 'ArrowRight':
            playerBody.velocity.x = 0
            break
        }
      }),
    )
  }

  private spawnEntity(world: World, position: PointData) {
    world
      .createSimpleEntity(
        new Body(Collider.circle(0, 0, 25), {
          position,
          restitution: 0.5,
        }),
      )
      .addChild(new Graphics().circle(0, 0, 25).fill({ color: 0xff0000 }))
  }
}
