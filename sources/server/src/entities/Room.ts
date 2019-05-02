import {randomBytes} from 'crypto'
import {Player} from "./Player"
import Logger, {red} from "../services/Logger"
import {OnRoomJoined, Serializable} from "../@types"
import {action, autorun, observable} from "mobx"
import RoomManager from "../managers/RoomManager"
import {RoomEvents} from "~shared/socket/events"

export interface RoomSerialized {
  id: string,
  players: Array<{ id: string }>
}

export class Room implements Serializable {
  public readonly id: string
  @observable private players: Player[] = []

  constructor(private readonly owner: Player) {
    this.id = randomBytes(20).toString('hex')

    this.addPlayer(owner)
    owner.io.sockets.emit(RoomEvents.RoomCreated, this.serialize())
    Logger.success(`created room ${red(this.id)} with owner ${red(owner.id)}`)

    Logger.info(`setup autorun for ${this.toString()}`)
    autorun(() => {
      if (this.players.length === 0) {
        Logger.info(`deleting ${this.toString()} because all players left`)
        RoomManager.deleteRoom(this)
      }
    })
  }

  get io() {
    return this.owner.socket.server
  }

  public serialize = (): RoomSerialized => ({id: this.id, players: this.players.map(u => ({id: u.id}))})

  public toString = (): string => {
    return `Room(id: ${red(this.id)})`
  }

  @action public addPlayer = (player: Player, onJoin?: OnRoomJoined): void => {
    player.room = this
    player.socket.leaveAll()
    player.socket.join(this.id, () => {
      player.io.sockets.in(this.id).emit(RoomEvents.RoomJoined, this.serialize())
      player.io.sockets.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
      Logger.success(`${player.toString()} joined ${this.toString()}`)
      if (onJoin) onJoin(player)
    })
    this.players = [...this.players, player]
  }

  @action public removePlayer = (player: Player): void => {
    player.room = null
    player.socket.leave(this.id, () => {
      player.io.sockets.in(this.id).emit(RoomEvents.RoomLeft, {room: this.serialize(), player: player.serialize()})
      this.players = this.players.filter(u => u.id !== player.id)
      player.io.sockets.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
    })
    Logger.info(`${player.toString()} left ${this.toString()}`)
  }

  @action public removeAllPlayers = (): void => {
    this.players.forEach(this.removePlayer)
  }
}
