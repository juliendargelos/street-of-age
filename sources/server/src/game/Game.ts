import { randomBytes } from 'crypto'
import * as Phaser from 'phaser'
import { Character } from './Character'
import { Game as BaseGame, SerializedGame, CHARACTERS_PER_PLAYER } from '@street-of-age/shared/game/game'
import { Room } from '../entities/Room'

class Game extends BaseGame<Character> {
  constructor(room: Room) {
    super({
      type: Phaser.HEADLESS,
      autoFocus: false,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade'
      }
    })

    room.players.forEach(player => {
      for (var i = CHARACTERS_PER_PLAYER; i > 0; --i) {
        const character = new Character(this.mainScene, {
          id: randomBytes(20).toString('hex'),
          kind: player.characterKind
        })

        this.characters.push(character)
        player.characters.push(character)
      }
    })
  }
}

export {
  Game,
  SerializedGame
}
