<template>
  <div class="player-waiting-card">
    <CharacterCard v-if="characterKind && ready"
                   :waiting="true"
                   :character-kind="characterKind">
      <template v-if="$slots.metadata" slot="metadata"><slot name="metadata"/></template>
    </CharacterCard>
    <CharacterCard v-else
                   :waiting="true"
                   :placeholder='!characterKind ? "En attente" : "En attente"'
                   :character-kind="characterKind">
      <template v-if="$slots.metadata" slot="metadata"><slot name="metadata"/></template>
    </CharacterCard>
  </div>
</template>

<style lang="sass">
.player-waiting-card
  & .character-card
    width: 80px
    height: 252px
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
