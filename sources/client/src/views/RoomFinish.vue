<template>
  <div class="room-finish">
    <h1 class="road-rage">{{ winner ? 'Victoire' : 'Défaite' }}</h1>
    <div class="leaderboard">
      <div class="leaderboard__column leaderboard__column--old">
        <RoomFinishPlayerRow v-for="player in players.get('old')"
             :player="player"
             :player-number="getNumberForPlayer(player)"
             :death="player.numberOfDeaths"
             :kill="player.numberOfKills"
             :key="player.id" class="leaderboard__column__row"
             :class="{'is-local': isPlayerLocal(player)}"/>
      </div>
      <div class="leaderboard__column leaderboard__column--young">
        <RoomFinishPlayerRow v-for="player in players.get('young')"
             :player="player"
             :death="player.numberOfDeaths"
             :kill="player.numberOfKills"
             :player-number="getNumberForPlayer(player)"
             :key="player.id" class="leaderboard__column__row"
             :class="{'is-local': isPlayerLocal(player)}"/>
      </div>
    </div>
    <div class="actions">
      <AppButton
        secondary
        alternate
        block
        type="submit">
        Relancer
      </AppButton>
      <AppButton
        secondary
        block
        type="submit">
        Creer une partie
      </AppButton>
      <AppButton
        secondary
        block
        type="submit">
        Rejoindre une partie
      </AppButton>
    </div>
  </div>
</template>

<style lang="sass">
.room-finish
  height: 100%
  display: flex
  flex-direction: column
  h1
    margin: 20px
    font-size: 40px
    text-align: center
    text-transform: uppercase
  .duration
    background: linear-gradient(90deg, transparent 0%, transparent 33%, $grey 50%, transparent 67%, transparent 100%)
    text-align: center
    padding: 2px 0
    &:before
      content: url(~@/assets/time.png)
      margin-right: 0.3rem
      position: relative
      top: -1px
  .actions
    display: flex
    justify-content: space-evenly
    flex: 1
    align-items: center
  .leaderboard
    display: flex
    margin-top: 40px
    padding: 0 20px
    flex: 1
    align-items: center
    .leaderboard__column
      flex: 1
      &:first-of-type
        margin-right: 10px
      .player__row:first-of-type
        .player__row__metric
          &--life:after,&--death:after,&--kill:after
            content: ''
            position: absolute
            top: -25px
            left: 5px
            width: 14px
            height: 14px
            transform: skew(20deg)
          &--life:after
            background: url(~@/assets/icons/life.png) no-repeat center center / contain
          &--death:after
            background: url(~@/assets/icons/fall.png) no-repeat center center / contain
          &--kill:after
            background: url(~@/assets/icons/death.png) no-repeat center center / contain

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Room } from '@/@types'
import { SerializedPlayer } from '@street-of-age/shared/entities/player'
import { groupBy } from '@/utils/functions'
import AppModule from '@/store/modules/app'
import RoomFinishPlayerRow from '@/components/ui/RoomFinishPlayerRow.vue'
import RoomModule from '@/store/modules/room'

@Component<RoomFinish>({
  mounted () {
    AppModule.setIsPlaying(false)
  },
  components: { RoomFinishPlayerRow }
})
export default class RoomFinish extends Vue {
  get room (): Room {
    return RoomModule.rooms.find(r => r.id === this.$route.params.id) as Room
  }

  get winnerTeamKind (): string {
    let winnerTeamKind = ''

    this.players.forEach((players, teamKind) => {
      if (players.some(player => player.numberOfDeaths !== 3)) {
        winnerTeamKind = teamKind
      }
    })

    return winnerTeamKind
  }

  get winner (): boolean {
    return AppModule.player.teamKind === this.winnerTeamKind
  }

  public isPlayerLocal (player: SerializedPlayer): boolean {
    return player.id === AppModule.player.id
  }

  public getNumberForPlayer (player: SerializedPlayer): number {
    return this.room.players.indexOf(player) + 1
  }

  get players (): Map<string, SerializedPlayer[]> {
    return groupBy(this.room.players, player => player.teamKind)
  }
}
</script>
