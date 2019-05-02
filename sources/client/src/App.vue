<template>
  <div id="app">
    <nav>
      <router-link :to="{ name: 'home' }">Home</router-link>
      <router-link :to="{ name: 'room-list' }">Room List</router-link>
      <router-link :to="{ name: 'room-form' }">Room Create</router-link>
    </nav>
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<style lang="sass">
@import ~reset-css/sass/reset

#app
  @at-root html, body, &
    height: 100%
    overflow: hidden

  font:
    family: $sans-serif
    size: 16px
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RoomEvents, PlayerEvents } from '~shared/socket/events'
import RoomModule from '@/store/modules/room'
import AppModule from '@/store/modules/app'

@Component({
  sockets: {
    [RoomEvents.RoomRefresh]: RoomModule.setRooms,
    [PlayerEvents.PlayerConnected]: AppModule.setPlayerId
  }
})
export default class App extends Vue {
}
</script>
