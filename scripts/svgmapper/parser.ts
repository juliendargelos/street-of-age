import {parseSync} from 'svgson'
import {Collider, Floor, Layers, Level, Sprite} from '../../sources/shared/src/@types'
import {Layer} from '../../sources/shared/src/@types/sprite'
import {Hole} from '../../sources/shared/src/@types/level'

const FLOOR_GROUP = ['floors', 'Floor', 'floors', 'Floors', 'ground', 'Ground']
const HOLES_GROUP = ['holes', 'Hole', 'Holes', 'hole']
const LAYER_MASK_EXCLUDE = [...FLOOR_GROUP, ...HOLES_GROUP]

const DEFAULT_BACKGROUND_FROM = '#4C86B0'
const DEFAULT_FLOOR_COLOR = 0x040310
const DEFAULT_HOLES_COLOR = 0x252341
const DEFAULT_BACKGROUND_TO = '#2F1C66'

type ParseTransformResult = { [key: string]: number[] }

const parseTransform = (transform: string): ParseTransformResult => {
  const b: ParseTransformResult = {}
  let matched: RegExpMatchArray
  for (const i in matched = transform.match(/(\w+)\(([^,)]+),?([^)]+)?\)/gi)) {
    const c = matched[i].match(/[\w\.\-]+/g)
    b[c.shift()] = c.map(parseFloat)
  }
  return b
}

export const parseSvg = (svgContent: string): Level => {
  const root = parseSync(svgContent)
  const title = root.children.find((node: any) => node.name === 'title')!.children[0].value
  // If we have a whitespace in the title, Sketch converts all whitespace with '-' character.
  const rootGroup = root.children.find((node: any) => node.name === 'g' && node.attributes.id === title.replace(' ', '-'))!
  const layersSvg: any[] = rootGroup.children.filter((node: any) => node.name === 'g' && !LAYER_MASK_EXCLUDE.includes(node.attributes.id))
  const floorLayer: any = rootGroup.children.find((node: any) => node.name === 'g' && FLOOR_GROUP.includes(node.attributes.id))!
  const holesLayer: any = rootGroup.children.find((node: any) => node.name === 'g' && HOLES_GROUP.includes(node.attributes.id))!
  let floors: Floor[] = []
  let holes: Hole[] = []
  if (floorLayer) {
    const floorTranslate = parseTransform(floorLayer.attributes.transform).translate
    floors = floorLayer.children
      .filter((node: any) => node.name === 'rect')
      .map((node: any) => ({
        x: parseFloat(node.attributes.x) + floorTranslate[0],
        y: parseFloat(node.attributes.y) + floorTranslate[1],
        width: parseFloat(node.attributes.width),
        height: parseFloat(node.attributes.height),
        color: DEFAULT_FLOOR_COLOR,
        pivot: {
          x: 0,
          y: 0
        }
      }) as Floor)
  }
  if (holesLayer) {
    const holesTranslate = parseTransform(holesLayer.attributes.transform).translate
    holes = holesLayer.children
      .filter((node: any) => node.name === 'rect')
      .map((node: any) => ({
        x: parseFloat(node.attributes.x) + holesTranslate[0],
        y: parseFloat(node.attributes.y) + holesTranslate[1],
        width: parseFloat(node.attributes.width),
        height: parseFloat(node.attributes.height),
        color: DEFAULT_HOLES_COLOR,
        pivot: {
          x: 0,
          y: 0
        }
      }) as Hole)
  }

  const layers: Layers = layersSvg.reduce((acc, value, index) => {
    const translate = value.attributes.transform ?
      parseTransform(value.attributes.transform).translate :
      [0, 0]
    const colliders = value.children
      .filter((node: any) => node.name === 'rect')
      .map((node: any) => ({
        x: parseFloat(node.attributes.x) + translate[0],
        y: parseFloat(node.attributes.y) + translate[1],
        width: parseFloat(node.attributes.width),
        height: parseFloat(node.attributes.height),
        pivot: {
          x: 0,
          y: 0
        }
      }) as Collider)
    const sprites = value.children
      .filter((node: any) => node.name === 'image')
      .map((node: any) => {
        const texture = node.attributes.id.includes('/') ?
          node.attributes.id.split('/')[0] :
          node.attributes.id
        // used to allow duplicate element in Sketch but always return the good atlas name by removing -Copy-xxx
        // suffix that sketch puts in id
        const id = (node.attributes.id as string)
          .replace(/-Copy(\S|)+/i, '')
        return ({
          id,
          x: parseFloat(node.attributes.x) + translate[0],
          y: parseFloat(node.attributes.y) + translate[1],
          texture: texture,
          frame: id.includes('/') ? id : null,
          width: parseFloat(node.attributes.width),
          height: parseFloat(node.attributes.height),
          pivot: {
            x: 0,
            y: 0
          }
        }) as Sprite
      })
    // in order to allow customizing the speed of a layer in Sketch, we arbitrary choose to set the speed
    // based on the layer name in sketch : {layer_name}-{speed}. If omitted, speed will be defaulted to 1.
    const [name, speed] = (value.attributes.id as string).split('-').map(val => val.trim())
    acc[name] = {
      options: {speed: speed ? Number(speed) : 1, depth: index + 1},
      colliders,
      sprites
    } as Layer
    return acc
  }, {})

  return {
    title,
    width: Number(root.attributes!.width.match(/\d+/)[0]),
    height: Number(root.attributes!.height.match(/\d+/)[0]),
    background: {
      from: DEFAULT_BACKGROUND_FROM,
      to: DEFAULT_BACKGROUND_TO
    },
    layers,
    floors,
    holes
  }
}
