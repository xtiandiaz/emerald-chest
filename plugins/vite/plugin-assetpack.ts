import { type Plugin, type ResolvedConfig } from 'vite'
import { AssetPack, type AssetPackConfig } from '@assetpack/core'
import { pixiPipes } from '@assetpack/core/pixi'

export default function assetpackPlugin(): Plugin {
  const packConfig: AssetPackConfig = {
    entry: './src/assets/games',
    // assetSettings: [],
    pipes: [
      ...pixiPipes({
        resolutions: { default: 1, low: 0.5 },
        compression: { png: true },
        texturePacker: {
          resolutionOptions: { maximumTextureSize: 2048 },
          texturePacker: {
            padding: 2,
            nameStyle: 'short',
          },
        },
        manifest: { createShortcuts: true },
      }),
    ],
  }
  let command: ResolvedConfig['command']
  let pack: AssetPack | undefined

  return {
    name: 'vite-plugin-assetpack',
    configResolved: (resolvedConfig) => {
      command = resolvedConfig.command
      if (!resolvedConfig.publicDir || packConfig.output) return
      packConfig.output = `.${resolvedConfig.publicDir.replace(process.cwd(), '')}/assets`
    },
    buildStart: async () => {
      switch (command) {
        case 'build':
          await new AssetPack(packConfig).run()
          break
        case 'serve':
          if (pack) return
          pack = new AssetPack(packConfig)
          pack.watch()
          break
      }
    },
    buildEnd: async () => {
      if (pack) {
        await pack.stop()
        pack = undefined
      }
    },
  }
}
