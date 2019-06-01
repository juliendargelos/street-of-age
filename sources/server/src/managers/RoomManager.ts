import { action, computed, observable } from 'mobx'
import { RoomEvents } from '@street-of-age/shared/socket/events'
import { Room, SerializedRoom } from '../entities/Room'
import { Player } from '../entities/Player'
import Logger from '../services/Logger'
import {RoomSettings} from '@street-of-age/shared/entities/room'

class RoomManager {
  @observable private rooms: Room[] = []

  @computed get serializedRooms(): SerializedRoom[] {
    return this.rooms.map(room => room.serialize())
  }

  public exists = (room: Room): boolean => {
    return !!this.rooms.find(r => r.id === room.id)
  }

  public find = (id: string): Room | undefined => {
    return this.rooms.find(r => r.id === id)
  }

  @action public createRoom = (owner: Player, settings: RoomSettings): Room => {
    owner.leaveRoom()
    const room = new Room(owner, settings)
    this.rooms = [...this.rooms, room]

    return room
  }

  @action public deleteRoom = (room: Room): void => {
    room.removeAllPlayers().then(() => {
      this.rooms = this.rooms.filter(r => r.id !== room.id)
      Logger.success(`deleted ${room}`)
      room.io.sockets.emit(RoomEvents.RoomDeleted, room.serialize())
      room.io.sockets.emit(RoomEvents.RoomRefresh, this.serializedRooms)
    })
  }
}

export default new RoomManager()
