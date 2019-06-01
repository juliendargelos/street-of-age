<template>
  <AppButton
    @click="onClick"
    neutral
    block>
    Retour
  </AppButton>
</template>

<style lang="sass">
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component<BackButton>({})
export default class BackButton extends Vue {
  private onClick () {
    this.$router.back()
  }
}
</script>
