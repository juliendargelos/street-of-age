<template>
  <div class="room-finish">
    <h1 class="road-rage">Victoire</h1>
    <div class="duration">04:43</div>
    <div class="leaderboard">
      <div class="leaderboard__column leaderboard__column--old">
        <RoomFinishPlayerRow v-for="player in players.get('old')"
             :player="player"
             :player-number="getNumberForPlayer(player)"
             :key="player.id" class="leaderboard__column__row"
             :class="{'is-local': isPlayerLocal(player)}"/>
      </div>
      <div class="leaderboard__column leaderboard__column--young">
        <RoomFinishPlayerRow v-for="player in players.get('young')"
             :player="player"
             :player-number="getNumberForPlayer(player)"
             :key="player.id" class="leaderboard__column__row"
             :class="{'is-local': isPlayerLocal(player)}"/>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.room-finish
  height: 100%
  h1
    margin: 20px
    font-size: 40px
    text-align: center
  .duration
    background: linear-gradient(90deg, transparent 0%, transparent 33%, $grey 50%, transparent 67%, transparent 100%)
    text-align: center
    padding: 2px 0
  .leaderboard
    display: flex
    margin-top: 20px
    padding: 0 20px
    .leaderboard__column
      flex: 1
      &:first-of-type
        margin-right: 10px

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Room } from '@/@types'
import { SerializedPlayer } from '@street-of-age/shared/entities/player'
import { groupBy } from '@/utils/functions'
import AppModule, { CharacterKind } from '@/store/modules/app'
import RoomFinishPlayerRow from '@/components/ui/RoomFinishPlayerRow.vue'

@Component<RoomFinish>({
  components: { RoomFinishPlayerRow }
})
export default class RoomFinish extends Vue {
  get room (): Room {
    return {
      id: 'test',
      settings: {
        numberOfPlayers: 6,
        name: 'oui',
        mapSize: 'large'
      },
      players: [
        {
          team: 'young',
          color: '#0be5fe',
          id: 'player1',
          ready: true,
          characterKinds: [CharacterKind.Geek, CharacterKind.Hippie, CharacterKind.Fattie]
        },
        {
          team: 'young',
          color: '#50fbd7',
          id: 'player2',
          ready: true,
          characterKinds: [CharacterKind.Egocentric, CharacterKind.Hippie, CharacterKind.Fattie]
        },
        {
          team: 'young',
          color: '#e6ff5d',
          id: 'player3',
          ready: true,
          characterKinds: [CharacterKind.Fattie, CharacterKind.Hippie, CharacterKind.Geek]
        },
        {
          team: 'old',
          color: '#f64afe',
          id: 'player4',
          ready: true,
          characterKinds: [CharacterKind.MrMuscle, CharacterKind.FustyGrandpa, CharacterKind.LapdogWoman]
        },
        {
          team: 'old',
          color: '#0be5fe',
          id: 'player5',
          ready: true,
          characterKinds: [CharacterKind.FustyGrandpa, CharacterKind.MrMuscle, CharacterKind.LapdogWoman]
        },
        {
          team: 'old',
          color: '#ff4f73',
          id: 'player6',
          ready: true,
          characterKinds: [CharacterKind.LapdogWoman, CharacterKind.FustyGrandpa, CharacterKind.MrMuscle]
        }
      ]
    }
  }
  // get room (): Room {
  //   return RoomModule.rooms.find(r => r.id === this.$route.params.id)!
  // }
  public isPlayerLocal (player: SerializedPlayer): boolean {
    return player.id === 'player4'
  }
  public getNumberForPlayer (player: SerializedPlayer): number {
    return this.room.players.indexOf(player) + 1
  }
  get players (): Map<string, SerializedPlayer[]> {
    return groupBy(this.room.players, player => player.team)
  }
}
</script>
