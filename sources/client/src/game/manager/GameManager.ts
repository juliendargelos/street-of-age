import InputManager from '@/game/manager/InputManager'
import { Emitter } from '@/main'
import { GameEvents } from '@street-of-age/shared/src/game/events'

export class GameManager {
  public game!: Phaser.Game

  get currentScene (): Phaser.Scene | null {
    return this.game
      ? this.game.scene.getAt(0)! : null
  }

  public init = (game: Phaser.Game) => {
    this.game = game
    Emitter.on(GameEvents.GameLoaded, () => {
      InputManager.init(this)
    })
  }

  public destroy = () => {
    Emitter.removeAllListeners(GameEvents.GameLoaded)
    delete this.game
  }
}

export default new GameManager()
