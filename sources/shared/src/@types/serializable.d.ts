interface SerializedArray<T> extends Array<SerializedValue<T>> {}
type SerializedValue<T> = null | undefined | boolean | number | string | Serialized | SerializedArray<T> | T

declare type Serialized = {
  [key: string]: SerializedValue<any>
}

declare interface Serializable<T extends Serialized> {
  serialize(): T
}
