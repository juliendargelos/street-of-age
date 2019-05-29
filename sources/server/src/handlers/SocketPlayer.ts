import {CharacterEvents, PlayerEvents, RoomEvents} from '@street-of-age/shared/socket/events'
import {PlayerTeam} from '@street-of-age/shared/entities/player'
import PlayerManager from '../managers/PlayerManager'
import Logger from '../services/Logger'
import RoomManager from '../managers/RoomManager'
import {CharacterKind} from '@street-of-age/shared/game/character'
import {PlayerTeamKinds} from '@street-of-age/shared/src/entities/player'

class SocketPlayer {
  public static handle = (socket: SocketIO.Socket) => {
    const player = PlayerManager.find(socket)

    socket.emit(PlayerEvents.PlayerConnected, player.id)

    socket.on(CharacterEvents.CharacterChangeTeam, (team: PlayerTeam) => {
      player.team = team
      socket.server.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
      Logger.info(player.toString() + ' in ' + player.room.toString() + ' is now in ' + player.team + ' team')
    })

    socket.on(CharacterEvents.CharacterChangeKind, (kind: CharacterKind | null) => {
      if (kind !== null && !PlayerTeamKinds[player.team].includes(kind)) {
        throw new Error(`Invalid character kind "${kind}" for given team "${player.team}"`)
      }
      player.characterKind = kind
      socket.server.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
      Logger.info(player.toString() + ' in ' + player.room.toString() + ' is now ' + player.characterKind)
    })
  }
}

export default SocketPlayer
