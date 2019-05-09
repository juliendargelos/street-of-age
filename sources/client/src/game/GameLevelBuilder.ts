import Level from '@street-of-age/shared/game/level'
import { Level as ILevel } from '@street-of-age/shared/@types'
import GameLevel from '@/game/entities/GameLevel'

class GameLevelBuilder {
  public build = ({ title, background, sprites, bodies, floors }: ILevel) =>
    new GameLevel(title, background, sprites, bodies, floors)
}

export default new GameLevelBuilder()
