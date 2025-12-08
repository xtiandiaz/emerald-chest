import { Component, Vector } from '@/assets/emerald/core'

export enum PlayerControlMode {
  Free,
  Bounded,
}

export class PlayerComponent extends Component {
  constructor(public velocity: Vector = new Vector()) {
    super()
  }
}
export class EnemyComponent extends Component {
  constructor(public velocity: Vector = new Vector()) {
    super()
  }
}
