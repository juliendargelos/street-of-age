import { Body, Floor, LevelBackground, Sprite, Sprites } from '@street-of-age/shared/src/@types'

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

export default class GameLevel {
  public floors!: Phaser.Physics.Arcade.StaticGroup
  public bodies!: Phaser.Physics.Arcade.StaticGroup
  public sprites: Sprites

  constructor (
    public title: string,
    public width: number,
    public height: number,
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
      width: this.width,
      height: this.height
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
    const offset = window.innerHeight - this.height < 0 ? 0 : window.innerHeight - this.height
    // TODO: Refacto this
    const canvasTexture = scene.textures.createCanvas('buttonTexture', this.bounds.width + 500, this.bounds.height)
    const src = canvasTexture.getSourceImage()
    // @ts-ignore
    const context = src.getContext('2d')
    const gradient = context.createLinearGradient(0, offset, 0, this.bounds.height / 1.2)
    gradient.addColorStop(0, this.background.from)
    gradient.addColorStop(1, this.background.to)
    context.fillStyle = gradient
    context.fillRect(0, offset, this.bounds.width + 500, this.bounds.height + offset)
    canvasTexture.refresh()
    scene.add.image(-30, offset, 'buttonTexture')
      .setDepth(-1)
      .setOrigin(0, 0)
    scene.cameras.main.setBackgroundColor(this.background.from)
    sprites
      .forEach(sprite => {
        scene.add.image(sprite.x, sprite.y + offset, sprite.texture, sprite.frame)
          .setOrigin(sprite.pivot.x, sprite.pivot.y)
      })
    this.floors = scene.physics.add.staticGroup()
    this.floors.addMultiple(
      this.serializedFloors.map(floor =>
        scene.add.rectangle(floor.x, floor.y + offset, floor.width, floor.height, floor.color).setOrigin(floor.pivot.x, floor.pivot.y)
      )
    )
    this.bodies = scene.physics.add.staticGroup()
    this.bodies.addMultiple(
      this.serializedBodies.map(body =>
        scene.add.rectangle(body.x, body.y + offset, body.width, body.height, 0xff0000, 0).setOrigin(body.pivot.x, body.pivot.y)
      )
    )
  }
}
