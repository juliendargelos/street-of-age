import {Player as BasePlayer, PlayerColor, SerializedPlayer} from './player'

export interface RoomSettings {
  name: string
  numberOfPlayers: 2 | 4 | 6
  mapSize: 'small' | 'medium' | 'large'
}

export interface SerializedRoom extends Serialized {
  id: string,
  settings: RoomSettings,
  players?: SerializedPlayer[]
}

export class Room<Player extends BasePlayer = BasePlayer> implements Serializable<SerializedRoom> {
  public readonly id: string
  public settings:  RoomSettings
  public players: Player[] = []
  private playersColors: PlayerColor[] = ['#f64afe', '#0be5fe', '#50fbd7', '#e6ff5d', '#ff4f73', '#ff3dad']

  constructor(attributes: SerializedRoom) {
    this.id = attributes.id
    this.settings = attributes.settings
  }

  public async addPlayer(player: Player): Promise<Player> {
    player.room = this
    player.color = this.playersColors.pop()
    this.players = [...this.players, player]
    return player
  }

  public async removePlayer(player: Player): Promise<Player> {
    const index = this.players.indexOf(player)
    if (index !== -1) {
      if (player.color) {
        this.playersColors.push(player.color)
      }
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
      settings: this.settings,
      players: this.players.map(player => player.serialize())
    }
  }
}
