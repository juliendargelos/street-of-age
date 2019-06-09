import * as uuid from 'uuid/v4'
import { Collection } from './Collection'

export class Entity implements Serializable<SerializedObject> {
  public constructor(public readonly id: string = uuid()) {

  }

  public toString() {
    return `${this.constructor.name}(${this.id})`
  }

  public serialize(): SerializedObject {
    return {
      id: this.id
    }
  }

  public dispose() {

  }
}
