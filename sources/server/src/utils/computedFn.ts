/**
 * https://github.com/mobxjs/mobx-utils/blob/a7076d5b42d31e423e27e17d8696b428838412e2/src/computedFn.ts
 *
 * MIT License
 *
 * Copyright (c) 2016 MobX
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { IComputedValue, computed, onBecomeUnobserved, _isComputingDerivation, isAction } from 'mobx'

class DeepMapEntry<T> {
  private root: Map<any, any>
  private closest: Map<any, any>
  private closestIdx: number = 0
  isDisposed = false

  constructor(private base: Map<any, any>, private args: any[]) {
    let current: undefined | Map<any, any> = this.closest = this.root = base
    let i = 0
    for(; i < this.args.length -1; i++) {
      current = current!.get(args[i])
      if (current)
        this.closest = current
      else
        break
    }
    this.closestIdx = i
  }

  exists(): boolean {
    this.assertNotDisposed()
    const l = this.args.length
    return this.closestIdx >= l - 1 && this.closest.has(this.args[l - 1])
  }

  get(): T {
    this.assertNotDisposed()
    if (!this.exists())
      throw new Error("Entry doesn't exist")
    return this.closest.get(this.args[this.args.length - 1])
  }

  set(value: T) {
    this.assertNotDisposed()
    const l = this.args.length
    let current: Map<any, any> = this.closest
    for(let i = this.closestIdx; i < l - 1; i++) {
      const m = new Map()
      current.set(this.args[i], m)
      current = m
    }
    this.closestIdx = l - 1
    this.closest = current
    current.set(this.args[l - 1], value)
  }

  delete() {
    this.assertNotDisposed()
    if (!this.exists())
      throw new Error("Entry doesn't exist")
    const l = this.args.length
    this.closest.delete(this.args[l - 1])
    let c = this.root
    const maps: Map<any, any>[] = [c]
    for (let i = 0; i < l - 1; i++) {
      c = c.get(this.args[i])!
      maps.push(c)
    }
    for (let i = maps.length - 1; i > 0; i--) {
      if (maps[i].size === 0)
        maps[i - 1].delete(this.args[i - 1])
    }
    this.isDisposed = true
  }

  private assertNotDisposed() {
    if (this.isDisposed) throw new Error("Concurrent modification exception")
  }
}

class DeepMap<T> {
  private store = new Map<any, any>()
  private argsLength = -1
  private last: DeepMapEntry<T>

  entry(args: any[]): DeepMapEntry<T> {
    if (this.argsLength === -1)
      this.argsLength = args.length
    else if (this.argsLength !== args.length)
      throw new Error(`DeepMap should be used with functions with a consistent length, expected: ${this.argsLength}, got: ${args.length}`)
    if (this.last) this.last.isDisposed = true

    return this.last = new DeepMapEntry(this.store, args)
  }
}

function computedFn<T extends Function>(fn: T, keepAlive = false) {
  if (isAction(fn))
    throw new Error("computedFn shouldn't be used on actions")

  let memoWarned = false;
  let i = 0;
  const d = new DeepMap<IComputedValue<any>>()

  return function(...args: any[]) {
    const self = this
    const entry = d.entry(args)
    if (entry.exists())
      return entry.get().get()
    if (!keepAlive && !_isComputingDerivation()) {
      if (!memoWarned) {
        console.warn("invoking a computedFn from outside an reactive context won't be memoized, unless keepAlive is set")
        memoWarned = true
      }
      return fn.apply(self, args)
    }
    const c = computed(() => {
      return fn.apply(self, args)
    }, {
      name: `computedFn(${fn.name}#${(++i)})`,
      keepAlive
    })
    entry.set(c)
    if (!keepAlive) onBecomeUnobserved(c, () => {
      d.entry(args).delete()
    })
    return c.get()
  }
}

function computedFnDecorator(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
  Object.defineProperty(target, propertyKey, {
    ...descriptor,
    value: computedFn(descriptor.value)
  })
}

export { computedFnDecorator as computedFn }
