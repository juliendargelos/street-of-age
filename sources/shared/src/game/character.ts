import Phaser from './phaser'
import { GRAVITY } from './game'
import { PlayerTeam } from '../entities/player'

const MASS = 1
const JUMP_FORCE = 1.8
const BOUNCE = 0.2

export enum CharacterKind {
  Egocentric = 'egocentric',
  Geek = 'geek',
  Hippie = 'hippie',
  DotingGranny = 'doting-granny',
  FustyGrandpa = 'fusty-grandpa',
  LapdogWoman = 'lapdgog-woman'
}

export interface SerializedCharacter extends Serialized {
  id: string
  kind: CharacterKind
  x: number
  y: number
  velocityX: number
  velocityY: number
}

export class Character extends Phaser.Physics.Arcade.Sprite implements Serializable<SerializedCharacter> {
  public readonly id: string
  public readonly kind: CharacterKind

  constructor(
    scene: Phaser.Scene,
    attributes: SerializedCharacter
  ) {
    super(scene, 0, 0, `characters/${attributes.kind}`)
    this.id = attributes.id
    this.kind = attributes.kind

    scene.physics.world.enable(this)
    this.setBounce(BOUNCE)
    this.setCollideWorldBounds(true)
    this.body.setMass(MASS)
    this.setPosition(attributes.x, attributes.y)
    this.setVelocity(attributes.velocityX, attributes.velocityY)

    scene.add.existing(this)
  }

  public update() {
    this.setGravityY(GRAVITY)
  }

  public serialize(): SerializedCharacter {
    return {
      id: this.id,
      kind: this.kind,
      x: this.x,
      y: this.y,
      velocityX: this.body.velocity.x,
      velocityY: this.body.velocity.y
    }
  }
}
