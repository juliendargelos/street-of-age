import { GameManager } from './GameManager'
import GameModule from '@/store/modules/game'

const BG_MUSIC = 'bg'
const BG_VOLUME = 0.1
const AMBIANT_VOLUME = 0.1
const SFX_VOLUME = 0.05

type ExtraConfig = Partial<Phaser.Types.Sound.SoundConfig & Phaser.Types.Sound.SoundMarker>

class AudioManager {
  private sound: Phaser.Sound.BaseSoundManager | undefined
  private bg?: Phaser.Sound.BaseSound
  private layeredSounds: Phaser.Sound.WebAudioSound[] = []
  private ambiant?: Phaser.Sound.BaseSound
  private uniqueSfx?: Phaser.Sound.BaseSound

  get muted () {
    if (!this.sound) return false
    return this.sound.mute
  }

  set volume (value: number) {
    if (!this.sound) return
    this.sound.volume = value
  }

  public init = (gm: GameManager) => {
    if (gm.currentScene) {
      this.sound = gm.game.sound
      this.sound.pauseOnBlur = true
      this.sound.volume = GameModule.settings.volume.music
    }
  }

  get ambientPlaying () {
    return this.ambiant && this.ambiant.isPlaying
  }

  public toggleSounds = (): void => {
    if (!this.sound) return
    this.sound.mute = !this.sound.mute
    GameModule.setVolumeMusic(
      !this.sound.mute ? 0 : 1
    )
  }

  public playSfx = (key: string, extra?: ExtraConfig) => {
    if (!this.sound) return
    this.sound.play(key, extra)
  }

  public playUniqueSfx = (key: string, extra?: ExtraConfig) => {
    if (this.uniqueSfx) {
      this.uniqueSfx.stop()
    }
    this.uniqueSfx = this.sound.add(key, {
      ...extra,
      volume: (extra && extra.volume) || SFX_VOLUME
    })
    this.uniqueSfx.play()
  }

  public stopUniqueSfx = (): void => {
    if (this.uniqueSfx) {
      this.uniqueSfx.stop()
    }
  }

  public playBg = (extra?: ExtraConfig): void => {
    if (!this.sound) return
    this.bg = this.sound.add(BG_MUSIC, {
      ...extra,
      volume: (extra && extra.volume) || BG_VOLUME,
      loop: true
    })
    this.bg.play()
  }

  public stopBg = (): void => {
    if (this.bg) {
      this.bg.stop()
    }
  }

  public stopAmbientMusic = (resumeBg: boolean = true): void => {
    if (this.ambiant) {
      this.ambiant.stop()
    }
    if (resumeBg && this.bg) {
      this.bg.resume()
    }
  }

  public playAmbientMusic = (
    key: string,
    extra: ExtraConfig & { playOverBg?: boolean } = { playOverBg: false }
  ): void => {
    if (!this.sound) return
    if (this.bg && !extra.playOverBg) {
      this.bg.pause()
    }
    this.ambiant = this.sound.add(key, {
      ...extra,
      seek: 0,
      volume: (extra && extra.volume) || AMBIANT_VOLUME,
      loop: true
    })
    this.ambiant.play()
  }

  public addLayeredSound = (
    key: string,
    extra?: ExtraConfig
  ): Phaser.Sound.WebAudioSound | undefined => {
    if (!this.sound) return
    const sound = this.sound.add(key, extra) as Phaser.Sound.WebAudioSound
    this.layeredSounds.push(sound)
    return sound as Phaser.Sound.WebAudioSound
  }

  public getLayeredSound = (
    key: string
  ): Phaser.Sound.WebAudioSound | undefined => {
    return this.layeredSounds.find(sound => sound.key === key)
  }

  public stopLayeredSounds = (): void => {
    this.layeredSounds.forEach(sound => {
      sound.stop()
    })
    this.layeredSounds = []
  }
}

export default new AudioManager()
