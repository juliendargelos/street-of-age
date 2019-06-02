<template>
  <div class="tab" @click="onClickHandler">
    <slot></slot>
  </div>
</template>

<style lang="sass">
.tab
  font-size: 20px
</style>
<script lang="ts">
import { Vue, Component, Inject, Prop } from 'vue-property-decorator'

@Component<Tab>({})
export default class Tab extends Vue {
  @Prop({ type: String, required: true }) readonly id!: string
  @Inject('changeTab') readonly changeTab!: (newId: string) => void

  public onClickHandler (): void {
    this.changeTab(this.id)
  }
}
</script>
