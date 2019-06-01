<template>
  <div class="player-waiting-card">
    <CharacterCard v-if="characterKind && ready" :character-kind="characterKind"/>
    <CharacterCard v-else placeholder='En attente' :character-kind="characterKind"/>
  </div>
</template>

<style lang="sass">
.player-waiting-card

</style>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { CharacterKind } from '@/store/modules/app'
import CharacterCard from '@/components/CharacterCard.vue'

@Component<PlayerWaitingCard>({
  components: { CharacterCard }
})
export default class PlayerWaitingCard extends Vue {
  @Prop({ required: true }) readonly characterKind!: CharacterKind | null
  @Prop({ required: true }) readonly ready!: boolean
}

</script>
