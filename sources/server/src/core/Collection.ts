import { observable, computed, action } from 'mobx'
import { computedFn } from '../utils'
import { Entity } from './Entity'

export class Collection<T extends Entity = Entity> implements Serializable<SerializedArray> {
  ['constructor']: typeof Collection

  @observable private entities: Map<string, T> = new Map()
  private readonly children: Collection<T>[] = []

  constructor(
    entities: T[] | Collection<T> = [],
    private parent: Collection<T> = null
  ) {
    this.parent = parent
    this.concat(entities)
  }

  @computed get length() {
    return this.entities.size
  }

  @computed get array(): T[] {
    return [...this.entities].map(([_, entity]) => entity)
  }

  @computedFn *[Symbol.iterator]() {
    return this.array[Symbol.iterator]()
  }

  @computedFn serialize(): SerializedArray {
    return this.map(entity => entity.serialize())
  }

  @computedFn has(entity: T): boolean {
    return this.entities.has(entity.id)
  }

  @computedFn get(id: string): T {
    return this.entities.get(id)
  }

  @computedFn at(index: number): T {
    return this.array[index]
  }

  @computedFn some(callback: (entity: T, index: number) => boolean): boolean {
    return this.array.some(callback.bind(this))
  }

  @computedFn every(callback: (entity: T, index: number) => boolean): boolean {
    return this.array.every(callback.bind(this))
  }

  @computedFn find(callback: (entity: T, index: number) => boolean): T {
    return this.array.find(callback.bind(this))
  }

  @computedFn filter(callback: (entity: T, index: number) => boolean): this {
    return new this.constructor(this.array.filter(callback.bind(this))) as this
  }

  @computedFn map(callback: (entity: T, index: number) => any): any[] {
    return this.array.map(callback.bind(this))
  }

  @computedFn reduce(callback: (accumulator: any, entity: T, index: number) => any, initialValue: any = null): any {
    callback = callback.bind(this)
    return arguments.length > 1
      ? this.array.reduce(callback, initialValue)
      : this.array.reduce(callback)
  }

  @computedFn forEach(callback: (entity: T, index: number) => any): this {
    this.array.forEach(callback.bind(this))
    return this
  }

  @action add(entity: T, bubble: boolean = true, propagate: boolean = true): T {
    bubble && this.parent && this.parent.add(entity, true, false)
    propagate && this.children.forEach(collection => collection.update(entity, false, true))
    this.entities.set(entity.id, entity)
    return entity
  }

  @action remove(entity: T, bubble: boolean = true, propagate: boolean = true): T {
    if (this.has(entity)) {
      bubble && this.parent && this.parent.remove(entity, true, false)
      propagate && this.children.forEach(collection => collection.remove(entity, false, true))
      this.entities.delete(entity.id)
    }

    return entity
  }

  @action update(entity: T, bubble: boolean = true, propagate: boolean = true): T {
    if (this.has(entity)) this.add(entity, bubble, propagate)
    return entity
  }

  @action concat(entities: T[] | Collection<T> = []): this {
    entities.forEach(entity => this.add(entity))
    return this
  }

  @action set(entities: T[] | Collection<T> = []): this {
    return this.clear().concat(entities)
  }

  @action clear(): this {
    this.entities.clear()
    return this
  }

  public collection = (child: T[] | Collection<T> = []): Collection<T> => (
    this.addChild(new this.constructor(child, this))
  )

  private addChild(collection: Collection<T>): Collection<T> {
    this.children.push(collection)
    return collection
  }

  public removeChild(collection: Collection<T>): Collection<T> {
    const index = this.children.indexOf(collection)
    if (index !== -1) this.children.splice(index, 1)
    return collection
  }

  public dispose(): this {
    if (this.parent) {
      this.parent.removeChild(this)
      this.parent = null
    }

    this.forEach(entity => entity.dispose())
    this.children && this.children.forEach(collection => collection.dispose())

    return this
  }
}
