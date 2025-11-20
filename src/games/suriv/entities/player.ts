import { Movement } from '../components/Movement'
import { Blob } from './blob'

export class Player extends Blob {
  movement = new Movement()

  constructor() {
    super(0xffffff)
  }

  init(): void {
    super.init()

    this.movement.init()

    this.addComponent(this.movement)
  }
}
