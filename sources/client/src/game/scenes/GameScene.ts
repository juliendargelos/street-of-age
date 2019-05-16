import BaseScene from '@/game/scenes/BaseScene'
import { Character } from '@/game/entities/Character'

const HEIGHT_CAMERA_OFFSET = 200
const WIDTH_CAMERA_OFFSET = 400

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
      texture: 'main',
      frame: 'main/characters/fraicheur/walking_00001',
      x: 120,
      y: 200
    })
    this.physics.add.collider(this.character, this.level.floors)
    this.physics.add.collider(this.character, this.level.colliders)
    this.cameras.main.setRoundPixels(true)
    const { x, width } = this.level.bounds
    this.cameras.main.setBounds(0, -HEIGHT_CAMERA_OFFSET, width + WIDTH_CAMERA_OFFSET, this.game.scale.height + HEIGHT_CAMERA_OFFSET)
    this.cameras.main.startFollow(this.character, false, 0.1, 0.1)
  }

  public update = (time: number, delta: number) => {
    super.update(time, delta)
    this.character.update()
  }
}
