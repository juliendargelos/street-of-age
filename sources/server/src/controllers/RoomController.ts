import { Controller } from '../core'
import { RoomEvents, GameEvents } from '../Events'
import { Player } from '../entities/Player'
import { Room, RoomSettings } from '../entities/Room'

const TIME_BEFORE_LAUNCH_GAME = 3000

export class RoomController extends Controller {
  private player: Player
  private room!: Room

  constructor(socket: SocketIO.Socket) {
    super(socket, [
      RoomEvents.RoomCreate,
      RoomEvents.RoomVerify,
      RoomEvents.RoomLeave,
      RoomEvents.RoomPlayerReady
    ])

    this.player = Player.all.get(socket.id)

    this.autorun(() => {
      this.io.sockets.emit(RoomEvents.RoomRefresh, Room.all.serialize())
    })
  }

  [RoomEvents.RoomCreate](settings: RoomSettings) {
    this.room = Room.all.add(new Room(this.player, settings))
    this.socket.emit(RoomEvents.RoomJoined, this.room.serialize())

    // this.when(() => this.room.ready, () => {
    //   this.io.emit(GameEvents.GameCreate, this.room.id)
    // })
  }

   [RoomEvents.RoomPlayerReady]() {
      this.player.ready = true
      this.io.sockets.emit(RoomEvents.RoomRefresh, Room.all.serialize())
      // Logger.info(player.toString() + ' in ' + player.room.toString() + ' is now ready')
      if (this.room.ready) {
        setTimeout(() => {
          this.io.in(this.room.id).emit(RoomEvents.RoomReady)
        }, TIME_BEFORE_LAUNCH_GAME)
      }
    }

  [RoomEvents.RoomVerify](id: string) {
    const room = Room.all.get(id)

    if (room) {
      this.socket.emit(RoomEvents.RoomDefined)
      this.socket.join(room.id, () => room.players.add(this.player))
      this.room = room
    } else {
      this.socket.emit(RoomEvents.RoomUndefined)
    }
  }

  [RoomEvents.RoomLeave]() {
    if (this.room) {
      this.room.players.remove(this.player)
      this.room = null
    }
  }

  public unmount() {
    super.unmount()
    if (this.room) Room.all.remove(this.room)
  }
}
