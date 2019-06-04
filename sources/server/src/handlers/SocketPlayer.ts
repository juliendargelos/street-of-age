import {CharacterEvents, PlayerEvents, RoomEvents} from '@street-of-age/shared/socket/events'
import {PlayerTeam} from '@street-of-age/shared/entities/player'
import PlayerManager from '../managers/PlayerManager'
import Logger from '../services/Logger'
import RoomManager from '../managers/RoomManager'
import {CharacterKind} from '@street-of-age/shared/game/character'
import {PlayerTeamKinds} from '@street-of-age/shared/entities/player'

class SocketPlayer {
  public static handle = (socket: SocketIO.Socket) => {
    const player = PlayerManager.find(socket)

    socket.emit(PlayerEvents.PlayerConnected, player.id)

    socket.on(CharacterEvents.CharacterChangeTeam, (team: PlayerTeam) => {
      player.team = team
      socket.server.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
      Logger.info(player.toString() + ' in ' + player.room.toString() + ' is now in ' + player.team + ' team')
    })

    socket.on(CharacterEvents.CharacterChangeReady, (ready: boolean) => {
      player.ready = ready
      socket.server.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
      Logger.info(player.toString() + ' in ' + player.room.toString() + ' is now ' + ready ? '' : 'not ' + 'ready')
    })

    socket.on(CharacterEvents.CharacterAddedKind, (kind: CharacterKind | null) => {
      if (kind !== null && !PlayerTeamKinds[player.team].includes(kind)) {
        throw new Error(`Invalid character kind "${kind}" for given team "${player.team}"`)
      }
      if (!player.characterKinds.includes(kind)) {
        player.characterKinds.push(kind)
      }
      socket.server.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
      Logger.info(player.toString() + ' in ' + player.room.toString() + ' have now characters ' + player.characterKinds.join(', '))
    })

    socket.on(CharacterEvents.CharacterRemovedKind, (kind: CharacterKind | null) => {
      if (kind !== null && !PlayerTeamKinds[player.team].includes(kind)) {
        throw new Error(`Invalid character kind "${kind}" for given team "${player.team}"`)
      }
      if (player.characterKinds.includes(kind)) {
        player.characterKinds = player.characterKinds.filter(k => k !== kind)
      }
      socket.server.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
      Logger.info(player.toString() + ' in ' + player.room.toString() + ' have now characters ' + player.characterKinds.join(', '))
    })


    socket.on(CharacterEvents.CharacterClearedKinds, () => {
      player.characterKinds = []
      socket.server.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
      Logger.info(player.toString() + ' in ' + player.room.toString() + ' have cleared its kinds')
    })
  }
}

export default SocketPlayer
