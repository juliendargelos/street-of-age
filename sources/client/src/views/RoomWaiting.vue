import {PlayerTeam} from "@street-of-age/shared/entities/player"
<template>
  <div class="room-waiting">
      <div class="room-waiting__team--old">
        <PlayerWaitingCard
          v-for="(player, index) in players.get('old')"
          :key="index"
          :characterKind="player.characterKind"
          :ready="player.ready"
        />
      </div>
      <div class="room-waiting__separator">
        <h2>VS</h2>
      </div>
      <div class="room-waiting__team--young">
        <PlayerWaitingCard
          v-for="(player, index) in players.get('young')"
          :key="index"
          :characterKind="player.characterKind"
          :ready="player.ready"
        />
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
import AppModule, { PlayerTeam } from '@/store/modules/app'
import PlayerWaitingCard from '@/components/PlayerWaitingCard.vue'

  @Component<RoomWaiting>({
    components: { PlayerWaitingCard },
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
    const youngs = new Array<SerializedPlayer>(this.room.settings.numberOfPlayers / 2)
      .fill({ ready: false, characterKind: null, team: PlayerTeam.Young, id: '' })
    const olds = new Array(this.room.settings.numberOfPlayers / 2)
      .fill({ ready: false, characterKind: null, team: PlayerTeam.Old, id: '' })
    const allPlayers = [
      ...youngs.map((entry, index) => this.room.players
        .filter(player => player.team === PlayerTeam.Young && player.characterKind)[index] || entry),
      ...olds.map((entry, index) => this.room.players
        .filter(player => player.team === PlayerTeam.Old && player.characterKind)[index] || entry)
    ]
    return groupBy(allPlayers, player => player.team)
  }
}
</script>
