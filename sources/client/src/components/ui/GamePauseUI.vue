<template>
  <div class="game-pause-ui">
    <nav>
      <Logo color="white" :width="140"/>
      <ul class="actions">
        <li @click="$emit('close')">Reprendre</li>
        <li>Quitter</li>
      </ul>
      <div class="remaining">
        04:43
      </div>
    </nav>
    <main>
      <h2>Content</h2>
    </main>
  </div>
</template>

<style lang="sass">
.game-pause-ui
  position: relative
  display: flex
  z-index: 20
  background: transparentize($white, 0.7)
  width: 100%
  height: 100%
  pointer-events: all
  & nav
    flex: 1
    background: transparentize($blue, 0.45)
    display: flex
    flex-direction: column
    padding: 0 30px
    clip-path: polygon(0 0, 100% 0, 70% 100%, 0% 100%)
    & .actions
      margin-top: 40px
      font-family: "Dead Jim", sans-serif
      font-size: 20px
      & li
        margin: 20px 0
        &:hover, &:active, &:focus
          cursor: pointer
          opacity: 0.8
        &:first-of-type
          margin-top: 0
        &:last-of-type
          margin-bottom: 0
    & .remaining
      margin-top: auto
      font-size: 20px
      padding-left: 35px
      padding-bottom: 30px
  & main
    flex: 2

</style>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Logo from '@/components/ui/icons/Logo.vue'

@Component({
  components: { Logo }
})
export default class GamePauseUI extends Vue {
}
</script>
