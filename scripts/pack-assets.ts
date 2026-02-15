import { AssetPack, type AssetPackConfig } from '@assetpack/core'
import { pixiPipes } from '@assetpack/core/pixi'
import fs from 'fs/promises'

const config: AssetPackConfig = {
  entry: './src/assets/games',
  output: './public/assets/',
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

async function prefixAssetsSrc() {
  const path = `${config.output!}/manifest.json`
  const data = await fs.readFile(path, 'utf-8')
  const json = JSON.parse(data)
  for (const bundle of json.bundles) {
    for (const asset of bundle.assets) {
      asset.src = asset.src.map((s: string) => `./assets/${s}`)
    }
  }
  await fs.writeFile(path, JSON.stringify(json))
}

;(async () => {
  const pack = new AssetPack(config)
  await pack.run()
  await prefixAssetsSrc()
})()
