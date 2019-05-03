import * as Phaser from 'phaser'

export default class Game extends Phaser.Game {
  static createFrom(serialized: object): Game {
    return new this()
  }

  updateFrom(serialized: object) {

  }

  serialize(): object {
    return {

    }
  }
}
