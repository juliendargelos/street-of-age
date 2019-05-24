<template>
  <div id="app">
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
  background: url(~@/assets/background.jpg) no-repeat center center / cover
  font:
    family: $sans-serif
    size: 16px

  @at-root html, body, &
    height: 100%
    overflow: hidden
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RoomModule from '@/store/modules/room'
import AppModule from '@/store/modules/app'
import { PlayerEvents, RoomEvents } from '@street-of-age/shared/socket/events'

@Component({
  sockets: {
    [RoomEvents.RoomRefresh]: RoomModule.setRooms,
    [PlayerEvents.PlayerConnected]: AppModule.setPlayerId
  }
})
export default class App extends Vue {
}
</script>
