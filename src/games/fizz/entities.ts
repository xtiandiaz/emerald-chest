import { Graphics, Point, type PointData } from 'pixi.js'
import {
  type Stage,
  type VectorData,
  Collider,
  Collision,
  Entity,
  RigidBody,
  Screen,
  RayCast,
  type BezierCurve,
  BEZIER_CIRCLE_CP_LENGTH as CP_LEN,
  EMath,
  Vector,
} from '@emerald'
import type { FizzComponents } from './components'
import { FizzCollisionLayer, FizzColor, type Face } from './types'
import gsap from 'gsap'
import { createCircleBezierCurves } from './utils'

export class Player extends Entity<FizzComponents> {
  readonly radius = 20

  curvesStartPoint!: PointData
  curves!: BezierCurve[]

  private graphics = new Graphics()

  init(): void {
    this.tag('player')

    this.curvesStartPoint = { x: 0, y: -this.radius }
    this.curves = createCircleBezierCurves(this.curvesStartPoint, this.radius)
    this.position.set(Screen.width / 2, Screen.height / 2)

    this.addChild(this.graphics)

    this.addComponents({
      collider: Collider.circle(this.radius, {
        layer: FizzCollisionLayer.PLAYER,
      }),
      'ray-cast': new RayCast([
        'is-grounded',
        Collision.ray(new Point(), new Point(0, 1), 200, FizzCollisionLayer.BOUND),
      ]),
      'player-control-state': {
        playerPos: {
          start: this.position.clone(),
          target: this.position.clone(),
          delta: new Vector(),
        },
      },
    })

    this.draw(1)
  }

  draw(elongationFactor: number): void {
    elongationFactor = EMath.clamp(elongationFactor, 1, 2)

    const g = this.graphics
    g.clear()

    this.curves[2]!.p.x =
      this.curves[2]!.c1.x =
      this.curves[3]!.c0.x =
        -this.radius * elongationFactor
    this.curves[2]!.c1.y = (this.radius * CP_LEN) / elongationFactor
    this.curves[3]!.c0.y = (-this.radius * CP_LEN) / elongationFactor

    g.moveTo(this.curvesStartPoint.x, this.curvesStartPoint.y)

    for (const c of this.curves) {
      g.bezierCurveTo(c.c0.x, c.c0.y, c.c1.x, c.c1.y, c.p.x, c.p.y)
    }
    g.stroke({ width: 4, color: FizzColor.PLAYER }).fill({ color: FizzColor.PLAYER, alpha: 0.1 })
  }
}

export function createCollectible(stage: Stage<FizzComponents>) {
  const radius = 16
  const padding = radius * 2

  stage
    .createSimpleEntity({
      tag: 'collectible',
      position: {
        x: padding + Math.random() * (Screen.width - 2 * padding),
        y: padding + Math.random() * (Screen.height - 2 * padding),
      },
      scale: { x: 0, y: 0 },
      children: [
        new Graphics()
          .roundPoly(0, 0, radius, 5, 4)
          .fill({ color: FizzColor.PLAYER, alpha: 0.1 })
          .stroke({ color: FizzColor.PLAYER, width: 3 }),
      ],
      onInit: (container) => {
        gsap.to(container, { pixi: { scale: 1 } })
        gsap
          .timeline()
          .to(container, {
            pixi: { rotation: 45 },
            startAt: { pixi: { rotation: -45 } },
            ease: 'power3.inOut',
            duration: 1,
          })
          .to(container, { pixi: { rotation: -45 }, ease: 'power3.inOut', duration: 1 })
          .repeat(-1)
      },
    })
    .addComponents({
      collider: Collider.circle(12, {
        layer: FizzCollisionLayer.COLLECTIBLE,
      }),
    })
}

export function createFoe(stage: Stage<FizzComponents>, edge: number) {
  const radius = 40
  const padding = -100
  const position: PointData = {
    x: edge % 2 == 0 ? Screen.width / 2 : edge % 4 == 1 ? Screen.width - padding : padding,
    y: edge % 2 == 0 ? (edge % 4 == 0 ? padding : Screen.height - padding) : Screen.height / 2,
  }
  const rotation = (((edge % 4) + 1) * Math.PI) / 2

  stage
    .createSimpleEntity({
      tag: 'foe',
      position,
      rotation,
      children: [
        new Graphics()
          .roundPoly(0, 0, radius, 3, 16, Math.PI / 2)
          .fill({ color: FizzColor.FOE, alpha: 0.1 })
          .stroke({ color: FizzColor.FOE, width: 4 }),
      ],
    })
    .addComponents({
      collider: Collider.regularPolygon(radius, 3, { layer: FizzCollisionLayer.FOE }),
      'rigid-body': new RigidBody({
        isKinematic: true,
      }),
      'foe-attributes': { radius },
      'foe-state': { linearSpeed: 2, angularSpeed: 0.25, lastShotTimestamp: Date.now() },
      'ray-cast': new RayCast([
        'platform',
        Collision.ray(new Point(), new Point(0, 1), 200, FizzCollisionLayer.BOUND),
      ]),
    })
}

export function createBullet(
  stage: Stage<FizzComponents>,
  position: PointData,
  velocity: VectorData,
): Entity<FizzComponents> {
  return stage
    .createSimpleEntity({
      tag: 'bullet',
      position,
      rotation: Math.PI / 4,
      children: [new Graphics().circle(0, 0, 8).stroke({ color: FizzColor.FOE, width: 4 })],
    })
    .addComponents({
      collider: Collider.circle(8, {
        layer: FizzCollisionLayer.BULLET,
      }),
      'rigid-body': new RigidBody({
        isKinematic: true,
        initialVelocity: velocity,
        restitution: 1,
        friction: { static: 0, dynamic: 0 },
      }),
    })
}
