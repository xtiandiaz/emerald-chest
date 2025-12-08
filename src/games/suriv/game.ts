import { GameApp, type GameState } from '@/assets/emerald/game'
import { DemoScene } from './scenes'
import { GestureSystem, PhysicsSystem } from '@/assets/emerald/systems'

class Suriv extends GameApp {
  protected systems = [
    new GestureSystem(),
    new PhysicsSystem({
      gravity: {
        y: 0,
      },
    }),
  ]
}

const state: GameState = {
  isPaused: false,
}

export default new Suriv(state, [new DemoScene()])
