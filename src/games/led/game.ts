import { Assets } from 'pixi.js'
import { Game } from '@emerald'
import type { LedComponents } from './components'
import type { LedSignals } from './signals'

export interface LedState extends Game.State {}

export class Led extends Game<LedComponents, LedSignals, LedState> {
  async load(): Promise<void> {
    await Assets.init({ manifest: `${import.meta.env.BASE_URL}/assets/manifest.json` })
  }
}
