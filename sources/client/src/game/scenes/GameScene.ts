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
    this.cameras.main.setBackgroundColor(this.level.background.from)
    // TODO: Refacto this
    const canvasTexture = this.textures.createCanvas('buttonTexture', this.level.bounds.width + 1000, this.level.bounds.height)
    const src = canvasTexture.getSourceImage()
    // @ts-ignore
    const context = src.getContext('2d')
    const gradient = context.createLinearGradient(0, 0, 0, this.level.bounds.height / 2)
    gradient.addColorStop(0, this.level.background.from)
    gradient.addColorStop(1, this.level.background.to)
    context.fillStyle = gradient
    context.fillRect(0, 0, this.level.bounds.width + 1000, this.level.bounds.height)
    canvasTexture.refresh()
    this.add.image(-30, 0, 'buttonTexture')
      .setDepth(-1)
      .setOrigin(0, 0)
    this.physics.add.collider(this.character, this.level.floors)
    this.physics.add.collider(this.character, this.level.bodies)
    this.cameras.main.setRoundPixels(true)
    const { x, width } = this.level.bounds
    this.cameras.main.setBounds(x, -HEIGHT_CAMERA_OFFSET, width + WIDTH_CAMERA_OFFSET, this.game.scale.height + HEIGHT_CAMERA_OFFSET)
    this.cameras.main.startFollow(this.character)
  }

  public update = (time: number, delta: number) => {
    super.update(time, delta)
    this.character.update()
  }
}
