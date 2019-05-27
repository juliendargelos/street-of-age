<template>
  <div class="app-picker">
    <div class="app-picker__label">{{ label }}</div>
    <div class="app-picker__items">
      <div class="app-picker__item" v-for="(choice, i) in choices" :class="{selected: i === selectedIndex}"
           :key="i"
           @click="changeItem(i)">{{ choice.label }}
      </div>
    </div>
  </div>
</template>

<style lang="sass">
  .app-picker
    display: flex
    flex-direction: column
    justify-content: space-between
    &__label
      margin-top: 20px
      margin-bottom: 5px
    &__items
      display: flex
      justify-content: space-between
      .app-picker__item
        padding: 10px
        border-radius: 3px
        background: transparentize($pale-blue, 0.4)
        width: 60px
        text-align: center
        &.selected
          background: $pale-blue

        &:hover, &:active, &:focus
          cursor: pointer
          background: $pale-blue

        &:first-of-type
          margin-left: 0

        &:last-of-type
          margin-right: 0
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component<AppPicker>({
    mounted (): void {
      this.$emit('input', this.choices[this.selectedIndex].value)
    }
  })
export default class AppPicker extends Vue {
    @Prop({ type: Array, default: () => [] }) readonly choices!: Array<{ value: number | string, label: string }>
    @Prop({ type: String, required: true }) readonly label!: string
    @Prop() readonly value: any

    private selectedIndex = 0

    private changeItem (index: number) {
      this.selectedIndex = index
      this.$emit('input', this.choices[index].value)
    }
}
</script>
