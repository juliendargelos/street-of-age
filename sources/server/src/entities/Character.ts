import { observable } from 'mobx'
import { Entity, Collection } from '../core'
import { computedFn } from '../utils'
import { TeamKind } from './Team'

export enum CharacterKind {
  Egocentric = 'egocentric',
  Geek = 'geek',
  Hippie = 'hippie',
  DotingGranny = 'doting-granny',
  FustyGrandpa = 'fusty-grandpa',
  LapdogWoman = 'lapdog-woman',
  MrMuscle = 'mr-muscle',
  Fattie = 'fattie',
}

export const CharacterKindTeams: { [P in TeamKind]: CharacterKind[] } = {
  [TeamKind.Young]: [
    CharacterKind.Egocentric,
    CharacterKind.Geek,
    CharacterKind.Hippie,
    CharacterKind.Fattie
  ],
  [TeamKind.Old]: [
    CharacterKind.DotingGranny,
    CharacterKind.FustyGrandpa,
    CharacterKind.LapdogWoman,
    CharacterKind.MrMuscle
  ]
}

export interface SerializedCharacter extends SerializedObject {
  id: string
  kind: CharacterKind
  x?: number
  y?: number
  velocityX?: number
  velocityY?: number
}

const all = new Collection<Character>()

export class Character extends Entity implements Serializable<SerializedCharacter> {
  public static all = all
  public static collection = all.collection

  @observable public readonly kind: CharacterKind
  @observable public x: number
  @observable public y: number
  @observable public velocityX: number
  @observable public velocityY: number

  constructor(
    kind: CharacterKind,
    x: number = 0,
    y: number = 0,
    velocityX: number = 0,
    velocityY: number = 0
  ) {
    super()
    this.kind = kind
    this.x = x
    this.y = y
    this.velocityX = velocityX
    this.velocityY = velocityY
  }

  @computedFn public serialize(): SerializedCharacter {
    return {
      id: this.id,
      kind: this.kind,
      x: this.x,
      y: this.y,
      velocityX: this.velocityX,
      velocityY: this.velocityY
    }
  }

  @computedFn public belongsTo(teamKind: TeamKind): boolean {
    return CharacterKindTeams[teamKind].includes(this.kind)
  }
}
