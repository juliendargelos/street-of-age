import AnimationHelper from '../manager/AnimationManager'

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
