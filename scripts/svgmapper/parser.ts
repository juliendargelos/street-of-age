import { parseSync } from 'svgson'
import {Level, Sprite, Sprites, Body} from './@types'

const COLLIDERS_GROUP = ['colliders', 'Colliders', 'Bodies', 'bodies']

const DEFAULT_BACKGROUND_FROM = '#4C86B0'
const DEFAULT_BACKGROUND_TO = '#2F1C66'

type ParseTransformResult = { [key: string]: number[] }

const parseTransform = (transform: string): ParseTransformResult =>  {
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
  const rootGroup = root.children.find((node: any) => node.name === 'g' && node.attributes.id === title)!
  const layers: any[] = rootGroup.children.filter((node: any) => node.name === 'g' && !COLLIDERS_GROUP.includes(node.attributes.id))
  const colliderLayer: any = rootGroup.children.find((node: any) => node.name === 'g' && COLLIDERS_GROUP.includes(node.attributes.id))!
  const colliderTranslate = parseTransform(colliderLayer.attributes.transform).translate

  const sprites: Sprites = layers.reduce((acc, value) => {
    const translate = parseTransform(value.attributes.transform).translate
    acc[value.attributes.id] = value.children
      .filter((node: any) => node.name === 'image')
      .map((node: any) => {
        const texture = node.attributes.id.includes('/') ?
          node.attributes.id.split('/')[0] :
          node.attributes.id
        return ({
          id: node.attributes.id,
          x: parseFloat(node.attributes.x) + translate[0],
          y: parseFloat(node.attributes.y) + translate[1],
          texture: texture,
          frame: node.attributes.id.includes('/') ? node.attributes.id : null,
          width: parseFloat(node.attributes.width),
          height: parseFloat(node.attributes.height),
        }) as Sprite
      })
    return acc
  }, {})

  const bodies: Body[] = colliderLayer.children
    .filter((node: any) => node.name === 'rect')
    .map((node: any) => ({
      x: parseFloat(node.attributes.x) + colliderTranslate[0],
      y: parseFloat(node.attributes.y) + colliderTranslate[1],
      width: parseFloat(node.attributes.width),
      height: parseFloat(node.attributes.height),
    }) as Body)

  return {
    title,
    background: {
      from: DEFAULT_BACKGROUND_FROM,
      to: DEFAULT_BACKGROUND_TO
    },
    bodies,
    sprites
  }
}
