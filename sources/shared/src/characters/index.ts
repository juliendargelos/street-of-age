// import {CharacterKind} from '../game/character'
// import {PlayerTeam} from '../entities/player'

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
  damage: number
}

export type CharactersAsset = { [kind: string]: CharacterAsset }

export type CharacterStats = {
  [stat: string]: CharacterStat
}

export interface CharacterAsset {
  name: string,
  kind: string,
  team: string,
  stats: CharacterStats,
  projectile: CharacterProjectile,
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
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0,
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
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0,
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
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0,
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
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0,
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

const Geek: CharacterAsset = {
  team: 'young',
  kind: 'geek',
  name: 'Le geek metalleux',
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0,
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
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0,
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
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0,
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
  projectile: {
    damage: 1,
    radiusDamage: 120,
    explosionMultiplier: 1,
    bounceTtl: null,
    ttl: null,
    bulletLike: false,
    mass: 1,
    bounciness: 0,
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

const characters: CharactersAsset = {
  ['egocentric']: Egocentric,
  ['doting-granny']: DotingGranny,
  ['fattie']: Fattie,
  ['fusty-grandpa']: FustyGrandpa,
  ['geek']: Geek,
  ['hippie']: Hippie,
  ['lapdog-woman']: LapdogWoman,
  ['mr-muscle']: MrMuscle
}

export default characters

