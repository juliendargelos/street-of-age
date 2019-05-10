interface SerializedArray extends Array<SerializedValue> {}
type SerializedValue = null | boolean | number | string | Serialized | SerializedArray

declare type Serialized = {
  [key: string]: SerializedValue
}

declare interface Serializable<T extends Serialized> {
  serialize(): T
}
