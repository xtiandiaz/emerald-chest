import { Game } from '@emerald'
import type { LedComponents } from './components'
import type { LedSignals } from './signals'

export interface LedState extends Game.State {}

export class Led extends Game<LedComponents, LedSignals, LedState> {}
