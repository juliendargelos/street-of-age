import BaseScene from '@/game/scenes/BaseScene'
import { Character, SerializedCharacter } from '@/game/entities/Character'
import { CharacterKind } from '@/store/modules/app'
import { PostProcessing } from '@/game/PostProcessing'
import { GameEvents } from '@street-of-age/shared/socket/events'
import { Socket } from 'socket.io'

const HEIGHT_CAMERA_OFFSET = 400
const WIDTH_CAMERA_OFFSET = 400

export class GameScene extends BaseScene {
  private postprocessing!: PostProcessing
  private characters: Map<string, Character> = new Map()
  private controlledCharacter: Character | null = null

  constructor (private readonly socket: Socket) {
    super({
      key: 'GAME_SCENE'
    })
  }

  public create = () => {
    super.create()

    this.socket.on(GameEvents.GameUpdated, (game: { characters: SerializedCharacter[] }) => {
      this.setCharacters(game.characters)
    })

    this.socket.on(GameEvents.GameTurnChanged, (game: { currentCharacter: SerializedCharacter, currentPlayer: { id: string } }) => {
      const character = this.characters.get(game.currentCharacter.id) as Character
      this.setCurrentCharacter(character)

      if (game.currentPlayer.id === this.socket.id) this.enableControls(character)
      else this.disableControls()
    })

    this.socket.emit(GameEvents.GameUpdate)

    this.cameras.main.setRoundPixels(true)
    const { width } = this.level.bounds
    this.cameras.main.setBounds(0, -HEIGHT_CAMERA_OFFSET, width, window.innerHeight + HEIGHT_CAMERA_OFFSET)
    this.postprocessing = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('PostProcessing', new PostProcessing(this.game)) as PostProcessing
    this.cameras.main.setRenderToTexture(this.postprocessing)
  }

  private setCurrentCharacter(character: Character) {
    this.cameras.main.stopFollow()
    this.cameras.main.startFollow(character, false, 0.1, 0.1)
  }

  private enableControls (character: Character) {
    this.disableControls()
    character.enableControls()
    this.controlledCharacter = character
  }

  private disableControls () {
    if (!this.controlledCharacter) return
    this.controlledCharacter.disableControls()
    this.controlledCharacter = null
  }

  private createCharacter(attributes: SerializedCharacter) {
    const character = new Character({
      scene: this,
      kind: attributes.kind,
      x: 0,
      y: 0,
      velocityX: attributes.velocityX || 0,
      velocityY: attributes.velocityY || 0
    })

    this.physics.add.collider(character, this.level.floors)
    this.physics.add.collider(character, this.level.colliders)

    this.characters.set(attributes.id, character)

    return character
  }

  private removeCharacter(id: string) {
    const character = this.characters.get(id)

    if (character) {
      character.destroy()
      this.characters.delete(id)
    }
  }

  private setCharacters(characters: SerializedCharacter[]) {
    this.characters.forEach((_, id) => this.removeCharacter(id))
    characters.forEach(character => this.createCharacter(character))
  }

  public update = (time: number, delta: number) => {
    super.update(time, delta)
    this.postprocessing.update(time, delta)
    this.characters.forEach(character => character.update())
  }
}
