import BaseScene from '@/game/scenes/BaseScene'
import { Character } from '@/game/entities/Character'

export class GameDebugScene extends BaseScene {
  private character!: Character

  constructor () {
    super({
      key: 'GAME_DEBUG_SCENE'
    })
  }

  public create = () => {
    super.create()
    this.character = new Character({
      scene: this,
      texture: 'character',
      x: 120,
      y: 200
    })
    const platforms = this.physics.add.staticGroup()
    platforms.create(100, 600, 'ground').setScale(2).refreshBody()
    platforms.create(700, 800, 'ground').setScale(2).refreshBody()
    this.physics.add.collider(this.character, platforms)
  }

  public update = (time: number, delta: number) => {
    super.update(time, delta)
    this.character.update()
  }
}
