import { reaction } from 'mobx'
import { Controller } from '../core'
import { GameEvents } from '../Events'
import { Player } from '../entities/Player'
import { Character, SerializedCharacter } from '../entities/Character'
import { Room, RoomSettings, SerializedRoom } from '../entities/Room'
import { Game } from '../entities/Game'

export class GameController extends Controller {
  private player: Player
  private game!: Game
  private interval!: NodeJS.Timer

  constructor(socket: SocketIO.Socket) {
    super(socket, [
      GameEvents.GameCreate,
      GameEvents.GameUpdate,
      GameEvents.GameCharacterMove,
      GameEvents.GameCharacterShoot,
      GameEvents.GameCharacterDie
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

      reaction(() => this.game.turn, () => {
        this.io.in(this.game.id).emit(GameEvents.GameTurnChanged, this.game.serialize())
      })

      this.game.enableInterval()
    }
  }

  [GameEvents.GameCharacterMove](attributes: SerializedCharacter) {
    const character = Character.all.get(attributes.id)
    character.x = attributes.x
    character.y = attributes.y
    character.velocityX = attributes.velocityX
    character.velocityY = attributes.velocityY
    this.socket.broadcast.emit(GameEvents.GameCharacterMoved, character.serialize())
  }

  [GameEvents.GameCharacterShoot](shoot: object) {
    this.socket.broadcast.emit(GameEvents.GameCharacterShooted, shoot)

    this.game.disableInterval()

    setTimeout(() => {
      this.game.nextTurn()
      this.game.enableInterval()
    }, 5000)
  }

  [GameEvents.GameCharacterDie](id: string) {
    // this.socket.broadcast.emit(GameEvents.GameCharacterDied, { id });
  }

  public unmount() {
    super.unmount()
    if (this.game) Game.all.remove(this.game)
  }
}
