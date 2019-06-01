import { ClientCharactersAsset } from '@/@types'
import serverCharacters from '@street-of-age/shared/characters'
import { CharacterKind } from '@/store/modules/app'

const egocentric = require('./pictures/egocentric.png')
const egocentricFace = require('./pictures/egocentric_face.png')
const fattie = require('./pictures/fattie.png')
const fattieFace = require('./pictures/fattie_face.png')
const fustyGrandpa = require('./pictures/fusty_grandpa.png')
const fustyGrandpaFace = require('./pictures/fusty_grandpa_face.png')
const geek = require('./pictures/geek.png')
const geekFace = require('./pictures/geek_face.png')
const hippie = require('./pictures/hippie.png')
const hippieFace = require('./pictures/hippie_face.png')
const lapdogWoman = require('./pictures/lapdog_woman.png')
const lapdogWomanFace = require('./pictures/lapdog_woman_face.png')
const mrMuscle = require('./pictures/mr_muscle.png')
const mrMuscleFace = require('./pictures/mr_muscle_face.png')

const pictures: { [kind: string]: { face: string, full: string }} = {
  [CharacterKind.Egocentric]: {
    face: egocentricFace,
    full: egocentric
  },
  [CharacterKind.LapdogWoman]: {
    face: lapdogWomanFace,
    full: lapdogWoman
  },
  [CharacterKind.Fattie]: {
    face: fattieFace,
    full: fattie
  },
  [CharacterKind.MrMuscle]: {
    face: mrMuscleFace,
    full: mrMuscle
  },
  [CharacterKind.Hippie]: {
    face: hippieFace,
    full: hippie
  },
  [CharacterKind.Geek]: {
    face: geekFace,
    full: geek
  },
  [CharacterKind.FustyGrandpa]: {
    face: fustyGrandpaFace,
    full: fustyGrandpa
  }
}

let characters: ClientCharactersAsset = {}

for (const kind in serverCharacters) {
  characters[kind] = { ...serverCharacters[kind], picture: pictures[kind] }
}

export default characters
