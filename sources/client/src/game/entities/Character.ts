import { SpriteConstructor } from '@/@types/game'
import { GRAVITY } from '@/game/entities/constants'
import InputManager from '@/game/manager/InputManager'

const MASS = 1
const JUMP_FORCE = 1.8
const BOUNCE = 0.2
const SPEED = 20
const WIDTH = 63
const HEIGHT = 90
const OFFSET_X = 0
const OFFSET_Y = 0

enum State {
  Moving = 'Moving',
  Idleing = 'Idleing'
}

export class Character extends Phaser.Physics.Arcade.Sprite {
  public state: State = State.Idleing
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor (params: SpriteConstructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame)

    params.scene.physics.world.enable(this)

    this.setSize(WIDTH, HEIGHT)
    this.setBounce(BOUNCE)

    this.body.setOffset(OFFSET_X, OFFSET_Y)
    this.body.setMass(MASS)
    this.setCollideWorldBounds(true)

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
    const velocity = InputManager.getAxis('horizontal') * SPEED
    if (velocity < 0) {
      this.turn('left')
      this.changeState(State.Moving)
    } else if (velocity > 0) {
      this.turn('right')
      this.changeState(State.Moving)
    } else {
      this.changeState(State.Idleing)
    }
    this.setVelocityX(velocity)
  }

  private turn = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      this.scaleX = -1
      this.setOffset(WIDTH, OFFSET_Y)
    } else {
      this.setOffset(OFFSET_X, OFFSET_Y)
      this.scaleX = 1
    }
  }

  private handleDesktopMovements = () => {
    if (this.cursorKeys.up!.isDown && this.body.blocked.down) {
      this.body.velocity.y = -350 * JUMP_FORCE
    }

    if (this.cursorKeys.left!.isDown) {
      this.changeState(State.Moving)
      this.setVelocityX(-5 * SPEED)
      this.turn('left')
    } else if (this.cursorKeys.right!.isDown) {
      this.changeState(State.Moving)
      this.setVelocityX(5 * SPEED)
      this.turn('right')
    } else {
      this.changeState(State.Idleing)
      this.setVelocityX(0)
    }
  }

  private handleAnimations = () => {
    switch (this.state) {
      case State.Moving:
        this.play('fraicheur_walking', true)
        break
      case State.Idleing:
        this.play('fraicheur_walking', true)
        break
    }
  }

  private changeState = (newState: State) => {
    this.state = newState
  }
}
