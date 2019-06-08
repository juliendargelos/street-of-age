import { ClientCharactersAsset } from '@/@types'
// import serverCharacters from '@street-of-age/shared/characters'
import { CharacterKind } from '@/store/modules/app'

const egocentric = require('./pictures/egocentric.png')
const egocentricFace = require('./pictures/egocentric_face.png')
const dotingGranny = require('./pictures/doting-granny.png')
const dotingGrannyFace = require('./pictures/doting-granny_face.png')
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

export interface CharacterProjectile {
  mass: number,
  bounciness: number,
  deceleration: number,
  ttl: number | null,
  bounceTtl: number | null,
  bulletLike: boolean,
  radiusDamage: number
  explosionMultiplier: number,
  damage: number,
  offsetX?: number,
  offsetY?: number,
}

export type CharactersAsset = { [kind: string]: CharacterAsset }

export type CharacterStats = {
  [stat: string]: CharacterStat
}

export interface CharacterMelee {
  distance: number,
  damage: number,
  delay: number,
  force: number,
  offsetX?: number,
  offsetY?: number,
}

export interface CharacterAsset {
  name: string,
  kind: string,
  team: string,
  stats: CharacterStats,
  melee: CharacterMelee,
  projectile: CharacterProjectile
}

const MOVE_ABILITY = 'Déplacement'
export const MOVE_ABILITY_ID = 'move'
const CAC_ABILITY = 'Corps à corps'
export const CAC_ABILITY_ID = 'cac'
const DISTANCE_ABILITY = 'Combat à distance'
export const DISTANCE_ABILITY_ID = 'distance'

const Egocentric: CharacterAsset = {
  team: 'young',
  kind: 'egocentric',
  name: 'L\'influenceuse',
  melee: {
    force: 1,
    delay: 500,
    distance: 100,
    damage: 1
  },
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0.6,
    deceleration: 100
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.5
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.5
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.5
    }
  }
}

const DotingGranny: CharacterAsset = {
  team: 'old',
  kind: 'doting-granny',
  name: 'Mamie gateau',
  melee: {
    force: 1,
    delay: 500,
    distance: 100,
    damage: 1
  },
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: 5,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0.4,
    deceleration: 100
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.5
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.5
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.5
    }
  }
}

const Fattie: CharacterAsset = {
  team: 'young',
  kind: 'fattie',
  name: 'La boulette',
  melee: {
    force: 1,
    delay: 500,
    distance: 100,
    damage: 1
  },
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0.6,
    deceleration: 100
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.5
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.5
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.5
    }
  }
}

const FustyGrandpa: CharacterAsset = {
  team: 'old',
  kind: 'fusty-grandpa',
  name: 'Papivresse',
  melee: {
    force: 0.7,
    delay: 750,
    distance: 230,
    damage: 1,
    offsetY: 0.35,
    offsetX: -0.1
  },
  projectile: {
    damage: 1,
    radiusDamage: 300,
    explosionMultiplier: 1,
    bounceTtl: 5,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0.6,
    deceleration: 200,
    offsetX: 24,
    offsetY: 6
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.5
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.2
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.5
    }
  }
}

const Geek: CharacterAsset = {
  team: 'young',
  kind: 'geek',
  name: 'Le geek metalleux',
  melee: {
    force: 1,
    delay: 500,
    distance: 100,
    damage: 1
  },
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0.6,
    deceleration: 100
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.5
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.5
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.5
    }
  }
}

const Hippie: CharacterAsset = {
  team: 'young',
  kind: 'hippie',
  name: 'Le bobo',
  melee: {
    force: 0.5,
    delay: 500,
    distance: 280,
    damage: 1,
    offsetY: 0.15
  },
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 3,
    bounceTtl: null,
    ttl: null,
    bulletLike: true,
    mass: 1,
    bounciness: 0.6,
    deceleration: 100
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.5
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.5
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.5
    }
  }
}

const LapdogWoman: CharacterAsset = {
  team: 'old',
  kind: 'lapdog-woman',
  name: 'La folle aux chiens',
  melee: {
    force: 1,
    delay: 500,
    distance: 100,
    damage: 1
  },
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0.6,
    deceleration: 100
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.5
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.5
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.5
    }
  }
}

const MrMuscle: CharacterAsset = {
  team: 'old',
  kind: 'mr-muscle',
  name: 'Le keke',
  melee: {
    force: 2,
    delay: 500,
    distance: 40,
    damage: 1
  },
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 3,
    bounceTtl: 6,
    ttl: null,
    bulletLike: false,
    mass: 3,
    bounciness: 0.6,
    deceleration: 200
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.5
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 1
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.5
    }
  }
}

const serverCharacters: CharactersAsset = {
  [CharacterKind.Egocentric]: Egocentric,
  [CharacterKind.DotingGranny]: DotingGranny,
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
  [CharacterKind.DotingGranny]: {
    face: dotingGrannyFace,
    full: dotingGranny
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
