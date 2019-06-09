<template>
  <div id="app" :class="{ playing }">
    <router-view v-if="canPlay" :key="$route.fullPath"/>
    <div class="message-container" v-else>
      <div v-if="!isMobile">
        <img :src="require('@/assets/mobile.png')" alt="">
        <h1 class="road-rage-colors">Accessible sur mobile uniquement</h1>
      </div>
      <h1 class="road-rage-colors" v-else>Veuillez tourner votre appareil</h1>
    </div>
  </div>
</template>

<style lang="sass">
@import ~reset-css/sass/reset
@import ./stylesheets/app

#app
  background: url(~@/assets/background.gif) no-repeat center center / cover
  font:
    size: 16px
  .message-container
    display: flex
    padding: 20px
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    justify-content: center
    align-items: center
    font-family: 'Dead Jim', sans-serif
    font-size: 42px
    text-align: center
    img
      margin-bottom: 40px
  &.playing
    background: url(~@/assets/background.jpg) no-repeat center center / cover
  @at-root html, body, &
    height: 100%
    overflow: hidden
</style>

<script lang="ts">
import fscreen from 'fscreen'
import { Component, Vue } from 'vue-property-decorator'
import RoomModule from '@/store/modules/room'
import AppModule from '@/store/modules/app'
import { PlayerEvents, RoomEvents } from '@street-of-age/shared/socket/events'
import { Emitter } from '@/main'
import { GameEvents } from '@street-of-age/shared/game/events'

@Component<App>({
  sockets: {
    [RoomEvents.RoomRefresh]: RoomModule.setRooms,
    [PlayerEvents.PlayerConnected]: AppModule.setPlayerId
  },
  mounted (): void {
    Emitter.on(GameEvents.GameLoaded, this.onGameLoaded)

    if (this.orientationApiSupported) {
      window.screen.orientation.addEventListener('change', this.onOrientationChange)
    } else {
      // using addListener instead of addEventListener because it would not work in Safari
      this.mql.addListener(this.onOrientationChange)
    }
  },
  beforeDestroy (): void {
    Emitter.removeListener(GameEvents.GameLoaded, this.onGameLoaded)

    if (this.orientationApiSupported) {
      window.screen.orientation.removeEventListener('change', this.onOrientationChange)
    } else {
      this.mql.removeListener(this.onOrientationChange)
    }
  }
})
export default class App extends Vue {
  private mql = window.matchMedia('(orientation: portrait)')
  public orientation: 'portrait' | 'landscape' = this.mql.matches ? 'portrait' : 'landscape'
  public onGameLoaded () {
    AppModule.setIsPlaying(true)
  }
  public onOrientationChange () {
    if (this.orientationApiSupported) {
      this.orientation = window.screen.orientation.type.includes('landscape')
        ? 'landscape' : 'portrait'
      if (this.canPlay) {
        fscreen.requestFullscreen(this.$el)
      } else {
        if (fscreen.fullscreenElement !== null) {
          fscreen.exitFullscreen()
        }
      }
    } else {
      this.orientation = this.mql.matches ? 'portrait' : 'landscape'
    }
  }
  get orientationApiSupported () {
    return AppModule.orientationApiSupported
  }
  get isMobile () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
  get canPlay () {
    return this.orientation === 'landscape' && this.isMobile
  }
  get playing () {
    return AppModule.isPlaying
  }
}
</script>
