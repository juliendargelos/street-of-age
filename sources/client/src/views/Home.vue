<template>
  <div class="home" :class="{splashscreen: !menu}">
    <transition mode="out-in">
      <div
        class="home__logo"
        v-if="logo"
        @click="onGameStart"
      />

      <HomeMenu
        v-if="menu"
        class="home__menu"
      />
    </transition>
    <transition mode="out-in">
      <h2 v-if="start">Touch to start</h2>
    </transition>
    <transition mode="out-in">
      <small class="copyright" v-if="start">&copy; Street of Age</small>
    </transition>
  </div>
</template>

<style lang="sass">
.fade-enter-active, .fade-leave-active
  transition: opacity .5s
  opacity: 1
.fade-enter, .fade-leave-to
  opacity: 0

.home
  height: 100%
  display: flex
  h2
    position: fixed
    bottom: 60px
    width: 100%
    text-align: center
    color: $green
    text-transform: uppercase
    font-weight: 500
    letter-spacing: 2px
    animation: home__logo 0.5s infinite alternate-reverse $easeInQuart
  small
    position: fixed
    bottom: 20px
    width: 100%
    text-align: center
    color: $grey
    font-size: 12px
  h2,small
    &.v-enter
      opacity: 0
      transform: translateY(200%) skewX(40deg)

    &.v-enter-active
      transition: 1s $easeOutExpo
      animation: none

    &.v-leave-to
      opacity: 0
      transform: translateY(-200%)

    &.v-leave-active
      transition: opacity .2s .1s ease-in, transform .4s $easeInQuart
      animation: none
  &.splashscreen
    background: url(~@/assets/splashscreen.png) no-repeat center center / cover

  &__logo
    background: url(~@/assets/logo.png) no-repeat center center / contain
    width: 90%
    height: 40px
    margin: auto
    opacity: .7
    padding-top: 20.27%
    max-width: 600px
    display: block
    flex:
      grow: 0
      shrink: 0

    animation: home__logo .4s 4 alternate $easeInQuart

    &.v-enter
      opacity: 0
      transform: translateY(200%) skewX(40deg)

    &.v-enter-active
      transition: 1s $easeOutExpo
      animation: none

    &.v-leave-to
      opacity: 0
      transform: translateY(-200%)

    &.v-leave-active
      transition: opacity .2s .1s ease-in, transform .4s $easeInQuart
      animation: none

    @keyframes home__logo
      from
        opacity: .7

      to
        opacity: 1

  &__menu
    width: 90%
    max-width: 400px
    margin: auto

    &.v-enter
      opacity: 0
      transform: translateY(200%) skewX(-20deg)

    &.v-enter-active
      transition: 1s $easeOutExpo
</style>

<script lang="ts">
import fscreen from 'fscreen'
import { Component, Vue } from 'vue-property-decorator'
import HomeSplash from '@/components/HomeSplash.vue'
import HomeMenu from '@/components/HomeMenu.vue'
import HomeTutorial from '@/components/HomeTutorial.vue'
import AppModule from '@/store/modules/app'

@Component<Home>({
  components: {
    HomeSplash,
    HomeMenu,
    HomeTutorial
  },

  mounted () {
    if (this.hasPlayedIntroduction) {
      this.showMenu()
    } else {
      setTimeout(() => { this.logo = true }, 700)
      setTimeout(() => { this.start = true }, 2500)
    }
  }
})
export default class Home extends Vue {
  private logo = false
  private start = false
  private menu = false

  public showMenu (): void {
    this.logo = false
    this.start = false
    this.menu = true
    AppModule.setHasPlayedIntroduction(true)
  }

  public onGameStart (): void {
    if (this.start) {
      try {
        if (fscreen.fullscreenElement === null) {
          fscreen.requestFullscreen(this.$root.$el)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.showMenu()
      }
    }
  }

  get hasPlayedIntroduction (): boolean {
    return AppModule.hasPlayedIntroduction
  }
}
</script>
