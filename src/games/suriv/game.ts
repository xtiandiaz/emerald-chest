import { GameApp, type GameState } from '@/assets/emerald/game'
import { GestureSystem, PhysicsSystem } from '@/assets/emerald/systems'
import type { Disconnectable, SignalBus } from '@/assets/emerald/core'
import { DemoScene } from './scenes'
import { ItemCollected } from './signals'
import { type Ref } from 'vue'

export interface SurivState extends GameState {
  score: Ref<number>
}

export class Suriv extends GameApp<SurivState> {
  protected systems = [new GestureSystem(), new PhysicsSystem()]

  constructor(state: SurivState) {
    super(state, [new DemoScene()])
  }

  connect(sb: SignalBus): Disconnectable[] {
    return [
      sb.connect(ItemCollected, (s) => {
        this.state.score.value += s.score
      }),
    ]
  }
}
