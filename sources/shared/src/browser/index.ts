if (typeof window === 'undefined') {
  const path = require('path')
  const Datauri = require('datauri')
  const { JSDOM } = require('jsdom')

  const { window } = new JSDOM('', {
    url: 'https://street-of-age.com',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  })

  window.URL.createObjectURL = (blob: any) => blob && Datauri.format(
    blob.type,
    blob[Object.getOwnPropertySymbols(blob)[0]]._buffer
  ).content

  window.URL.revokeObjectURL = (objectURL: any) => {}

  Object.assign(global, window)
  global.Element = window.Element
  global.Image = window.Image
  global.HTMLCanvasElement= window.HTMLCanvasElement
}
