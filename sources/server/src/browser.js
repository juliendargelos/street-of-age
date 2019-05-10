import Datauri from 'datauri'
import { JSDOM } from 'jsdom'

const { window } = new JSDOM('', {
  url: 'https://street-of-age.com',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true
})

window.URL.createObjectURL = (blob) => blob && Datauri.format(
  blob.type,
  blob[Object.getOwnPropertySymbols(blob)[0]]._buffer
).content

window.URL.revokeObjectURL = (objectURL) => {}

Object.entries(Object.getOwnPropertyDescriptors(window)).forEach(([property, descriptor]) => {
  property in global || Object.defineProperty(global, property, descriptor)
})

global.Element = window.Element
global.Image = window.Image
global.HTMLCanvasElement = window.HTMLCanvasElement

