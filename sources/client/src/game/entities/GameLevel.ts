import { Body, LevelBackground, Sprites } from '@street-of-age/shared/@types'

export default class GameLevel {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    public title: string,
    public background: LevelBackground,
    public sprites: Sprites,
    public bodies: Body[]
  ) {
  }

  public init = (scene: Phaser.Scene): void => {
    console.log(`INITIALIZING ${this.title}`)
    /* TODO: Currently we are ignoring layers and we are flattenning the array. In the future, we would use those layers
      informations to create a parallax effect and depth effects
    */
    const sprites = Object.entries(this.sprites)
      .map(value => value[1])
      .flat()
    sprites
      .forEach(sprite => {
        scene.add.image(sprite.x, sprite.y, sprite.texture, sprite.frame)
          .setOrigin(sprite.pivot.x, sprite.pivot.y)
      })
  }
}
