<template>
  <div v-if="waiting && placeholder" class="character-card placeholder">
    <h2 class="character-card--placeholder">{{ placeholder }}</h2>
    <span class="character-card__metadata"><slot name="metadata"/></span>
  </div>
  <button v-else class="character-card" v-on="listeners">
    <img :src="waiting ? character.picture.full : character.picture.face" class="character-card__background" alt="">
    <span v-if="!waiting" class="character-card__informations">
      <h2>{{ character.name }}</h2>
      <ul class="character-card__informations--modifiers">
        <li v-for="stat in character.stats" :key="stat.ability">
          <span class="ability">{{ stat.ability }}</span>
          <span class="level progress-outer">
            <span class="progress-inner" :style="{ width: `${stat.level}%` }"></span>
            <span :style="{ display: 'none' }" aria-hidden="true">{{ stat.level }}%</span>
          </span>
        </li>
      </ul>
    </span>
    <span class="character-card__metadata"><slot name="metadata"/></span>
  </button>
</template>

<style lang="sass">
.character-card
  box-sizing: border-box
  color: $white
  font-weight: 700
  width: 180px
  height: 280px
  transform: skew(-4deg)
  position: relative
  background: $light-blue
  outline: none
  border: none
  padding: 0
  h2
    text-transform: uppercase
    &.character-card--placeholder
      color: $grey
      font-size: 14px
      text-align: center
  &.placeholder
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
  &:disabled
    filter: grayscale(90%)
    cursor: not-allowed
  &__metadata
    font-weight: 300
    font-size: 14px
    position: absolute
    bottom: -20px
  &__informations
    position: absolute
    bottom: 0
    height: 50%
    left: 0
    right: 0
    background: linear-gradient(90deg, #3c2380 6%, transparent 160%)
    clip-path: polygon(100% 0, 100% 0, 100% 100%, 0 100%, 0 10%)
    padding: 40px 10px 10px 10px
    &--modifiers
      font-weight: 300
      margin-top: 20px
      & span
        display: block
        margin: 4px 0
        &.level
          & .progress-inner
            height: 10px
            background: $white
          &.progress-outer
            width: 100%
            height: 10px
            background: $pale-blue
  &__background
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    width: 100%
    height: 100%
    object-fit: cover
</style>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { CharacterAsset } from '@/@types'
import characters from '@/assets/characters'
import { CharacterKind } from '@/store/modules/app'

@Component<CharacterCard>({})
export default class CharacterCard extends Vue {
  @Prop({ required: true }) readonly characterKind!: CharacterKind
  @Prop({ required: false, default: null }) readonly placeholder!: string
  @Prop({ required: false, default: false }) readonly waiting!: string

  get character (): CharacterAsset {
    return characters[this.characterKind]
  }
  get listeners () {
    return {
      ...this.$listeners,
      click: (mouseEvent: MouseEvent) => {
        this.$emit('click', { mouseEvent, character: this.character })
      }
    }
  }
}
</script>
