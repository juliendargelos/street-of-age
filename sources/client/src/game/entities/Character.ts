import { CharacterConstructor, SpriteConstructor } from '@/@types/game'
import { GRAVITY, PLAYER_DEPTH, scale } from '@/constants'
import InputManager from '@/game/manager/InputManager'
import Projectile from '@/game/entities/Projectile'
import { ProjectileLaunchEventHandler, ProjectileMoveEventHandler } from '@/game/entities/TouchDetection'
import { Emitter } from '@/main'
import { UIEvents } from '@street-of-age/shared/game/events'
import { CharacterKind } from '@/store/modules/app'
import characters from '@/assets/characters'
import { ClientCharacterAsset } from '@/@types'

const MASS = 1
const JUMP_FORCE = 1.7
const BOUNCE = 0
const SPEED = 32
const WIDTH = 26
const HEIGHT = 75
const OFFSET_X = 18
const OFFSET_Y = 15

enum State {
  Grounded = 'Grounded',
  Jumping = 'Jumping',
  MidAir = 'MidAir',
  Falling = 'Falling',
}

export class Character extends Phaser.Physics.Arcade.Sprite {
  private _state: State = State.Falling
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys
  public projectileDir: Phaser.GameObjects.Graphics
  public kind: CharacterKind

  get state (): State {
    return this._state
  }

  get characterAsset (): ClientCharacterAsset {
    return characters[this.kind]
  }

  set state (value: State) {
    if (value !== this._state) {
      this.onChangeState(value)
    }
    this._state = value
  }

  constructor (params: CharacterConstructor) {
    super(params.scene, params.x, params.y, 'main')
    this.kind = params.kind
    params.scene.physics.world.enable(this)
    this.projectileDir = params.scene.add.graphics().setDepth(10)

    this
      .setInteractive()
      .setDepth(PLAYER_DEPTH)
      .setSize(WIDTH, HEIGHT)
      .setBounce(BOUNCE)

    this.body.setOffset(OFFSET_X, OFFSET_Y)

    this.body.setMass(MASS)
    this.body.checkCollision.up = false
    this.body.checkCollision.left = false
    this.body.checkCollision.right = false

    this.cursorKeys = this.scene.input.keyboard.createCursorKeys()

    this.initListeners()

    params.scene.add.existing(this)
  }

  private initListeners () {
    InputManager.touch.addEventListener('player:tap', this.onPlayerTap)
    InputManager.touch.addEventListener('player:untap', () => this.projectileDir.clear())
    InputManager.touch.addEventListener('projectile:move', this.onProjectileMove)
    InputManager.touch.addEventListener('projectile:launch', this.onProjectileLaunch)

    Emitter.on(UIEvents.Jump, this.jump)
  }

  public update = () => {
    this.setGravityY(GRAVITY)
    this.handleMovements()
    this.updateState()
    this.handleAnimations()
  }

  public destroy (fromScene?: boolean): void {
    InputManager.touch.removeEventListeners()
    Emitter.removeAllListeners(UIEvents.Jump)
    super.destroy(fromScene)
  }

  private onChangeState (newState: State) {
    switch (newState) {
      case State.Jumping:
        this.play(this.kind + '_jumping_start', true)
        break
      case State.MidAir:
        this.play(this.kind + '_jumping_midair', true)
        break
      case State.Falling:
        if (this.anims.currentAnim.key.includes('midair')) {
          this.play(this.kind + '_jumping_falling', true, 1)
        } else {
          this.play(this.kind + '_jumping_falling', true)
        }
        break
    }
  }

  private updateState (): void {
    if (this.body.blocked.down) {
      this.state = State.Grounded
    } else if (this.body.velocity.y < 0) {
      this.state = State.Jumping
    } else if (this.body.velocity.y === 0) {
      this.state = State.MidAir
    } else {
      this.state = State.Falling
    }
  }

  private onProjectileLaunch: ProjectileLaunchEventHandler = (evt): void => {
    const { distance, angle, position } = evt.detail
    const projectile = new Projectile({
      scene: this.scene,
      texture: 'main',
      frame: 'main/fx/fireball/4',
      character: this.characterAsset,
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
    if (this.cursorKeys.space!.isDown) {
      this.jump()
    }
    if (velocity < 0) {
      this.turn('left')
    } else if (velocity > 0) {
      this.turn('right')
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
    if (this.body.blocked.down) {
      this.body.velocity.y = -350 * JUMP_FORCE
    }
  }

  private handleDesktopMovements = () => {
    if (this.cursorKeys.up!.isDown) {
      this.jump()
    }

    if (this.cursorKeys.left!.isDown) {
      this.setVelocityX(-5 * SPEED)
      this.turn('left')
    } else if (this.cursorKeys.right!.isDown) {
      this.setVelocityX(5 * SPEED)
      this.turn('right')
    } else {
      this.setVelocityX(0)
    }
  }

  private handleAnimations () {
    switch (this.state) {
      case State.Grounded:
        if (this.body.velocity.x === 0) {
          this.play(this.kind + '_walking', true, 0)
          this.anims.stop()
        } else {
          this.play(this.kind + '_walking', true)
        }
        break
    }
  }
}
