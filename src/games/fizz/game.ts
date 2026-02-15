import { Assets } from 'pixi.js'
import { Game, type Disconnectable, type Signals } from '@emerald'
import type { FizzComponents } from './components'
import type { FizzSignals } from './signals'

export interface FizzState extends Game.State {
  isOver: boolean
  score: number
  bestScore?: number
}

export class Fizz extends Game<FizzComponents, FizzSignals, FizzState> {
  async load(): Promise<void> {
    await Assets.init({ manifest: `${import.meta.env.BASE_URL}/assets/manifest.json` })
  }

  connect(signals: Signals.Bus<FizzSignals>, state: FizzState): Disconnectable[] {
    return [
      signals.connect('item-collected', (s) => {
        state.score += s.points
      }),
      signals.connect('entity-removed', (s) => {
        state.isOver = s.tag == 'player'
      }),
    ]
  }
}
