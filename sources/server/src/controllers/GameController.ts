import { Controller } from '../core'
import { GameEvents } from '../Events'
import { Player } from '../entities/Player'
import { Character } from '../entities/Character'
import { Room, RoomSettings, SerializedRoom } from '../entities/Room'
import { Game } from '../entities/Game'

export class GameController extends Controller {
  private player: Player
  private game!: Game
  private interval: number = null

  constructor(socket: SocketIO.Socket) {
    super(socket, [
      GameEvents.GameCreate,
      GameEvents.GameUpdate,
      GameEvents.GameCharacterMoved,
      GameEvents.GameCharacterShooted,
      GameEvents.GameCharacterDied
    ])

    this.player = Player.all.get(socket.id)
  }

  [GameEvents.GameUpdate]() {
    if (this.game) {
      this.io.in(this.game.id).emit(GameEvents.GameUpdated, this.game.serialize())
      // this.socket.emit(GameEvents.GameUpdated, this.game.serialize())
    }
  }

  [GameEvents.GameCreate](id: string) {
    const room = Room.all.get(id)
    this.game = Game.all.get(id)

    if (!this.game) {
      this.game = Game.all.add(new Game(id, room.players))
      this.game.nextTurn()
      this.io.in(room.id).emit(GameEvents.GameCreated, this.game.serialize())

      this.interval = setInterval(() => {
        this.game.nextTurn()
        this.io.in(room.id).emit(GameEvents.GameTurnChanged, this.game.serialize())
      }, 15000)
    }
  }

  [GameEvents.GameCharacterMoved](id: string, x: number, y: number) {
    const character = Character.all.get(id)
    character.x = x
    character.y = y
    this.socket.broadcast.emit(GameEvents.GameCharacterMoved, { id, x, y })
  }

  [GameEvents.GameCharacterShooted](id: string) {
    this.socket.broadcast.emit(GameEvents.GameCharacterShooted, { id })

    clearInterval(this.interval)

    setTimeout(() => {
      this.game.nextTurn()
    }, 500)
  }

  [GameEvents.GameCharacterDied](id: string) {
    this.socket.broadcast.emit(GameEvents.GameCharacterDied, { id });
  }

  public unmount() {
    super.unmount()
    if (this.game) Game.all.remove(this.game)
  }
}
