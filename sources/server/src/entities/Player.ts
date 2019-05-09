import { Socket } from 'socket.io'
import { Player as BasePlayer, SerializedPlayer, PlayerTeam } from '@street-of-age/shared/entities/player'
import { CharacterKind } from '@street-of-age/shared/game/character'
import { Room } from './Room'
import { red } from '../services/Logger'

class Player extends BasePlayer {
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
  PlayerTeam,
  CharacterKind
}
