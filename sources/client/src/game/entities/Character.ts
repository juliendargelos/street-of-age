import { SpriteConstructor } from '@/@types/game'
import { GRAVITY, PLAYER_DEPTH, scale } from '@/constants'
import InputManager from '@/game/manager/InputManager'
import Projectile from '@/game/entities/Projectile'
import { ProjectileLaunchEventHandler, ProjectileMoveEventHandler } from '@/game/entities/TouchDetection'

const MASS = 1
const JUMP_FORCE = 1.7
const BOUNCE = 0.2
const SPEED = 32
const WIDTH = 26
const HEIGHT = 75
const OFFSET_X = 18
const OFFSET_Y = 15

enum State {
  Moving = 'Moving',
  Idleing = 'Idleing'
}

export class Character extends Phaser.Physics.Arcade.Sprite {
  public state: State = State.Idleing
  public projectileDir: Phaser.GameObjects.Graphics
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor (params: SpriteConstructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame)
    params.scene.physics.world.enable(this)
    this.projectileDir = params.scene.add.graphics().setDepth(10)

    this
      .setInteractive()
      .setDepth(PLAYER_DEPTH)
      .setSize(WIDTH, HEIGHT)
      .setBounce(BOUNCE)

    this.body.setOffset(OFFSET_X, OFFSET_Y)

    this.body.setMass(MASS)

    this.cursorKeys = this.scene.input.keyboard.createCursorKeys()

    InputManager.touch.addEventListener('tap', this.jump)
    InputManager.touch.addEventListener('player:tap', this.onPlayerTap)
    InputManager.touch.addEventListener('player:untap', () => this.projectileDir.clear())
    InputManager.touch.addEventListener('projectile:move', this.onProjectileMove)
    InputManager.touch.addEventListener('projectile:launch', this.onProjectileLaunch)

    params.scene.add.existing(this)
  }

  public update = () => {
    this.setGravityY(GRAVITY)
    this.handleMovements()
    this.handleAnimations()
  }

  public destroy (fromScene?: boolean): void {
    InputManager.touch.removeEventListeners()
    super.destroy(fromScene)
  }

  private onProjectileLaunch: ProjectileLaunchEventHandler = (evt): void => {
    const { distance, angle, position } = evt.detail
    const projectile = new Projectile({
      scene: this.scene,
      texture: 'main',
      frame: 'main/fx/fireball/4',
      angle,
      distance,
      x: this.x,
      y: this.y
    })
    const { x, y } = position.subtract(new Phaser.Math.Vector2({ x: this.x, y: this.y }))
    projectile.launch(Phaser.Math.Clamp(distance / 10, 20, 50), { x: -x, y: -y })
  }

  private onProjectileMove: ProjectileMoveEventHandler = (evt): void => {
    const position = new Phaser.Math.Vector2(evt.detail.pointer.worldX, evt.detail.pointer.worldY)
    this.projectileDir.clear()
    this.projectileDir.lineStyle(4, 0xff0000)
    this.projectileDir.lineBetween(this.x, this.y, evt.detail.pointer.worldX, evt.detail.pointer.worldY)
    const { x } = position.subtract(new Phaser.Math.Vector2({ x: this.x, y: this.y }))
    x < 0 ? this.turn('right') : this.turn('left')
    const force = Math.round(scale(
      Phaser.Math.Clamp(Math.abs(x), 50, 400),
      50,
      400,
      0,
      100
    ))
    console.log('Throwing force:', force)
  }

  private onPlayerTap = (): void => {
    this.projectileDir.clear()
    console.log('player tapped')
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
    if (this.cursorKeys.space!.isDown && this.body.blocked.down) {
      this.body.velocity.y = -350 * JUMP_FORCE
    }
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
      this.setOffset(WIDTH + OFFSET_X, OFFSET_Y)
    } else {
      this.setOffset(OFFSET_X, OFFSET_Y)
      this.scaleX = 1
    }
  }

  private jump = () => {
    this.body.velocity.y = -350 * JUMP_FORCE
  }

  private handleDesktopMovements = () => {
    if (this.cursorKeys.up!.isDown && this.body.blocked.down) {
      this.jump()
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
        this.play('fraicheur_walking', true, 0)
        this.anims.stop()
        break
    }
  }

  private changeState = (newState: State) => {
    this.state = newState
  }
}
