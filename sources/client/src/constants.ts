export const REGISTRY_LEVEL_KEY = 'level'
export const GRAVITY = 900

export const scale = (num: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin

interface CreatePhaserGradientOptions {
  width: number,
  height: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  colorStops: Array<{ offset: number, color: string }>
}

export const createPhaserGradient = (scene: Phaser.Scene, options: CreatePhaserGradientOptions, key: string = 'gradient'): string => {
  const canvasTexture = scene.textures.createCanvas(key, options.width, options.height)
  const src = canvasTexture.getSourceImage()
  // @ts-ignore
  const context = src.getContext('2d')
  const gradient = context.createLinearGradient(options.x0, options.y0, options.x1, options.y1)
  options.colorStops.forEach(stop => {
    gradient.addColorStop(stop.offset, stop.color)
  })
  context.fillStyle = gradient
  context.fillRect(0, 0, options.width, options.height)
  canvasTexture.refresh()
  return key
}
