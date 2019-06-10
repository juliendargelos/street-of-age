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
  hitDelay?: number,
  sound?: {
    volume?: number,
    key: string
  },
  force: number,
  offsetX?: number,
  offsetY?: number,
}

export interface CharacterBody {
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
}

export interface CharacterAsset {
  name: string,
  kind: string,
  team: string,
  body: CharacterBody
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
  body: {
    width: 26,
    height: 75,
    offsetX: 30,
    offsetY: 15
  },
  melee: {
    force: 0.80,
    delay: 500,
    sound: {
      key: 'melee_egocentric_sfx',
      volume: 0.6
    },
    distance: 40,
    damage: 1
  },
  projectile: {
    damage: 2,
    radiusDamage: 300,
    explosionMultiplier: 3,
    bounceTtl: null,
    ttl: 4000,
    bulletLike: false,
    mass: 1,
    bounciness: 0.7,
    deceleration: 100
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.375
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.625
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.65
    }
  }
}

const DotingGranny: CharacterAsset = {
  team: 'old',
  kind: 'doting-granny',
  name: 'Mamie gateau',
  body: {
    width: 40,
    height: 65,
    offsetX: 25,
    offsetY: 25
  },
  melee: {
    force: 2,
    delay: 300,
    distance: 40,
    damage: 2
  },
  projectile: {
    damage: 1,
    radiusDamage: 250,
    explosionMultiplier: 2,
    bounceTtl: null,
    ttl: 4000,
    bulletLike: false,
    mass: 1.33,
    bounciness: 0.4,
    deceleration: 100
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.75
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.5
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.25
    }
  }
}

const Fattie: CharacterAsset = {
  team: 'young',
  kind: 'fattie',
  name: 'La boulette',
  body: {
    width: 32,
    height: 75,
    offsetX: 27,
    offsetY: 15
  },
  melee: {
    force: 2,
    delay: 500,
    distance: 40,
    damage: 2
  },
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: 5,
    ttl: null,
    bulletLike: false,
    mass: 1.2,
    bounciness: 1.2,
    deceleration: 100
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.75
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.625
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.375
    }
  }
}

const FustyGrandpa: CharacterAsset = {
  team: 'old',
  kind: 'fusty-grandpa',
  name: 'Papivresse',
  body: {
    width: 45,
    height: 70,
    offsetX: 22,
    offsetY: 20
  },
  melee: {
    force: 0.7,
    delay: 750,
    distance: 230,
    hitDelay: 250,
    damage: 2,
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
      level: 0.75
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
  body: {
    width: 26,
    height: 85,
    offsetX: 30,
    offsetY: 5
  },
  melee: {
    force: 0.75,
    delay: 500,
    hitDelay: 400,
    sound: {
      key: 'melee_geek_sfx',
      volume: 0.6
    },
    distance: 300,
    damage: 1,
    offsetX: 0.1
  },
  projectile: {
    damage: 2,
    radiusDamage: 180,
    explosionMultiplier: 2.5,
    bounceTtl: 1,
    ttl: null,
    bulletLike: false,
    mass: 1.1,
    bounciness: 0.3,
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
      level: 0.75
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
  body: {
    width: 30,
    height: 85,
    offsetX: 30,
    offsetY: 5
  },
  melee: {
    force: 0.5,
    delay: 500,
    hitDelay: 200,
    distance: 280,
    damage: 2,
    offsetY: 0.15
  },
  projectile: {
    damage: 1,
    radiusDamage: 150,
    explosionMultiplier: 1.5,
    bounceTtl: 3,
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
      level: 0.625
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.625
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.25
    }
  }
}

const LapdogWoman: CharacterAsset = {
  team: 'old',
  kind: 'lapdog-woman',
  name: 'La folle aux chiens',
  body: {
    width: 26,
    height: 78,
    offsetX: 34,
    offsetY: 12
  },
  melee: {
    force: 1.5,
    delay: 800,
    sound: {
      key: 'melee_lapdog_woman_sfx',
      volume: 1
    },
    distance: 30,
    damage: 1
  },
  projectile: {
    damage: 2,
    radiusDamage: 160,
    explosionMultiplier: 2,
    bounceTtl: 1,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0.3,
    deceleration: 300
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.375
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.625
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.65
    }
  }
}

const MrMuscle: CharacterAsset = {
  team: 'old',
  kind: 'mr-muscle',
  name: 'Le keke',
  body: {
    width: 34,
    height: 85,
    offsetX: 30,
    offsetY: 5
  },
  melee: {
    force: 2.5,
    delay: 500,
    distance: 40,
    damage: 2
  },
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1.5,
    bounceTtl: 5,
    ttl: null,
    bulletLike: false,
    mass: 0.75,
    bounciness: 0.6,
    deceleration: 100
  },
  stats: {
    [CAC_ABILITY_ID]: {
      id: CAC_ABILITY_ID,
      name: CAC_ABILITY,
      level: 0.75
    },
    [DISTANCE_ABILITY_ID]: {
      id: DISTANCE_ABILITY_ID,
      name: DISTANCE_ABILITY,
      level: 0.5
    },
    [MOVE_ABILITY_ID]: {
      id: MOVE_ABILITY_ID,
      name: MOVE_ABILITY,
      level: 0.625
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
