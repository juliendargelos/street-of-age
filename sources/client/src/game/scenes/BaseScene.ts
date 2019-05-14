import Phaser from 'phaser'
import AnimationHelper from '../manager/AnimationManager'
import { Emitter } from '@/main'
import { GameEvents } from '@street-of-age/shared/src/game/events'

export default class BaseScene extends Phaser.Scene {
  protected animationHelper?: AnimationHelper

  public init (): void {
    this.game.scene.dump()
  }

  public preload (): void {
    this.load.setBaseURL(process.env.BASE_URL)
    this.load.pack(
      'game',
      'pack.json',
      'game'
    )
    this.load.on('complete', () => {
      Emitter.emit(GameEvents.GameLoaded)
      this.animationHelper = new AnimationHelper(
        this,
        this.cache.json.get('animations')
      )
    })
  }

  public create (): void {}

  public update (time: number, delta: number): void {}

  protected destroy (): void {}
}
