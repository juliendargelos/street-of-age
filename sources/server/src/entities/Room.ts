import { observable, computed, autorun, reaction } from 'mobx'
import { computedFn } from '../utils'
import { Entity, Collection } from '../core'
import { Player, SerializedPlayer } from './Player'

const PLAYER_COLORS = [
  '#f64afe',
  '#0be5fe',
  '#50fbd7',
  '#e6ff5d',
  '#ff4f73',
  '#ff3dad'
]

export interface RoomSettings extends SerializedObject {
  name: string
  numberOfPlayers: 2 | 4 | 6
  mapSize: 'small' | 'medium' | 'large'
}

export interface SerializedRoom extends SerializedObject {
  id: string
  players: SerializedPlayer[]
  settings: RoomSettings
  ready: boolean
}

const all = new Collection<Room>()

export class Room extends Entity {
  public static all = all
  public static collection = all.collection

  public readonly players: Collection<Player> = Player.collection()

  constructor(
    public readonly owner: Player,
    public settings: RoomSettings
  ) {
    super(owner.id)

    reaction(() => this.players.length, () => {
      const usedColors = this.players.map(player => player.color).filter(Boolean)
      const colors = PLAYER_COLORS.filter(color => !usedColors.includes(color))

      this.players.forEach(player => {
        if (player.color) return
        player.color = colors[0]
        colors.splice(0, 1)
      })
    })

    this.players.add(owner)
  }

  @computed get ready() {
    return (
      this.players.length === this.settings.numberOfPlayers &&
      this.players.every(player => player.ready)
    )
  }

  @computedFn public serialize(): SerializedRoom {
    return {
      id: this.id,
      players: this.players.map(player => player.serialize()),
      settings: this.settings,
      ready: this.ready
    }
  }
}
