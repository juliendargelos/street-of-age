import * as Phaser from 'phaser'
import { Character as BaseCharacter, SerializedCharacter } from './character'

export const GRAVITY = 900
export const CHARACTERS_PER_PLAYER = 3

export interface SerializedGame extends Serialized {
  characters: SerializedCharacter[]
}

export class Game<Character extends BaseCharacter = BaseCharacter> extends Phaser.Game implements Serializable<SerializedGame> {
  protected characters: Character[]

  constructor(config: GameConfig) {
    super(config)
  }

  get mainScene(): Phaser.Scene {
    return this.scene.getAt(0)
  }

  serialize(): SerializedGame {
    return {
      characters: this.characters.map(character => character.serialize())
    }
  }
}
