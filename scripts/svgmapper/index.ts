import { readdirSync, readFileSync, writeFileSync } from 'fs'
import * as path from 'path'
import { parseSvg } from './parser'

const FILE_SUFFIX = 'level'

const sources = path.join(__dirname, 'sources')
const out = path.join(__dirname, 'out')

const svgs = readdirSync(sources)
  .filter(file => file.endsWith('svg'))
  .map(file => readFileSync(`${sources}/${file}`, {encoding: 'utf-8'}))

if (svgs.length === 0) {
  console.warn('No svg found in sources folder. Make sure that you have put some files.')
  process.exit(0)
}

svgs
  .map(parseSvg)
  .forEach(level => {
    const filename = `${level.title}.${FILE_SUFFIX}.json`
    writeFileSync(`${out}/${filename}`, JSON.stringify(level))
    console.info(`Successfully exported ${filename}`)
  })

