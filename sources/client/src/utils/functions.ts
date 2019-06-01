export const groupBy = <T>(items: Array<T>, getKey: (item: T) => keyof T | null): Map<string, Array<T>> => {
  const map = new Map()
  items.forEach(item => {
    const key = getKey(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  return map
}
