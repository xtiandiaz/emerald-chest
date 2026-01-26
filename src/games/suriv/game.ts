// import { type Disconnectable, type SignalBus } from '@/assets/emerald/core'
// import { Game, type GameState } from '@/assets/emerald/game'
// import { DemoScene } from './scenes'
// import { ItemCollected } from './signals'
// import { type Ref } from 'vue'

// export interface SurivState extends GameState {
//   score: Ref<number>
// }

// export class Suriv extends Game<SurivState> {
//   constructor(state: SurivState) {
//     super(state, [new DemoScene()])
//   }

//   connect(sb: SignalBus): Disconnectable[] {
//     return [
//       sb.connect(ItemCollected, (s) => {
//         this.state.score.value += s.score
//       }),
//     ]
//   }
// }
