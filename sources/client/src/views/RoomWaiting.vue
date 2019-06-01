<template>
  <div class="room-waiting">
      <div class="room-waiting__team--old">
        {{ players.get('young') }}
      </div>
      <div class="room-waiting__separator">
        <h2>VS</h2>
      </div>
      <div class="room-waiting__team--young">
        {{ players.get('old') }}
      </div>
  </div>
</template>

<style lang="sass">
.room-waiting
  height: 100%
  padding: 0 60px
  display: flex
  color: $white
  &__team--old
    flex: 2
  &__separator
    flex: 1
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
  &__team--young
    flex: 2
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Player, Room as RoomType } from '@/@types'
import RoomModule from '@/store/modules/room'
import { SerializedPlayer } from '@street-of-age/shared/entities/player'
import { groupBy } from '@/utils/functions'
import AppModule from '@/store/modules/app'

@Component<RoomWaiting>({
  mounted (): void {
    if (!this.player.team) {
      this.$router.replace({ name: 'room-setup-team', params: { id: this.room.id } })
    }
  }
})
export default class RoomWaiting extends Vue {
  get room (): RoomType {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  }
  get player (): Player {
    return AppModule.player
  }
  get players (): Map<string, SerializedPlayer[]> {
    return groupBy(this.room.players.filter(player => player.team && player.characterKind), player => player.team)
  }
}
</script>
