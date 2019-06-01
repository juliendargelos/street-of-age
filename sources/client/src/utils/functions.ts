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

export const gameWait = (
  clock: Phaser.Time.Clock,
  ms: number
): Promise<Phaser.Time.TimerEvent> =>
  new Promise(resolve => {
    return clock.addEvent({
      callback: resolve,
      delay: ms
    })
  })
