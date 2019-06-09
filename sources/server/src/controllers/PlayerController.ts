import { Controller } from '../core'
import { PlayerEvents, CharacterEvents } from '../Events'
import { Player } from '../entities/Player'
import { Character, CharacterKind } from '../entities/Character'
import { TeamKind } from '../entities/Team'

export class PlayerController extends Controller {
  private player: Player

  constructor(socket: SocketIO.Socket) {
    super(socket, [
      CharacterEvents.CharacterChangeTeam,
      CharacterEvents.CharacterAddedKind,
      CharacterEvents.CharacterRemovedKind,
      CharacterEvents.CharacterClearedKinds,
      CharacterEvents.CharacterChangeReady
    ])

    this.player = Player.all.add(new Player(socket.id))
    this.socket.emit(PlayerEvents.PlayerConnected, this.player.id)
  }

  [CharacterEvents.CharacterChangeTeam](teamKind: TeamKind) {
    this.player.teamKind = teamKind
  }

  [CharacterEvents.CharacterAddedKind](kind: CharacterKind) {
    this.player.characters.add(new Character(kind).randomizePosition())
  }

  [CharacterEvents.CharacterRemovedKind](kind: CharacterKind) {
    const character = this.player.characters.find(character => character.kind === kind)
    if (character) this.player.characters.remove(character)
  }

  [CharacterEvents.CharacterClearedKinds]() {
    this.player.characters.clear()
  }

  [CharacterEvents.CharacterChangeReady](ready: boolean) {
    this.player.ready = ready
    // this.socket.server.emit(RoomEvents.RoomRefresh, RoomManager.serializedRooms)
  }

  public unmount() {
    super.unmount()
    Player.all.remove(this.player)
  }
}
