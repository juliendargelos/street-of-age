import { CharacterAsset, CharactersAsset } from '@/@types'
import { CharacterKind, PlayerTeam } from '@/store/modules/app'

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

const MOVE_ABILITY = 'Déplacement'
const JUMP_ABILITY = 'Saut'
const STRENGHT_ABILITY = 'Force'

const Egocentric: CharacterAsset = {
  team: PlayerTeam.Young,
  kind: CharacterKind.Egocentric,
  name: 'L\'influenceuse',
  picture: {
    face: egocentricFace,
    full: egocentric
  },
  stats: [
    {
      ability: MOVE_ABILITY,
      level: 12
    },
    {
      ability: JUMP_ABILITY,
      level: 50
    },
    {
      ability: STRENGHT_ABILITY,
      level: 72
    }
  ]
}

const Fattie: CharacterAsset = {
  team: PlayerTeam.Young,
  kind: CharacterKind.Fattie,
  name: 'La boulette',
  picture: {
    face: fattieFace,
    full: fattie
  },
  stats: [
    {
      ability: MOVE_ABILITY,
      level: 50
    },
    {
      ability: JUMP_ABILITY,
      level: 50
    },
    {
      ability: STRENGHT_ABILITY,
      level: 50
    }
  ]
}

const FustyGrandpa: CharacterAsset = {
  team: PlayerTeam.Old,
  kind: CharacterKind.FustyGrandpa,
  name: 'Papivresse',
  picture: {
    face: fustyGrandpaFace,
    full: fustyGrandpa
  },
  stats: [
    {
      ability: MOVE_ABILITY,
      level: 50
    },
    {
      ability: JUMP_ABILITY,
      level: 50
    },
    {
      ability: STRENGHT_ABILITY,
      level: 50
    }
  ]
}

const Geek: CharacterAsset = {
  team: PlayerTeam.Young,
  kind: CharacterKind.Geek,
  name: 'Le geek metalleux',
  picture: {
    face: geekFace,
    full: geek
  },
  stats: [
    {
      ability: MOVE_ABILITY,
      level: 50
    },
    {
      ability: JUMP_ABILITY,
      level: 50
    },
    {
      ability: STRENGHT_ABILITY,
      level: 50
    }
  ]
}

const Hippie: CharacterAsset = {
  team: PlayerTeam.Young,
  kind: CharacterKind.Hippie,
  name: 'Le bobo',
  picture: {
    face: hippieFace,
    full: hippie
  },
  stats: [
    {
      ability: MOVE_ABILITY,
      level: 50
    },
    {
      ability: JUMP_ABILITY,
      level: 50
    },
    {
      ability: STRENGHT_ABILITY,
      level: 50
    }
  ]
}

const LapdogWoman: CharacterAsset = {
  team: PlayerTeam.Old,
  kind: CharacterKind.LapdogWoman,
  name: 'La folle aux chiens',
  picture: {
    face: lapdogWomanFace,
    full: lapdogWoman
  },
  stats: [
    {
      ability: MOVE_ABILITY,
      level: 50
    },
    {
      ability: JUMP_ABILITY,
      level: 50
    },
    {
      ability: STRENGHT_ABILITY,
      level: 50
    }
  ]
}

const MrMuscle: CharacterAsset = {
  team: PlayerTeam.Old,
  kind: CharacterKind.MrMuscle,
  name: 'Le kéké',
  picture: {
    face: mrMuscleFace,
    full: mrMuscle
  },
  stats: [
    {
      ability: MOVE_ABILITY,
      level: 50
    },
    {
      ability: JUMP_ABILITY,
      level: 50
    },
    {
      ability: STRENGHT_ABILITY,
      level: 50
    }
  ]
}

const characters: CharactersAsset = {
  [CharacterKind.Egocentric]: Egocentric,
  [CharacterKind.Fattie]: Fattie,
  [CharacterKind.FustyGrandpa]: FustyGrandpa,
  [CharacterKind.Geek]: Geek,
  [CharacterKind.Hippie]: Hippie,
  [CharacterKind.LapdogWoman]: LapdogWoman,
  [CharacterKind.MrMuscle]: MrMuscle
}

export default characters
