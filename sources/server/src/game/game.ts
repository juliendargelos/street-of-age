import { randomBytes } from 'crypto'
import * as Phaser from 'phaser'
import { Game as BaseGame, CHARACTERS_PER_PLAYER } from '@street-of-age/shared/game/game'
import { Room } from '../entities/room'

export class Game extends BaseGame {
  constructor(room: Room) {
    super(
      {
        type: Phaser.HEADLESS,
        autoFocus: false,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade'
        }
      },
      {
        characters: room.players.reduce((characters, player) => {
          for (var i = CHARACTERS_PER_PLAYER; i > 0; --i) {
            characters.push({
              id: randomBytes(20).toString('hex'),
              playerId: player.id,
              kind: player.characterKind
            })
          }

          return characters
        }, [])
      }
    )

    this.characters.forEach(character => room.players
      .find(({ id }) => id === character.playerId)
      .characters
      .push(character)
    )
  }
}
