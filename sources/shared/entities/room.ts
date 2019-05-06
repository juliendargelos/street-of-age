import { Player, SerializedPlayer } from './player'

export interface SerializedRoom extends Serialized {
  id: string,
  players: SerializedPlayer[]
}

export class Room implements Serializable<SerializedRoom> {
  public readonly id: string
  public players: Player[]

  constructor(attributes: SerializedRoom) {
    this.id = attributes.id
    attributes.players.forEach(player => this.addPlayer(new Player(player)))
  }

  public addPlayer(player: Player) {
    this.players.push(player)
  }

  public removePlayer(player: Player) {
    const index = this.players.indexOf(player)
    if (index !== -1) this.players.splice(index, 1)
  }

  public clearPlayers() {
    this.players.forEach(player => this.removePlayer(player))
  }

  public serialize(): SerializedRoom {
    return {
      id: this.id,
      players: this.players.map(player => player.serialize())
    }
  }
}
