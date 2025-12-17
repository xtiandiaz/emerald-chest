import { type Disconnectable, type SignalBus } from '@/assets/emerald/core'
import { GameApp, type GameState } from '@/assets/emerald/game'
import { DemoScene } from './scenes'
import { ItemCollected } from './signals'
import { type Ref } from 'vue'
import type { ApplicationOptions } from 'pixi.js'

export interface SurivState extends GameState {
  score: Ref<number>
}

export class Suriv extends GameApp<SurivState> {
  constructor(state: SurivState) {
    super(state, [new DemoScene()])
  }

  async init(options: Partial<ApplicationOptions>): Promise<void> {
    await super.init(options)

    // this.stage.scale = 0.25
    // this.stage.position.x = Screen.width / 2
    // this.stage.position.y = Screen.height / 2
  }

  connect(sb: SignalBus): Disconnectable[] {
    return [
      sb.connect(ItemCollected, (s) => {
        this.state.score.value += s.score
      }),
    ]
  }
}
