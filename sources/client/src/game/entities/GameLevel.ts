import { Floor, Layers, LevelBackground, Sprite } from '@street-of-age/shared/src/@types'
import { createPhaserGradient } from '@/constants'

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
  public colliders!: Phaser.Physics.Arcade.StaticGroup
  public layers: Layers

  constructor (
    public title: string,
    public width: number,
    public height: number,
    public background: LevelBackground,
    private serializedLayers: Layers,
    private serializedFloors: Floor[]
  ) {
    this.layers = serializedLayers
  }

  public get bounds (): Bounds {
    const sprites = Object.entries(this.serializedLayers)
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
    const layers = Object.entries(this.layers)
      .map(value => value[1])
    const offset = window.innerHeight - this.height
    // const gradient = createPhaserGradient(scene, {
    //   width: this.bounds.width + 500,
    //   height: this.bounds.height - offset,
    //   x0: 0,
    //   y0: 0,
    //   x1: 0,
    //   y1: this.bounds.height - offset,
    //   colorStops: [{ offset: 0, color: this.background.to }, { offset: 1, color: this.background.from }]
    // })
    // scene.add.image(-30, offset < 0 ? offset : offset * 2, gradient)
    //   .setDepth(-10)
    //   .setOrigin(0, 0)
    scene.cameras.main.setBackgroundColor(this.background.to)
    layers
      .forEach(layer => {
        layer.sprites.forEach(sprite => {
          scene.add.image(sprite.x, sprite.y + offset, sprite.texture, sprite.frame)
            .setOrigin(sprite.pivot.x, sprite.pivot.y)
            .setScrollFactor(layer.options.speed, 1)
            .setDepth(layer.options.depth)
        })
      })
    this.floors = scene.physics.add.staticGroup()
    this.floors.addMultiple(
      this.serializedFloors.map(floor =>
        scene.add.rectangle(floor.x, floor.y + offset, floor.width, floor.height, floor.color)
          .setOrigin(floor.pivot.x, floor.pivot.y)
          .setDepth(10)
      )
    )
    this.colliders = scene.physics.add.staticGroup()
    layers.forEach(layer => {
      this.colliders.addMultiple(
        layer.colliders
          .map(collider =>
            scene.add.rectangle(collider.x, collider.y + offset, collider.width, collider.height, 0xff0000, 0)
              .setScrollFactor(layer.options.speed, 1)
              .setOrigin(collider.pivot.x, collider.pivot.y)
          )
      )
    })
  }
}
