import type { Component, Components, Vector } from '@emerald'
import type { Point } from 'pixi.js'

export interface PlayerControlState extends Component {
  playerPos: {
    start: Point
    target: Point
    delta: Vector
  }
  controlStartPoint?: Point
}

export interface FoeAttributes extends Component {
  radius: number
}
export interface FoeState extends Component {
  linearSpeed: number
  angularSpeed: number
  lastShotTimestamp: number
}

export interface FizzComponents extends Components {
  'foe-attributes': FoeAttributes
  'foe-state': FoeState
  'player-control-state': PlayerControlState
}
