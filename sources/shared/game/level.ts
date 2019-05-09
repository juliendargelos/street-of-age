import {Body, LevelBackground, Sprites} from '../@types'

export default abstract class Level {

  constructor(
    public title: string,
    public background: LevelBackground,
    public sprites: Sprites,
    public bodies: Body[]
  ) {}

  public abstract init(scene: Phaser.Scene): void
}
