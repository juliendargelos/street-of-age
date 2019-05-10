import {Body, Floor, LevelBackground, Sprite, Sprites} from '@street-of-age/shared/@types'

interface Bounds {
  x: number,
  y: number,
  width: number,
  height: number,
}

const getMinXSprites = (sprites: Sprite[]) =>
  sprites.reduce((acc, value) => value.x < acc ? value.x : acc, sprites[0].x)

const getMinYSprites = (sprites: Sprite[]) =>
  sprites.reduce((acc, value) => value.y < acc ? value.y : acc, sprites[0].y)

const getMaxXSprites = (sprites: Sprite[]) =>
  sprites.reduce((acc, value) => value.x > acc ? value.x : acc, sprites[0].x)

const getMaxYSprites = (sprites: Sprite[]) =>
  sprites.reduce((acc, value) => value.y > acc ? value.y : acc, sprites[0].y)

const getMinWidthSprites = (sprites: Sprite[]) =>
  sprites.reduce((acc, value) => value.width < acc ? value.width : acc, sprites[0].width)

const getMinHeightSprites = (sprites: Sprite[]) =>
  sprites.reduce((acc, value) => value.height < acc ? value.height : acc, sprites[0].height)

const getMaxWidthSprites = (sprites: Sprite[]) =>
  sprites.reduce((acc, value) => value.width > acc ? value.width : acc, sprites[0].width)

const getMaxHeightSprites = (sprites: Sprite[]) =>
  sprites.reduce((acc, value) => value.height > acc ? value.height : acc, sprites[0].height)

export default class GameLevel {
  public floors!: Phaser.Physics.Arcade.StaticGroup
  public bodies!: Phaser.Physics.Arcade.StaticGroup
  public sprites: Sprites

  constructor (
    public title: string,
    public background: LevelBackground,
    private serializedSprites: Sprites,
    private serializedBodies: Body[],
    private serializedFloors: Floor[]
  ) {
    this.sprites = serializedSprites
  }

  public get bounds (): Bounds {
    const sprites = Object.entries(this.serializedSprites)
      .map(value => value[1])
      .flat()

    return {
      x: getMinXSprites(sprites),
      y: getMinYSprites(sprites),
      width: getMaxXSprites(sprites) + getMaxWidthSprites(sprites),
      height: getMaxYSprites(sprites) + getMaxHeightSprites(sprites)
    }
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
      this.serializedFloors.map(floor =>
        scene.add.rectangle(floor.x, floor.y, floor.width, floor.height, floor.color).setOrigin(floor.pivot.x, floor.pivot.y)
      )
    )
    this.bodies = scene.physics.add.staticGroup()
    this.bodies.addMultiple(
      this.serializedBodies.map(body =>
        scene.add.rectangle(body.x, body.y, body.width, body.height, 0xff0000, 0).setOrigin(body.pivot.x, body.pivot.y)
      )
    )
  }
}
