<template>
  <div class="game__loader__tutorial">
    <img :src="require('@/assets/loader.png')" alt="" class="game__loader__tutorial--animation"/>
    <transition mode="out-in" name="slide-fade">
      <div :key="activeTutorial.id" class="game__loader__tutorial__content">
        <h2>{{ activeTutorial.content }}</h2>
        <img :src="activeTutorial.picture" alt="">
      </div>
    </transition>
  </div>
</template>

<style lang="sass">
.game__loader__tutorial
  width: 100%
  height: 162px
  display: flex
  justify-content: center
  align-items: center
  &--animation
    position: fixed
    bottom: 43%
  &__content
    display: flex
    flex-direction: column
    align-items: center
    img
      margin-top: 20px
</style>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

const TUTORIAL_SHOW_DURATION = 5000

@Component<GameLoaderTutorial>({
  mounted (): void {
    this.intervalId = setInterval(this.onTutorialChange.bind(this), TUTORIAL_SHOW_DURATION)
  },
  beforeDestroy (): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
})
export default class GameLoaderTutorial extends Vue {
  public activeTutorialIndex: number = Math.floor(Math.random() * this.tutorials.length)
  private intervalId: number | null = null

  get activeTutorial () {
    return this.tutorials[this.activeTutorialIndex]
  }

  get tutorials () {
    return [
      {
        id: 'aim',
        picture: require('@/assets/tutorials/aim.png'),
        content: 'Vise ton adversaire'
      },
      {
        id: 'move',
        picture: require('@/assets/tutorials/move.png'),
        content: 'Déplacement en bas à gauche de l\'écran'
      },
      {
        id: 'switch',
        picture: require('@/assets/tutorials/switch.png'),
        content: 'Choisi ton type d\'attaque en touchant ton personnage'
      }
    ]
  }

  public onTutorialChange () {
    this.activeTutorialIndex = (this.activeTutorialIndex + 1) % this.tutorials.length
  }
}
</script>
