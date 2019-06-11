<template>
  <div class="game__loader">
    <GameLoaderTutorial/>
  </div>
</template>

<style lang="sass">
.game__loader
  position: fixed
  left: 0
  top: 0
  bottom: 0
  right: 0
  width: 100%
  height: 100%
  z-index: 1000
  background: url(~@/assets/loading.png) center center / cover
  display: flex
  justify-content: center
  align-items: flex-end
</style>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import GameLoaderTutorial from '@/components/ui/GameLoaderTutorial.vue'

@Component<GameLoader>({
  components: { GameLoaderTutorial }
})
export default class GameLoader extends Vue {

}
</script>
