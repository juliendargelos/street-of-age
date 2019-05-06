import { SpriteConstructor } from '@/@types/game'
import { GRAVITY } from '@/game/entities/constants'
import InputManager from '@/game/manager/InputManager'

const MASS = 1
const JUMP_FORCE = 1.8
const BOUNCE = 0.2
const WIDTH = 54
const HEIGHT = 96
const OFFSET_X = 40
const OFFSET_Y = 28

enum State {
  Moving = 'Moving',
  Idleing = 'Idleing'
}

export class Character extends Phaser.Physics.Arcade.Sprite {
  public state: State = State.Idleing
  private cursorKeys!: Phaser.Input.Keyboard.CursorKeys

  constructor (params: SpriteConstructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame)

    params.scene.physics.world.enable(this)

    this.setSize(WIDTH, HEIGHT)
    this.setBounce(BOUNCE)
    this.setCollideWorldBounds(true)

    this.body.setOffset(OFFSET_X, OFFSET_Y)
    this.body.setMass(MASS)

    this.cursorKeys = this.scene.input.keyboard.createCursorKeys()

    params.scene.add.existing(this)
  }

  public update = () => {
    this.setGravityY(GRAVITY)
    this.handleMovements()
    this.handleAnimations()
  }

  public destroy (fromScene?: boolean): void {
    super.destroy(fromScene)
  }

  private handleMovements = () => {
    if (this.scene.game.device.os.desktop) {
      this.handleDesktopMovements()
    } else {
      this.handleMobileMovements()
    }
  }

  private handleMobileMovements = () => {
    const velocity = InputManager.getAxis('horizontal') * 70
    if (velocity < 0) {
      this.changeState(State.Moving)
      this.flipX = true
    } else if (velocity > 0) {
      this.changeState(State.Moving)
      this.flipX = false
    } else {
      this.changeState(State.Idleing)
    }
    this.setVelocityX(velocity)
  }

  private handleDesktopMovements = () => {
    if (this.cursorKeys.up!.isDown && this.body.blocked.down) {
      this.body.velocity.y = -350 * JUMP_FORCE
    }

    if (this.cursorKeys.left!.isDown) {
      this.changeState(State.Moving)
      this.setVelocityX(-300)
      this.flipX = true
    } else if (this.cursorKeys.right!.isDown) {
      this.changeState(State.Moving)
      this.setVelocityX(300)
      this.flipX = false
    } else {
      this.changeState(State.Idleing)
      this.setVelocityX(0)
    }
  }

  private handleAnimations = () => {
    switch (this.state) {
      case State.Moving:
        this.play('character_walking', true)
        break
      case State.Idleing:
        this.play('character_idle', true)
        break
    }
  }

  private changeState = (newState: State) => {
    this.state = newState
  }
}
