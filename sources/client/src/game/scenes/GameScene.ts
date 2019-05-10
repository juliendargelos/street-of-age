import BaseScene from '@/game/scenes/BaseScene'
import { Character } from '@/game/entities/Character'

const HEIGHT_CAMERA_OFFSET = 200

export class GameScene extends BaseScene {
  constructor () {
    super({
      key: 'GAME_SCENE'
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
    this.physics.add.collider(this.character, this.level.bodies)
    this.cameras.main.setBounds(0, -HEIGHT_CAMERA_OFFSET, 1800, this.game.scale.height + HEIGHT_CAMERA_OFFSET)
    this.cameras.main.startFollow(this.character)
  }

  public update = (time: number, delta: number) => {
    super.update(time, delta)
    this.character.update()
  }
}
