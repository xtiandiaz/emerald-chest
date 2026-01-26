// import { Assets } from 'pixi.js'
// import {
//   CollisionSensorSystem,
//   DragGestureTracker,
//   GestureKey,
//   GestureTarget,
//   Scene,
//   World,
// } from '@/assets/emerald'
// import { CollectablesSystem, PlayerControlSystem, PlayerMorphing, Resizing } from './systems'
// import { Grid, Player } from './entities'

// export class DemoScene extends Scene {
//   systems = [
//     new CollisionSensorSystem(),
//     new PlayerMorphing(),
//     new Resizing(),

//     new PlayerControlSystem(),
//     new CollectablesSystem(),
//   ]
//   inputMap = undefined
//   private draggingTracker = new DragGestureTracker()

//   constructor() {
//     super('demo')
//   }

//   async load(): Promise<void> {
//     Assets.addBundle('all', [{ alias: 'grid', src: '/suriv/textures/grid.png' }])

//     await Assets.loadBundle('all')
//   }

//   build(world: World): void {
//     world.createEntity(Grid)

//     world.createEntity(Player)
//   }

//   deinit(): void {
//     super.deinit()

//     this.draggingTracker.deinit()
//   }
// }
