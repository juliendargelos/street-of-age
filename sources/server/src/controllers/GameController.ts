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
      GameEvents.GameCharacterDie,
      GameEvents.GameCharacterTakeDamage
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

    if (!room) return

    this.game = Game.all.get(id)

    if (!this.game) {
      this.game = Game.all.add(new Game(id, room.players))

      reaction(() => this.game.turn, () => {
        this.resetVelocity()
        this.io.in(this.game.id).emit(GameEvents.GameTurnChanged, this.game.serialize())
      })
    }

    if (this.game.playersLoaded++ >= this.game.players.length - 1 && !this.game.created) {
      this.game.created = true
      this.game.enableInterval()
      this.io.in(room.id).emit(GameEvents.GameCreated, this.game.serialize())
      setTimeout(() => this.game.nextTurn(), 3000)
    }
  }

  [GameEvents.GameCharacterMove](attributes: SerializedCharacter) {
    const character = Character.all.get(attributes.id)
    if (!character) return
    character.x = attributes.x
    character.y = attributes.y
    if (character.y >= 600) {
      const player = this.game.players.find(player => player.characters.has(character))
      player.characters.remove(character)
      this.io.in(this.game.id).emit(GameEvents.GameCharacterDied, { id: attributes.id })

      if (player.id === this.game.currentPlayer.id) {
        this.game.disableInterval()
        this.game.nextTurn()
        this.game.enableInterval()
      }
    } else {
      character.velocityX = attributes.velocityX
      character.velocityY = attributes.velocityY
      this.socket.broadcast.emit(GameEvents.GameCharacterMoved, character.serialize())
    }
  }

  [GameEvents.GameCharacterShoot](shoot: object) {
    this.socket.broadcast.emit(GameEvents.GameCharacterShooted, shoot)

    this.game.disableInterval()

    setTimeout(() => {
      this.game.nextTurn()
      this.game.enableInterval()
    }, 5000)
  }

  [GameEvents.GameCharacterDie](id: string, killed: boolean) {
    if (killed) ++this.game.currentPlayer.numberOfKills
    const character = this.game.characters.get(id)
    if (!character) return
    character.health = 0
    const player = this.game.players.find(player => player.characters.has(character))
    player.characters.remove(character)
    ++player.numberOfDeaths
    this.io.in(this.game.id).emit(GameEvents.GameCharacterDied, { id })
  }

  [GameEvents.GameCharacterTakeDamage](damage: { id: string, damage: number }) {
    const character = this.game.characters.get(damage.id)
    if (!character) return
    character.health -= damage.damage

    if (character.health <= 0) {
      this[GameEvents.GameCharacterDie](character.id, true)
    } else {
      this.socket.broadcast.emit(GameEvents.GameCharacterTookDamage, character.serialize());
    }
  }

  private resetVelocity() {
    this.game.characters.forEach(character => {
      character.velocityY = 0
      character.velocityX = 0
      this.io.in(this.game.id).emit(GameEvents.GameCharacterMoved, character.serialize())
    })
  }

  public unmount() {
    super.unmount()
    if (this.game) Game.all.remove(this.game)
  }
}
