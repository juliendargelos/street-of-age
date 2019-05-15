import { SpriteConstructor } from '@/@types/game'
import { GRAVITY, scale } from '@/constants'
import InputManager from '@/game/manager/InputManager'
import Projectile from '@/game/entities/Projectile'
import { ProjectileLaunchEventHandler, ProjectileMoveEventHandler } from '@/game/entities/ProjectileDetection'

const MASS = 1
const JUMP_FORCE = 1.8
const BOUNCE = 0.2
const SPEED = 70
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
  public projectileDir: Phaser.GameObjects.Graphics
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor (params: SpriteConstructor) {
    super(params.scene, params.x, params.y, params.texture, params.frame)
    params.scene.physics.world.enable(this)
    this.projectileDir = params.scene.add.graphics()

    this.setInteractive()
    this.setSize(WIDTH, HEIGHT)
    this.setBounce(BOUNCE)
    this.body.setOffset(OFFSET_X, OFFSET_Y)

    this.body.setMass(MASS)
    this.cursorKeys = this.scene.input.keyboard.createCursorKeys()

    InputManager.projectile.addEventListener('player:tap', this.onTap)
    InputManager.projectile.addEventListener('player:untap', () => this.projectileDir.clear())
    InputManager.projectile.addEventListener('projectile:move', this.onProjectileMove)
    InputManager.projectile.addEventListener('projectile:launch', this.onProjectileLaunch)

    params.scene.add.existing(this)
  }

  public update = () => {
    this.setGravityY(GRAVITY)
    this.handleMovements()
    this.handleAnimations()
  }

  public destroy (fromScene?: boolean): void {
    InputManager.projectile.removeEventListeners()
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
    this.projectileDir.lineBetween(this.x, this.y, evt.detail.pointer.worldX, evt.detail.pointer.worldY)
    const { x } = position.subtract(new Phaser.Math.Vector2({ x: this.x, y: this.y }))
    this.flipX = x > 0
    const force = Math.round(scale(
      Phaser.Math.Clamp(Math.abs(x), 0, 500),
      0,
      500,
      0,
      100
    ))
    console.log('Throwing force:', force)
  }

  private onTap = (): void => {
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
      this.setVelocityX(-5 * SPEED)
      this.flipX = true
    } else if (this.cursorKeys.right!.isDown) {
      this.changeState(State.Moving)
      this.setVelocityX(5 * SPEED)
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
