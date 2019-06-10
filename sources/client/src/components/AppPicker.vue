<template>
  <div class="app-picker">
    <div class="app-picker__label">{{ label }}</div>
    <div class="app-picker__items">
      <div class="app-picker__item" v-for="(choice, i) in choices"
           :key="i"
           :class="{selected: i === selectedIndex, disabled: isDisabled(i)}"
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
      margin-top: 8px
      .app-picker__item
        padding: 10px
        border-radius: 3px
        background: transparentize($pale-blue, 0.4)
        width: 60px
        text-align: center
        &.selected
          background: $pale-blue

        &:hover:not(.disabled), &:active:not(.disabled), &:focus:not(.disabled)
          cursor: pointer
          background: $pale-blue

        &:first-of-type
          margin-left: 0

        &:last-of-type
          margin-right: 0
        &.disabled
          cursor: not-allowed
          opacity: 0.4
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component<AppPicker>({
  mounted (): void {
    if (!this.lazy) {
      this.$emit('input', this.choices[this.selectedIndex].value)
    }
  }
})
export default class AppPicker extends Vue {
    @Prop({ type: Array, default: () => [] }) readonly choices!: Array<{ value: number | string, label: string }>
    @Prop({ type: Array, default: () => [] }) readonly disabledChoices!: Array<string | number>
    @Prop({ type: String, required: true }) readonly label!: string
    @Prop({ type: Boolean, default: false }) readonly lazy!: string
    @Prop() readonly value: any

    private selectedIndex = 0

    private changeItem (index: number) {
      if (this.isDisabled(index)) {
        return
      }
      this.selectedIndex = index
      this.$emit('input', this.choices[index].value)
    }

    private isDisabled (index: number): boolean {
      return this.disabledChoices.includes(this.choices[index].value)
    }
}
</script>
