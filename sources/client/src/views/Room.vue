<template>
  <div class="room" v-if="this.isDefined">
<!--    {{ this.room }}-->
    <router-view v-if="currentStep === 'setup'"/>
    <RoomGame v-else :players="this.room.players"/>
  </div>
</template>

<style lang="sass">
.room
  height: 100%
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import RoomTeam from '@/components/RoomTeam.vue'
import RoomCharacter from '@/components/RoomCharacter.vue'
import RoomLobby from '@/components/RoomLobby.vue'
import RoomGame from '@/components/RoomGame.vue'
import RoomScore from '@/components/RoomScore.vue'
import { RoomEvents } from '@street-of-age/shared/socket/events'
import { Room as RoomType } from '@/@types'
import RoomModule from '@/store/modules/room'

@Component<Room>({
  sockets: {
    [RoomEvents.StartGame] () {
      this.currentStep = 'playing'
    },
    [RoomEvents.RoomDefined] () {
      this.isDefined = true
    },
    [RoomEvents.RoomUndefined] () {
      this.$router.replace({ name: 'room-list' })
    }
  },

  mounted () {
    this.$socket.emit(RoomEvents.RoomVerify, this.$route.params.id)
  },

  beforeRouteLeave (to, from, next) {
    this.$socket.emit(RoomEvents.RoomLeave, from.params.id)
    next()
  },

  components: {
    RoomTeam,
    RoomCharacter,
    RoomLobby,
    RoomGame,
    RoomScore
  }
})
export default class Room extends Vue {
  public isDefined: boolean = false
  public currentStep: 'setup' | 'playing' = 'setup'

  get room (): RoomType {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  }
}
</script>
