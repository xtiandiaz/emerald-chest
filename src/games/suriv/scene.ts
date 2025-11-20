import { Scene } from '@/assets/emerald/core/scene'
import { Player } from './entities/player'
import grid from './entities/grid'

const scene = new Scene()

const player = new Player()

scene.onInit = (s) => {
  grid.init()
  player.init()

  s.addEntity(grid)
  s.addEntity(player)
}

scene.onStart = (s) => {
  player.position.set(s.bounds.width / 2, s.bounds.height / 2)
  player.scale = 1

  s.stage.interactive = true

  s.stage.on('mousemove', (e) => {
    const localPos = e.getLocalPosition(s.stage)
    player.movement.destination = localPos
  })

  // s.stage.on('click', () => {
  //   Tweener.main.to(player, { scaleX: 2, scaleY: 2 }, 'ease.out', 1).vars.onComplete = () => {
  //     console.log('done')
  //   }
  // })
}

export default scene
