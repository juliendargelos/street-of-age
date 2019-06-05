<template>
  <div id="app" :class="{ playing }">
    <!-- <nav>
      <router-link :to="{ name: 'home' }">Home</router-link>
      <router-link :to="{ name: 'debug-game' }">Debug</router-link>
      <router-link :to="{ name: 'room-list' }">Room List</router-link>
      <router-link :to="{ name: 'room-form' }">Room Create</router-link>
    </nav> -->
    <router-view v-if="canPlay" :key="$route.fullPath"/>
    <h1 v-else>Veuillez tourner votre téléphone</h1>
  </div>
</template>

<style lang="sass">
@import ~reset-css/sass/reset
@import ./stylesheets/app

#app
  background: url(~@/assets/background.gif) no-repeat center center / cover
  font:
    size: 16px
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
    window.screen.orientation.addEventListener('change', this.onOrientationChange)
  },
  beforeDestroy (): void {
    Emitter.removeListener(GameEvents.GameLoaded, this.onGameLoaded)
    window.screen.orientation.removeEventListener('change', this.onOrientationChange)
  }
})
export default class App extends Vue {
  public orientation: OrientationType = window.screen.orientation.type
  public onGameLoaded () {
    AppModule.setIsPlaying(true)
  }
  public onOrientationChange () {
    this.orientation = window.screen.orientation.type
    if (this.canPlay) {
      fscreen.requestFullscreen(this.$el)
    } else {
      fscreen.exitFullscreen()
    }
  }
  get canPlay () {
    return this.orientation.includes('landscape')
  }
  get playing () {
    return AppModule.isPlaying
  }
}
</script>
