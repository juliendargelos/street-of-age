import { ClientCharactersAsset } from '@/@types'
// import serverCharacters from '@street-of-age/shared/characters'
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

interface CharacterStat {
  id: string,
  name: string,
  level: number
}

export type CharactersAsset = { [kind: string]: CharacterAsset }

export type CharacterStats = {
  [stat: string]: CharacterStat
}

export interface CharacterAsset {
  name: string,
  kind: string,
  team: string,
  stats: CharacterStats
}

const MOVE_ABILITY = 'Déplacement'
const MOVE_ABILITY_ID = 'move'
const JUMP_ABILITY = 'Saut'
const JUMP_ABILITY_ID = 'jump'
const STRENGHT_ABILITY = 'Force'
const STRENGHT_ABILITY_ID = 'strenght'

const Egocentric: CharacterAsset = {
  team: 'young',
  kind: 'egocentric',
  name: 'L\'influenceuse',
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 50
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
      level: 50
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 50
    }
  }
}

const Fattie: CharacterAsset = {
  team: 'young',
  kind: 'fattie',
  name: 'La boulette',
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 50
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
      level: 50
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 50
    }
  }
}

const FustyGrandpa: CharacterAsset = {
  team: 'old',
  kind: 'fusty-grandpa',
  name: 'Papivresse',
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 50
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
      level: 50
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 50
    }
  }
}

const Geek: CharacterAsset = {
  team: 'young',
  kind: 'geek',
  name: 'Le geek metalleux',
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 50
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
      level: 50
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 50
    }
  }
}

const Hippie: CharacterAsset = {
  team: 'young',
  kind: 'hippie',
  name: 'Le bobo',
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 50
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
      level: 50
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 50
    }
  }
}

const LapdogWoman: CharacterAsset = {
  team: 'old',
  kind: 'lapdog-woman',
  name: 'La folle aux chiens',
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 50
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
      level: 50
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 50
    }
  }
}

const MrMuscle: CharacterAsset = {
  team: 'old',
  kind: 'mr-muscle',
  name: 'Le kéké',
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 50
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
      level: 50
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 50
    }
  }
}

const serverCharacters: CharactersAsset = {
  [CharacterKind.Egocentric]: Egocentric,
  [CharacterKind.Fattie]: Fattie,
  [CharacterKind.FustyGrandpa]: FustyGrandpa,
  [CharacterKind.Geek]: Geek,
  [CharacterKind.Hippie]: Hippie,
  [CharacterKind.LapdogWoman]: LapdogWoman,
  [CharacterKind.MrMuscle]: MrMuscle
}

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
