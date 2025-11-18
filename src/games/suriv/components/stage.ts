import { Component } from '@/assets/emerald/core/component'
import { Graphics } from 'pixi.js'

const stage = new Component()
const g = new Graphics()

stage.onInit = (c) => {
  c.addChild(g)
}

stage.onDraw = (_, r) => {
  g.rect(r.x, r.y, r.width, r.height)
  g.fill('0x272c4f')
}

export default stage
