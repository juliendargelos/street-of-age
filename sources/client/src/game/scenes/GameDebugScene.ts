import BaseScene from '@/game/scenes/BaseScene'
import { Character } from '@/game/entities/Character'

export class GameDebugScene extends BaseScene {
  constructor () {
    super({
      key: 'GAME_DEBUG_SCENE'
    })
  }

  public create = () => {
    super.create()
    this.character = new Character({
      scene: this,
      texture: 'character',
      x: 120,
      y: 200
    })
    this.physics.add.collider(this.character, this.level.floors)
    this.cameras.main.setBounds(0, 0, 1800, this.game.scale.height)
    this.cameras.main.startFollow(this.character)
  }

  public update = (time: number, delta: number) => {
    super.update(time, delta)
    this.character.update()
  }
}
