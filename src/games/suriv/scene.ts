import { Tweener } from '@/assets/emerald/core/tweener'
import { Scene } from '@/assets/emerald/core/scene'
import { Blob } from './components/blob'
import stage from './components/stage'

const scene = new Scene()

const player = new Blob(0xffffff)

scene.onInit = (s) => {
  s.addEntity(stage)
  s.addEntity(player)
}

scene.onStart = (s) => {
  player.position.set(s.viewport.width / 2, s.viewport.height / 2)
  player.scale = 1

  s.stage.interactive = true

  s.stage.on('globalpointermove', (e) => {
    const localPos = e.getLocalPosition(s.stage)
    player.position = localPos
  })

  s.stage.on('click', () => {
    Tweener.main.to(player, { scaleX: 2, scaleY: 2 }, 'ease.out', 1).vars.onComplete = () => {
      console.log('done')
    }
  })
}

export default scene
