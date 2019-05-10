import { Socket } from 'socket.io'
import { Player as BasePlayer, SerializedPlayer, PlayerTeam } from '@street-of-age/shared/entities/player'
import { Character, CharacterKind } from '../game/character'
import { red } from '../services/Logger'

class Player extends BasePlayer<Character> {
  public characters: Character[] = []

  constructor(
    public readonly socket: Socket,
    team: PlayerTeam,
    characterKind: CharacterKind
   ) {
    super({
      id: socket.id,
      team,
      characterKind
    })
  }

  get io() {
    return this.socket.server
  }

  public toString(): string {
    return `Player(id: ${red(this.id)})`
  }
}

export {
  Player,
  SerializedPlayer,
  PlayerTeam
}
