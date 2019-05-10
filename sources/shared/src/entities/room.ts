import { Player as BasePlayer, SerializedPlayer } from './player'

export interface SerializedRoom extends Serialized {
  id: string,
  players?: SerializedPlayer[]
}

export class Room<Player extends BasePlayer = BasePlayer> implements Serializable<SerializedRoom> {
  public readonly id: string
  public players: Player[] = []

  constructor(attributes: SerializedRoom) {
    this.id = attributes.id
  }

  public async addPlayer(player: Player): Promise<Player> {
    player.room = this
    this.players = [...this.players, player]
    return player
  }

  public async removePlayer(player: Player): Promise<Player> {
    const index = this.players.indexOf(player)
    if (index !== -1) {
      this.players.splice(index, 1)
      player.room = null
    }

    return player
  }

  public removeAllPlayers() {
    this.players.forEach(player => this.removePlayer(player))
  }

  public serialize(): SerializedRoom {
    return {
      id: this.id,
      players: this.players.map(player => player.serialize())
    }
  }
}
