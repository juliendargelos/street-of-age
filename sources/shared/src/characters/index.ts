// import {CharacterKind} from '../game/character'
// import {PlayerTeam} from '../entities/player'

interface CharacterStat {
  id: string,
  name: string,
  level: number
}

export interface CharacterProjectile {
  mass: number
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
const MOVE_ABILITY_ID = 'move'
const JUMP_ABILITY = 'Saut'
const JUMP_ABILITY_ID = 'jump'
const STRENGHT_ABILITY = 'Force'
const STRENGHT_ABILITY_ID = 'strenght'


const Egocentric: CharacterAsset = {
  team: 'young',
  kind: 'egocentric',
  name: 'L\'influenceuse',
  projectile: {
    mass: 1
  },
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 0.5
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
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
  projectile: {
    mass: 1
  },
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 0.5
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
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
    mass: 1
  },
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 0.5
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
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
    mass: 1
  },
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 0.5
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
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
    mass: 1
  },
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 0.5
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
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
    mass: 1
  },
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 0.5
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
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
    mass: 1
  },
  stats: {
    [JUMP_ABILITY_ID]: {
      id: JUMP_ABILITY_ID,
      name: JUMP_ABILITY,
      level: 0.5
    },
    [STRENGHT_ABILITY_ID]: {
      id: STRENGHT_ABILITY_ID,
      name: STRENGHT_ABILITY,
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

