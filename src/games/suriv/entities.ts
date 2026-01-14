import { Graphics, TilingSprite, type PointData } from 'pixi.js'
import {
  Entity,
  Screen,
  Collider,
  Tweener,
  type BezierCurve,
  BEZIER_CIRCLE_CP_LENGTH as CP_LEN,
  GestureTarget,
  GestureKey,
} from '@/assets/emerald'
import { Color } from './values'
import { CollisionSensor } from '@/assets/emerald/components/CollisionSensor'
import { createCircleBezierCurves } from './utils'

export class Grid extends Entity {
  private tSprite = TilingSprite.from('grid')

  init(): void {
    this.tSprite.tint = Color.Energy
    this.tSprite.alpha = 0.25
    this.addChild(this.tSprite)
  }

  resize() {
    this.tSprite.width = Screen.width
    this.tSprite.height = Screen.height
    this.rescale()
  }

  rescale() {
    const vUnits = 4.5
    const tileSize = Screen.height / vUnits
    const tileScale = tileSize / this.tSprite.texture.height
    this.tSprite.tileScale = tileScale
    this.tSprite.tilePosition = {
      x: (Screen.width % tileSize) * 0.5,
      y: (Screen.height % tileSize) * 0.5,
    }
  }
}

export class Player extends Entity {
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

    this.addComponent(
      new CollisionSensor(Collider.Shape.circle(0, 0, 20)),
      new GestureTarget([GestureKey.Drag]),
    )
  }

  redraw(factor: number): void {
    const g = this.graphics
    g.clear()

    this.curves[2]!.p.x = this.curves[2]!.c1.x = this.curves[3]!.c0.x = -this.radius * factor
    this.curves[2]!.c1.y = (this.radius * CP_LEN) / factor
    this.curves[3]!.c0.y = (-this.radius * CP_LEN) / factor

    g.moveTo(this.curvesStartPoint.x, this.curvesStartPoint.y)

    for (const c of this.curves) {
      g.bezierCurveTo(c.c0.x, c.c0.y, c.c1.x, c.c1.y, c.p.x, c.p.y)
    }
    g.stroke({ width: 5, color: Color.Energy })
  }
}

export class Collectable extends Entity {
  private graphics = new Graphics()
    .roundPoly(0, 0, 12, 5, 2)
    .stroke({ width: 3, color: Color.Energy })

  init(): void {
    this.tag('collectable')

    this.addChild(this.graphics)

    this.addComponent(new CollisionSensor(Collider.Shape.circle(0, 0, 10)))

    Tweener.shared
      .timeline()
      .to(this.graphics, {
        pixi: { rotation: 45 },
        startAt: { pixi: { rotation: -45 } },
        ease: 'power3.inOut',
        duration: 1,
      })
      .to(this.graphics, { pixi: { rotation: -45 }, ease: 'power3.inOut', duration: 1 })
      .repeat(-1)
  }
}

// const eR = 25
// const eM = { w: eR * 1.5, h: eR * 2 }
// const enemySPs = (offset: Point = new Point()): RoundedPoint[] => {
//   return [
//     [0, -eM.h / 2],
//     [eM.w / 2, eM.h / 2],
//     [0, eM.h / 3],
//     [-eM.w / 2, eM.h / 2],
//   ].map(([x, y]) => ({ x: x! + offset.x, y: y! + offset.y, radius: 2 }))
// }

// export function createEnemy(): Entity {
//   const e = new Entity()
//   e.label = 'enemy'
//   e.addChild(new Graphics().roundShape(enemySPs(), eR).fill(0x000000))
//   e.position.set(200, 200)

//   // const pc = e.addComponent(new RigidBody(200, 200))
//   // pc.gravity.set(0, 0)

//   e.addComponent(Collider.polygon(...enemySPs().flatMap((p) => [p.x, p.y]))).layer =
//     CollisionLayer.Enemy

//   return e
// }
