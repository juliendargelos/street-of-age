declare module 'svgson' {
  export function stringify (json: object): string
  export function parseSync (svg: string): any
  export default function (svg: string): Promise<any>
}
