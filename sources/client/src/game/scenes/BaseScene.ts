import Phaser from 'phaser'
import AnimationHelper from '../manager/AnimationManager'
import GameLevel from '@/game/entities/GameLevel'
import { Character } from '@/game/entities/Character'
import GameLevelBuilder from '@/game/GameLevelBuilder'
import { REGISTRY_LEVEL_KEY } from '@/constants'

export default class BaseScene extends Phaser.Scene {
  protected animationHelper?: AnimationHelper
  protected level!: GameLevel
  protected character!: Character

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

  public create (): void {
    const json = this.registry.get(REGISTRY_LEVEL_KEY)
    console.log('BUILDING LEVEL...')
    this.loadLevel(GameLevelBuilder.build(json))
  }

  public update (time: number, delta: number): void {}

  protected loadLevel (level: GameLevel): void {
    this.level = level
    this.level.init(this)
  }

  protected destroy (): void {
    delete this.level
    delete this.animationHelper
  }
}
