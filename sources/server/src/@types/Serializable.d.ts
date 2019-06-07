interface SerializedArray extends Array<SerializedValue> {}
type SerializedValue = undefined | null | boolean | number | string | Serialized | SerializedArray
declare type SerializedObject = { [key: string]: SerializedValue }
declare type Serialized = SerializedArray | SerializedObject

declare interface Serializable<T extends Serialized> {
  serialize(): T
}
