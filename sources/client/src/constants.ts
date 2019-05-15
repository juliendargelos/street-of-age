export const REGISTRY_LEVEL_KEY = 'level'
export const GRAVITY = 900

export const scale = (num: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
