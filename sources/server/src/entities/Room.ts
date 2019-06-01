import { randomBytes } from 'crypto'
import { action, autorun, observable, decorate } from 'mobx'
import { RoomEvents } from '@street-of-age/shared/socket/events'
import {Room as BaseRoom, RoomSettings, SerializedRoom} from '@street-of-age/shared/entities/room'
import { Player } from './Player'
import RoomManager from '../managers/RoomManager'
import Logger, { red } from '../services/Logger'

class Room extends BaseRoom<Player> {
  constructor(private readonly owner: Player, settings: RoomSettings) {
    super({ id: randomBytes(20).toString('hex'), settings })

    owner.io.sockets.emit(RoomEvents.RoomCreated, this.serialize())

    Logger.success(`created ${this} with owner ${owner}`)

    this.addPlayer(owner).then(() => {
      Logger.info(`setup autorun for ${this}`)

      autorun(() => {
        if (this.players.length === 0) {
          Logger.info(`deleting ${this} because all players left`)
          RoomManager.deleteRoom(this)
        }
      })
    })
  }

  get io() {
    return this.owner.socket.server
  }

  public toString(): string {
    return `Room(id: ${red(this.id)})`
  }

  @action public async addPlayer(player: Player): Promise<Player> {
    player.socket.leaveAll()

    return new Promise(resolve => player.socket.join(this.id, () => {
      super.addPlayer(player).then(() => {
        player.io.sockets.in(this.id).emit(RoomEvents.RoomJoined, this.serialize())
        player.io.sockets.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
        Logger.success(`${player} joined ${this}`)
        resolve(player)
      })
    }))
  }


  @action public async removePlayer(player: Player): Promise<Player> {
    return new Promise(resolve => player.socket.leave(this.id, () => {
      super.removePlayer(player).then(() => {
        player.io.sockets.in(this.id).emit(RoomEvents.RoomLeft, {room: this.serialize(), player: player.serialize()})
        player.io.sockets.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
        Logger.info(`${player.toString()} left ${this}`)
        resolve(player)
      })
    }))
  }

  @action public async removeAllPlayers() {
    return Promise.all(this.players.map((player: Player) => this.removePlayer(player)))
  }
}

decorate(Room, {
  players: observable
})

export {
  Room,
  SerializedRoom
}
