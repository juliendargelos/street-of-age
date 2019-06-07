<template>
  <div class="room-waiting">
    <AppNav position="bottom">
      <BackButton :disabled="allReady"/>
    </AppNav>
      <div class="room-waiting__team room-waiting__team--old">
        <PlayerWaitingCard
          v-for="(player, index) in players.get('old')"
          :key="player.teamKind + '-' + index"
          :characterKind="player.characterKinds.length > 0 ? player.characterKinds[0] : null"
          :ready="player.ready"
        >
          <template slot="metadata">
            <span :style="getMetadataStyleForPlayer(player)">
              {{ player.ready ? `J${room.players.indexOf(player) + 1}` : player.characterKinds.length > 0 ?
            '...' : '' }}
            </span>
          </template>
        </PlayerWaitingCard>
      </div>
      <div class="room-waiting__separator">
        <h2>VS</h2>
      </div>
      <div class="room-waiting__team room-waiting__team--young">
        <PlayerWaitingCard
          v-for="(player, index) in players.get('young')"
          :key="player.teamKind + '-' + index"
          :characterKind="player.characterKinds.length > 0 ? player.characterKinds[0] : null"
          :ready="player.ready"
        >
          <template slot="metadata">
            <span :style="getMetadataStyleForPlayer(player)">
              {{ player.ready ? `J${room.players.indexOf(player) + 1}` : player.characterKinds.length > 0 ?
            '...' : '' }}
            </span>
          </template>
        </PlayerWaitingCard>
      </div>
  </div>
</template>

<style lang="sass">
.room-waiting
  height: 100%
  padding: 0 20px
  display: flex
  &__team
    position: relative
    display: flex
    justify-content: center
    > *
      margin: 0 5px
      &:first-of-type
        margin-left: 0
      &:last-of-type
        margin-right: 0
    &--old
      flex: 2
      top: -3px
      justify-content: flex-end
    &--young
      flex: 2
      align-self: flex-end
      bottom: -3px
      justify-content: flex-start
      & .character-card__metadata
        bottom: unset
        top: -30px

  &__separator
    flex: 1
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    transform: skew(6deg)
    text-transform: uppercase
    font-family: 'Dead Jim', sans-serif
    font-size: 100px
    position: relative
    left: -6px
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Player, Room as RoomType } from '@/@types'
import RoomModule from '@/store/modules/room'
import { SerializedPlayer } from '@street-of-age/shared/entities/player'
import { groupBy } from '@/utils/functions'
import AppModule, { PlayerTeam } from '@/store/modules/app'
import PlayerWaitingCard from '@/components/PlayerWaitingCard.vue'

  @Component<RoomWaiting>({
    components: { PlayerWaitingCard },
    mounted (): void {
      if (!this.player.teamKind) {
        this.$router.replace({ name: 'room-setup-team', params: { id: this.room.id } })
      }
      window.addEventListener('keydown', e => {
        if (e.code === 'KeyF') {
          this.$router.push({ name: 'room-finish', params: { id: this.room.id } })
        }
      })
    }
  })
export default class RoomWaiting extends Vue {
  public getMetadataStyleForPlayer (player: SerializedPlayer) {
    return {
      color: player.color
    }
  }
  get room (): RoomType {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  }
  get player (): Player {
    return AppModule.player
  }
  get players (): Map<string, SerializedPlayer[]> {
    const youngs = new Array<SerializedPlayer>(this.room.settings.numberOfPlayers / 2)
      .fill({ color: '', ready: false, characterKinds: [], teamKind: PlayerTeam.Young, id: '' })
    const olds = new Array(this.room.settings.numberOfPlayers / 2)
      .fill({ color: '', ready: false, characterKinds: [], teamKind: PlayerTeam.Old, id: '' })
    const allPlayers = [
      ...youngs.map((entry, index) => this.room.players
        .filter(player => player.teamKind === PlayerTeam.Young && player.characterKinds.length > 0)[index] || entry),
      ...olds.map((entry, index) => this.room.players
        .filter(player => player.teamKind === PlayerTeam.Old && player.characterKinds.length > 0)[index] || entry)
    ]
    return groupBy(allPlayers, player => player.teamKind)
  }
  get allReady (): boolean {
    return this.room.players.length === this.room.settings.numberOfPlayers &&
      this.room.players.every(player => player.ready)
  }
}
</script>
