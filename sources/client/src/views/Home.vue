<template>
  <div class="home">
    <transition mode="out-in">
      <div
        class="home__logo"
        v-if="logo"
      />

      <HomeMenu
        v-if="menu"
        class="home__menu"
      />
    </transition>
  </div>
</template>

<style lang="sass">
.home
  height: 100%
  display: flex

  &__logo
    background: url(~@/assets/logo.svg) no-repeat center center / contain
    width: 90%
    height: 0
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
import { Component, Vue } from 'vue-property-decorator'
import HomeSplash from '@/components/HomeSplash.vue'
import HomeMenu from '@/components/HomeMenu.vue'
import HomeTutorial from '@/components/HomeTutorial.vue'

@Component<Home>({
  components: {
    HomeSplash,
    HomeMenu,
    HomeTutorial
  },

  mounted () {
    setTimeout(() => { this.logo = true }, 700)
    setTimeout(() => {
      this.logo = false
      this.menu = true
    }, 3400)
  }
})
export default class Home extends Vue {
  private logo = false
  private menu = false
}
</script>
