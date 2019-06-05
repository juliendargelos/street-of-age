<template>
  <div id="app" :class="{ playing }">
    <!-- <nav>
      <router-link :to="{ name: 'home' }">Home</router-link>
      <router-link :to="{ name: 'debug-game' }">Debug</router-link>
      <router-link :to="{ name: 'room-list' }">Room List</router-link>
      <router-link :to="{ name: 'room-form' }">Room Create</router-link>
    </nav> -->
    <router-view :key="$route.fullPath"/>
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
  },
  beforeDestroy (): void {
    Emitter.removeListener(GameEvents.GameLoaded, this.onGameLoaded)
  }
})
export default class App extends Vue {
  public onGameLoaded () {
    AppModule.setIsPlaying(true)
  }
  get playing () {
    return AppModule.isPlaying
  }
}
</script>
