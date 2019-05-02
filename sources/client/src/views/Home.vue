<template>
  <div class="home">
    Home
  </div>
</template>

<style lang="sass">
.home

</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HomeSplash from '@/components/HomeSplash.vue'
import HomeMenu from '@/components/HomeMenu.vue'
import HomeTutorial from '@/components/HomeTutorial.vue'

@Component({
  components: {
    HomeSplash,
    HomeMenu,
    HomeTutorial
  }
})
export default class Home extends Vue {

}
</script>
