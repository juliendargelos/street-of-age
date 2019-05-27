<template>
  <div class="room-setup-character">
      <h1>room setup character</h1>
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
import { Room as RoomType } from '@/@types'
import RoomModule from '@/store/modules/room'

@Component<RoomSetupCharacter>({
  components: {
    RoomTeam,
    RoomCharacter,
    RoomLobby,
    RoomGame,
    RoomScore
  }
})
export default class RoomSetupCharacter extends Vue {
  get room (): RoomType {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  }
}
</script>
