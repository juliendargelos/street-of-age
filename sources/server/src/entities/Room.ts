import { observable, computed, autorun } from 'mobx'
import { computedFn } from '../utils'
import { Entity, Collection } from '../core'
import { Player, SerializedPlayer } from './Player'

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
