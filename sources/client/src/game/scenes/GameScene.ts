import BaseScene from '@/game/scenes/BaseScene'
import { Character } from '@/game/entities/Character'
import { CharacterKind } from '@/store/modules/app'
import { PostProcessing } from '@/game/PostProcessing'

const HEIGHT_CAMERA_OFFSET = 400
const WIDTH_CAMERA_OFFSET = 400

export class GameScene extends BaseScene {
  private postprocessing!: PostProcessing

  constructor () {
    super({
      key: 'GAME_SCENE'
    })
  }

  public create = () => {
    super.create()
    this.character = new Character({
      scene: this,
      kind: CharacterKind.LapdogWoman,
      x: 120,
      y: 200
    })
    this.physics.add.collider(this.character, this.level.floors)
    this.physics.add.collider(this.character, this.level.colliders)
    this.cameras.main.setRoundPixels(true)
    const { width } = this.level.bounds
    this.cameras.main.setBounds(0, -HEIGHT_CAMERA_OFFSET, width, window.innerHeight + HEIGHT_CAMERA_OFFSET)
    this.cameras.main.startFollow(this.character, false, 0.1, 0.1)
    this.postprocessing = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('PostProcessing', new PostProcessing(this.game)) as PostProcessing
    this.cameras.main.setRenderToTexture(this.postprocessing)
  }

  public update = (time: number, delta: number) => {
    super.update(time, delta)
    this.postprocessing.update(time, delta)
    this.character.update()
  }
}
