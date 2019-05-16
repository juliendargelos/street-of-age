import { Level as ILevel } from '@street-of-age/shared/src/@types'
import GameLevel from '@/game/entities/GameLevel'

class GameLevelBuilder {
  public build = ({ title, width, height, background, layers, floors }: ILevel) =>
    new GameLevel(title, width, height, background, layers, floors)
}

export default new GameLevelBuilder()
