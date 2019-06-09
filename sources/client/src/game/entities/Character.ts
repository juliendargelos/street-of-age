import { CharacterConstructor, SpriteConstructor } from '@/@types/game'
import { GRAVITY, PLAYER_DEPTH, scale } from '@/constants'
import InputManager from '@/game/manager/InputManager'
import Projectile from '@/game/entities/Projectile'
import { ProjectileLaunchEventHandler, ProjectileMoveEventHandler } from '@/game/entities/TouchDetection'
import { Emitter } from '@/main'
import { UIEvents } from '@street-of-age/shared/game/events'
import { CharacterKind } from '@/store/modules/app'
import characters from '@/assets/characters'
import MeleeAttack from '@/game/entities/MeleeAttack'
import { ClientCharacterAsset } from '@/@types'
import {gameWait} from '@/utils/functions'
import { Shoot } from '../scenes/GameScene'

const MASS = 1
const JUMP_FORCE = 1.7
const BOUNCE = 0
const SPEED = 32
const WIDTH = 26
const HEIGHT = 75
const OFFSET_X = 18
const OFFSET_Y = 15

const GROUNDED_ANIMATIONS = ['melee', 'launch']

enum State {
  Grounded = 'Grounded',
  Jumping = 'Jumping',
  MidAir = 'MidAir',
  Falling = 'Falling',
}

export interface SerializedCharacter extends Serialized {
  id: string
  kind: CharacterKind
  x?: number
  y?: number
  velocityX?: number
  velocityY?: number
}

export enum WeaponType {
  Distance = 'Distance',
  Melee = 'Melee',
}

export class Character extends Phaser.Physics.Arcade.Sprite {
  private _state: State = State.Falling
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys
  public damaged: boolean = false
  public weaponType: WeaponType = WeaponType.Distance
  private controlsEnabled: boolean = false
  public projectileDir: Phaser.GameObjects.Graphics
  public id: string
  public kind: CharacterKind
  public health: number = 4
  private previousX: number = 0
  private previousY: number = 0
  private previousVelocityX: number = 0
  private previousVelocityY: number = 0

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
    this.id = params.id
    console.log(params.x, params.y)
    this.kind = params.kind
    this.setData('tag', 'character')
    params.scene.physics.world.enable(this)
    this.projectileDir = params.scene.add.graphics().setDepth(10)

    this
      .setInteractive()
      .setDragX(400)
      .setDepth(PLAYER_DEPTH)
      .setSize(WIDTH, HEIGHT)
      .setBounce(BOUNCE)

    this.body.setOffset(OFFSET_X, OFFSET_Y)

    this.body.setMass(MASS)
    this.body.checkCollision.up = false
    this.body.checkCollision.left = false
    this.body.checkCollision.right = false

    this.setVelocityX(params.velocityX)
    this.setVelocityY(params.velocityY)

    this.cursorKeys = this.scene.input.keyboard.createCursorKeys()

    params.scene.add.existing(this)
  }

  public update = () => {
    this.setGravityY(GRAVITY)

    if (this.body.velocity.x < 0) {
      this.turn('left')
    } else if (this.body.velocity.x > 0) {
      this.turn('right')
    }

    if (this.controlsEnabled) this.handleMovements()
    this.updateState()
    this.handleAnimations()

    if (
      this.x !== this.previousX ||
      this.y !== this.previousY
    ) {
      this.previousX = this.x
      this.previousY = this.y

      this.emit('moved', {
        id: this.id,
        x: this.x,
        y: this.y,
        velocityX: this.body.velocity.x,
        velocityY: this.body.velocity.y
      })
    }
  }

  public destroy (fromScene?: boolean): void {
    InputManager.touch.removeEventListeners()
    Emitter.removeAllListeners(UIEvents.Jump)
    super.destroy(fromScene)
  }

  public takeDamage (damage: number, force: number, angle: number): void {
    this.damaged = true
    this.health -= damage
    this.body.velocity.x += Math.cos(angle) * force
    this.body.velocity.y += Math.sin(angle) * force
    this.scene.time.delayedCall(800, () => {
      this.damaged = false
    }, [], null)
  }

  private onChangeState (newState: State) {
    const action = this.damaged ? 'hit' : 'jumping'
    switch (newState) {
      case State.Jumping:
        this.play(`${this.kind}_${action}_start`, true)
        break
      case State.MidAir:
        this.play(this.kind + `_${action}_midair`, true)
        break
      case State.Falling:
        if (this.anims.currentAnim.key.includes('midair')) {
          this.play(this.kind + `_${action}_falling`, true, 1)
        } else {
          this.play(this.kind + `_${action}_falling`, true)
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

  public enableControls () {
    InputManager.touch.addEventListener('tap', this.jump)
    InputManager.touch.addEventListener('player:tap', this.onPlayerTap)
    InputManager.touch.addEventListener('player:untap', this.onPlayerUntap)
    InputManager.touch.addEventListener('projectile:move', this.onProjectileMove)
    InputManager.touch.addEventListener('projectile:launch', this.onProjectileLaunch)
    Emitter.on(UIEvents.Jump, this.jump)
    this.controlsEnabled = true
  }

  public disableControls () {
    InputManager.touch.removeEventListeners()
    Emitter.off(UIEvents.Jump, this.jump)
    this.controlsEnabled = false
  }

  public async launchProjectile(shoot: Shoot) {
    this.weaponType = shoot.weaponType
    this.scaleX = shoot.scaleX
    this.x = shoot.characterX
    this.y = shoot.characterY

    switch (this.weaponType) {
      case WeaponType.Distance:
        this.anims.play(`${this.kind}_launch`, true).once('animationcomplete', () => {
          this.anims.play(`${this.kind}_idle`)
        })
        await gameWait(this.scene.time, 500)
        const { distance, angle, x, y } = shoot
        const projectile = new Projectile({
          scene: this.scene,
          character: this.characterAsset,
          angle: angle!,
          distance: distance!,
          x: this.x,
          y: this.y,
          offsetX: this.characterAsset.projectile.offsetX,
          offsetY: this.characterAsset.projectile.offsetY,
          direction: this.scaleX
        })

        const position = new Phaser.Math.Vector2(x, y)
          .subtract(new Phaser.Math.Vector2({ x: this.x, y: this.y }))
          .multiply(new Phaser.Math.Vector2(-1, -1))

        projectile.launch(Phaser.Math.Clamp(distance! / 10, 20, 50), position)
        break

      case WeaponType.Melee:
        this.anims.play(`${this.kind}_melee`, true).once('animationcomplete', () => {
          this.anims.play(`${this.kind}_idle`)
        })
        const melee = new MeleeAttack({
          scene: this.scene,
          x: this.x,
          y: this.y,
          kind: this.characterAsset.kind,
          modifiers: this.characterAsset.melee,
          scaleX: this.scaleX
        })
        break
    }
  }

  public onProjectileLaunch: ProjectileLaunchEventHandler = async (evt) => {
    const shoot: Shoot = {
      id: this.id,
      weaponType: this.weaponType,
      scaleX: this.scaleX,
      characterX: this.x,
      characterY: this.y,
      ...(this.weaponType === WeaponType.Distance
        ? { angle: evt.detail.angle, distance: evt.detail.distance, x: evt.detail.position.x, y: evt.detail.position.y }
        : null
      )
    }

    this.emit('shooted', shoot)
    await this.launchProjectile(shoot)
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
    this.weaponType = this.weaponType === WeaponType.Distance ? WeaponType.Melee : WeaponType.Distance
    console.log('player tapped')
    console.log(this.weaponType)
  }

  private onPlayerUntap = (): void => {
    this.projectileDir.clear()
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
          if (!GROUNDED_ANIMATIONS.some(anim => this.anims.currentAnim.key.includes(anim))) {
            this.play(this.kind + '_idle', true, 0)
          }
        } else {
          this.play(this.kind + '_walking', true)
        }
        break
    }
  }
}
