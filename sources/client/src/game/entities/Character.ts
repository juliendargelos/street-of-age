import { CharacterConstructor, SpriteConstructor } from '@/@types/game'
import { GRAVITY, PLAYER_DEPTH, scale } from '@/constants'
import InputManager from '@/game/manager/InputManager'
import Projectile from '@/game/entities/Projectile'
import { ProjectileLaunchEventHandler, ProjectileMoveEventHandler } from '@/game/entities/TouchDetection'
import { Emitter } from '@/main'
import { UIEvents } from '@street-of-age/shared/game/events'
import { CharacterKind } from '@/store/modules/app'
import characters, { MOVE_ABILITY_ID } from '@/assets/characters'
import MeleeAttack from '@/game/entities/MeleeAttack'
import { ClientCharacterAsset } from '@/@types'
import { gameWait } from '@/utils/functions'
import AudioManager from '@/game/manager/AudioManager'
import { Shoot } from '../scenes/GameScene'

const MASS = 1
const JUMP_FORCE = 1.7
const BOUNCE = 0
const SPEED = 45

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
  private controlsEnabled: boolean = false
  public damaged: boolean = false
  public weaponType: WeaponType = WeaponType.Distance
  public projectileDir: Phaser.GameObjects.Graphics
  public id: string
  public projectileDirFront: Phaser.GameObjects.Sprite
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
    this.projectileDirFront = params.scene.add.sprite(this.x, this.y + 100, 'main', 'main/projectile_aim')
      .setDepth(PLAYER_DEPTH)
      .setVisible(false)

    const { width, height, offsetX, offsetY } = this.characterAsset.body

    this
      .setInteractive()
      .setDragX(200 * (4 * this.characterAsset.stats[MOVE_ABILITY_ID].level))
      .setDepth(PLAYER_DEPTH)
      .setSize(width, height)
      .setBounce(BOUNCE)

    this.body.setOffset(offsetX, offsetY)

    this.body.setMass(MASS)
    this.body.checkCollision.up = false
    this.body.checkCollision.left = false
    this.body.checkCollision.right = false

    this.setVelocityX(params.velocityX)
    this.setVelocityY(params.velocityY)

    this.cursorKeys = this.scene.input.keyboard.createCursorKeys()

    params.scene.add.existing(this)
  }

  // private initListeners () {
  //   if (this.local) {
  //     InputManager.touch.addEventListener('player:tap', this.onPlayerTap)
  //     InputManager.touch.addEventListener('player:untap', () => {
  //       this.projectileDir.clear()
  //       this.projectileDirFront.setVisible(false)
  //     })
  //     InputManager.touch.addEventListener('projectile:move', this.onProjectileMove)
  //     InputManager.touch.addEventListener('projectile:launch', this.onProjectileLaunch)
  //   }

  //   Emitter.on(UIEvents.Jump, this.jump)
  // }

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
    AudioManager.playUniqueSfx('melee', { volume: 0.5 })
    this.damaged = true
    this.health -= damage
    this.body.velocity.x += Math.cos(angle) * force
    this.body.velocity.y += Math.sin(angle) * force
    this.scene.time.delayedCall(800, () => {
      this.damaged = false
    }, [], null)

    this.emit('tookDamage', { id: this.id, damage })
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
    // InputManager.touch.addEventListener('tap', this.jump)
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

  public async launchProjectile (shoot: Shoot) {
    this.weaponType = shoot.weaponType
    this.scaleX = shoot.scaleX
    this.x = shoot.characterX
    this.y = shoot.characterY

    switch (this.weaponType) {
      case WeaponType.Distance:
        this.projectileDirFront.setVisible(false)
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

        this.scene.cameras.main.startFollow(projectile, false, 0.1, 0.1)

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
          origin: this,
          kind: this.characterAsset.kind,
          modifiers: this.characterAsset.melee,
          scaleX: this.scaleX
        })
        break
    }
  }

  public onProjectileLaunch: ProjectileLaunchEventHandler = async (evt) => {
    if (!this.controlsEnabled) return

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
    let distance = position.clone().distance(new Phaser.Math.Vector2(this.x, this.y))
    this.projectileDir.clear()
    this.projectileDir.lineStyle(4, 0x32ffce, 0.5)
    this.projectileDir.lineBetween(this.x, this.y, evt.detail.pointer.worldX, evt.detail.pointer.worldY)
    const rotation = Math.atan((evt.detail.pointer.worldY - this.y) / (evt.detail.pointer.worldX - this.x)) + (Math.PI * (evt.detail.pointer.worldX - this.x > 0 ? 1 : 2))
    this.projectileDirFront
      .setOrigin(0, 0.5)
      .setPosition(this.x, this.y)
      .setRotation(rotation)
      .setVisible(true)
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
    this.projectileDirFront.setVisible(false)
    if (this.weaponType === WeaponType.Distance) {
      AudioManager.playUniqueSfx('switch', { volume: 0.8 })
    } else {
      AudioManager.playUniqueSfx('switch_back', { volume: 0.8 })
    }
    this.weaponType = this.weaponType === WeaponType.Distance ? WeaponType.Melee : WeaponType.Distance
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
    const velocity = InputManager.getAxis('horizontal') * SPEED * this.characterAsset.stats[MOVE_ABILITY_ID].level
    if (this.cursorKeys.space!.isDown) {
      this.jump()
    }
    this.setVelocityX(velocity)
  }

  private turn = (direction: 'left' | 'right') => {
    const { width, offsetX, offsetY } = this.characterAsset.body
    if (direction === 'left') {
      this.scaleX = -1
      this.setOffset(width + offsetX, offsetY)
    } else {
      this.setOffset(offsetX, offsetY)
      this.scaleX = 1
    }
  }

  private jump = () => {
    if (this.body.blocked.down) {
      AudioManager.playSfx('jump', { volume: 0.2 })
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
