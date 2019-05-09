import { Level as ILevel } from '../@types'
import Level from '../game/level'

export default abstract class Builder {
  public abstract build (level: ILevel): Level
}
