import type { FederatedPointerEvent, Point } from 'pixi.js'
import {
  type Disconnectable,
  System,
  Vector,
  Screen,
  Stage,
  Entity,
  Collision,
  EMath,
} from '@emerald'
import { createBullet, createCollectible, Player } from './entities'
import type { FizzComponents, PlayerControlState } from './components'
import type { FizzSignals } from './signals'
import { FizzCollisionLayer } from './types'

export namespace FizzSystems {
  const DodgeSystem = System<FizzComponents, FizzSignals>

  export class PlayerControls extends DodgeSystem {
    private player!: Player
    private state!: PlayerControlState
    private elongFactor = 1

    init(stage: Stage<FizzComponents>, toolkit: System.InitToolkit<FizzSignals>): Disconnectable[] {
      this.player = stage.getFirstEntityByType(Player)!
      this.state = this.player.getComponent('player-control-state')!

      return [
        toolkit.input.connectContainerEvent('pointerdown', (e) => this.handlePointerInput(e)),
        toolkit.input.connectContainerEvent('globalpointermove', (e) => this.handlePointerInput(e)),
        toolkit.input.connectContainerEvent('pointerup', (e) => this.handlePointerInput(e)),
      ]
    }

    update(
      stage: Stage<FizzComponents>,
      toolkit: System.UpdateToolkit<FizzSignals>,
      dT: number,
    ): void {
      const ease = 0.1 * dT
      const deltaPos = this.state.playerPos.target.subtract(this.player.position)
      this.player.position.x += deltaPos.x * ease
      this.player.position.y += deltaPos.y * ease

      let nextRot: number
      if (this.state.playerPos.delta.x == 0) {
        nextRot = EMath.sign(this.state.playerPos.delta.y) * Math.PI * 0.5
      } else {
        nextRot =
          Math.atan(this.state.playerPos.delta.y / this.state.playerPos.delta.x) +
          (this.state.playerPos.delta.x < 0 ? Math.PI : 0)
      }
      this.player.rotation = nextRot

      const nextElongFactor = deltaPos.magnitude() / 50
      this.elongFactor += (nextElongFactor - this.elongFactor) * ease
      this.player.draw(this.elongFactor)
    }

    // TODO Refactor all this into a kind of 'movement state machine'!!

    private handlePointerInput(e: FederatedPointerEvent) {
      switch (e.type) {
        case 'pointerdown':
          this.state.playerPos.start.copyFrom(this.player.position)
          this.state.playerPos.target.copyFrom(this.player.position)
          this.state.playerPos.delta.set(0, 0)
          this.state.controlStartPoint = e.global.clone()
          break

        case 'pointermove':
          if (!this.state.controlStartPoint) {
            break
          }
          const scaledDeltaPos = e.global.subtract(this.state.controlStartPoint).multiplyScalar(3)
          const targetPos = this.state.playerPos.start.add(scaledDeltaPos)
          if (targetPos.x <= 0 || targetPos.x >= Screen.width) {
            this.state.controlStartPoint.x = e.globalX
            this.state.playerPos.start.x = EMath.clamp(targetPos.x, 0, Screen.width)
          }
          if (targetPos.y <= 0 || targetPos.y >= Screen.height) {
            this.state.controlStartPoint!.y = e.globalY
            this.state.playerPos.start.y = EMath.clamp(targetPos.y, 0, Screen.height)
          }

          const padding = this.player.radius

          this.state.playerPos.target.set(
            EMath.clamp(targetPos.x, padding, Screen.width - padding),
            EMath.clamp(targetPos.y, padding, Screen.height - padding),
          )

          this.state.playerPos.target.subtract(this.player.position, this.state.playerPos.delta)
          break

        case 'pointerup':
          this.state.controlStartPoint = undefined
          break
      }
    }
  }

  export class Spawning extends DodgeSystem {
    init(stage: Stage<FizzComponents>, toolkit: System.InitToolkit<FizzSignals>): Disconnectable[] {
      return [
        toolkit.signals.connect('item-collected', () => {
          createCollectible(stage)
        }),
      ]
    }
  }

  export class Chasing extends DodgeSystem {
    fixedUpdate(
      stage: Stage<FizzComponents>,
      toolkit: System.UpdateToolkit<FizzSignals>,
      dT: number,
    ): void {
      const player = stage.getFirstEntityByTag('player')
      if (!player) {
        return
      }
      const foes = stage.getEntitiesByTag('foe')
      let direction = new Vector()
      let rotationDir = 0
      let currentAngle = 0
      let targetAngle = 0
      let angleDiff = 0

      for (const foe of foes) {
        const foeBody = foe.getComponent('rigid-body')!
        const foeState = foe.getComponent('foe-state')!

        player.position.subtract(foeBody.position, direction).normalize(direction)
        currentAngle = foeBody.rotation
        targetAngle = Math.acos(direction.x)
        if (direction.y < 0) {
          targetAngle = 2 * Math.PI - targetAngle
        }
        angleDiff = targetAngle - currentAngle
        if (Math.abs(angleDiff) > Math.PI) {
          angleDiff += (targetAngle < currentAngle ? 1 : -1) * 2 * Math.PI
        }
        rotationDir = EMath.sign(angleDiff)

        foeBody.rotation += rotationDir * foeState.angularSpeed * dT

        foeBody.velocity.set(
          foeState.linearSpeed * Math.cos(foeBody.rotation),
          foeState.linearSpeed * Math.sin(foeBody.rotation),
        )
      }
    }
  }

  export class Shooting extends DodgeSystem {
    fixedUpdate(
      stage: Stage<FizzComponents>,
      toolkit: System.UpdateToolkit<FizzSignals>,
      dT: number,
    ): void {
      const foe = stage.getFirstEntityByTag('foe')
      if (!foe) {
        return
      }
      const now = Date.now()
      const state = foe.getComponent('foe-state')!
      if (now - state.lastShotTimestamp < 5000) {
        return
      }
      const body = foe.getComponent('rigid-body')!
      const ray = Collision.ray(
        foe.position,
        body.direction,
        Screen.width * 0.5,
        FizzCollisionLayer.PLAYER,
      )
      const radius = foe.getComponent('foe-attributes')!.radius
      if (toolkit.rayCaster.cast(ray)) {
        createBullet(
          stage,
          foe.position.add(body.direction.multiplyScalar(radius)),
          body.velocity.multiplyScalar(1.5),
        )
        state.lastShotTimestamp = now
      }
    }
  }

  export class Interaction extends DodgeSystem {
    fixedUpdate(
      stage: Stage<FizzComponents>,
      toolkit: System.UpdateToolkit<FizzSignals>,
      dT: number,
    ): void {
      const playerId = stage.getFirstEntityByTag('player')?.id
      if (!playerId) {
        return
      }
      const playerCollider = stage.getComponent('collider', playerId)
      playerCollider?.collisions.forEach((_, colliderId) => {
        switch (stage.getEntityTag(colliderId)) {
          case 'collectible':
            stage.removeEntity(colliderId)
            toolkit.signals.emit('item-collected', { points: 1 })
            break
          case 'foe':
          case 'bullet':
            stage.removeEntity(playerId)
            break
        }
      })
    }
  }

  export class Difficulty extends DodgeSystem {
    init(stage: Stage<FizzComponents>, toolkit: System.InitToolkit<FizzSignals>): Disconnectable[] {
      return [
        toolkit.signals.connect('item-collected', (_) => {
          stage.getEntityComponents('foe-state').forEach(({ component: fs }) => {
            fs.linearSpeed += 0.1
            fs.angularSpeed += 0.01
          })
        }),
      ]
    }
  }
}
