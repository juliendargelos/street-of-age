import { RoomEvents } from '@street-of-age/shared/socket/events'
import RoomManager from '../managers/RoomManager'
import PlayerManager from '../managers/PlayerManager'
import Logger from '../services/Logger'
import {RoomSettings} from '@street-of-age/shared/entities/room'

class SocketRoom {
  public static handle = (socket: SocketIO.Socket) => {
    const player = PlayerManager.find(socket)

    socket.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)

    socket.on(RoomEvents.RoomVerify, (id: string) => {
      const room = RoomManager.find(id)
      if (room) {
        socket.emit(RoomEvents.RoomDefined)
        player.joinRoom(room)
      } else {
        Logger.warn(`${player} tried to join a non existent room`)
        socket.emit(RoomEvents.RoomUndefined)
      }
    })

    socket.on(RoomEvents.RoomCreate, (settings: RoomSettings) => {
      if (settings.name === '') {
        Logger.warn(player.toString() + ' tried to create a room with empty name. Forbit it.')
        return
      }
      RoomManager.createRoom(player, settings)
    })

    socket.on(RoomEvents.RoomPlayerReady, () => {
      player.ready = true
      player.io.sockets.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
      Logger.info(player.toString() + ' in ' + player.room.toString() + ' is now ready')
    })

    socket.on(RoomEvents.RoomLeave, (roomId: string) => {
      const room = RoomManager.find(roomId)
      if (room) {
        room.removePlayer(player)
      }
    })

    socket.on(RoomEvents.RoomRetrieve, () => {
      socket.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
    })
  }
}

export default SocketRoom
