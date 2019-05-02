import {PlayerEvents} from "~shared/socket/events";
import PlayerManager from "../managers/PlayerManager";

class SocketPlayer {

  public static handle = (socket: SocketIO.Socket) => {
    const player = PlayerManager.find(socket)

    socket.emit(PlayerEvents.PlayerConnected, player.id)
  }

}

export default SocketPlayer
