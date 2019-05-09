import { Body, Floor, LevelBackground, Sprites } from '@street-of-age/shared/@types'

export default class GameLevel {
  public floors!: Phaser.Physics.Arcade.StaticGroup
  public bodies: Body[]
  public sprites: Sprites

  constructor (
    public title: string,
    public background: LevelBackground,
    private serializedSprites: Sprites,
    private serializedBodies: Body[],
    private serializedFloors: Floor[]
  ) {
    this.sprites = serializedSprites
    this.bodies = serializedBodies
  }

  public init = (scene: Phaser.Scene): void => {
    console.log(`INITIALIZING ${this.title}`)
    /* TODO: Currently we are ignoring layers and we are flattenning the array. In the future, we would use those layers
      informations to create a parallax effect and depth effects
    */
    const sprites = Object.entries(this.serializedSprites)
      .map(value => value[1])
      .flat()
    sprites
      .forEach(sprite => {
        scene.add.image(sprite.x, sprite.y, sprite.texture, sprite.frame)
          .setOrigin(sprite.pivot.x, sprite.pivot.y)
      })
    this.floors = scene.physics.add.staticGroup()
    this.floors.addMultiple(
      this.serializedFloors.map(floor => scene.add.rectangle(floor.x, floor.y, floor.width, floor.height, floor.color).setOrigin(floor.pivot.x, floor.pivot.y))
    )
  }
}
