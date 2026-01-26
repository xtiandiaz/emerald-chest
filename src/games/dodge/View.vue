<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import { DodgeScenes } from './scenes';
import { Dodge, type DodgeState } from './game'

const viewport = useTemplateRef<HTMLDivElement>('viewport')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const state = ref<DodgeState>({ isPaused: false, isOver: false, score: 0, bestScore: 0 })
const game = new Dodge(state.value)

async function playAgain() {
  state.value.score = 0
  state.value.isOver = false

  await game.play(DodgeScenes.Main)
}

onMounted(async () => {
  await game.init({
    antialias: true,
    backgroundAlpha: 0,
    canvas: canvas.value!,
    resizeTo: viewport.value!,
  })

  await game.play(DodgeScenes.Main)
})

watch(() => state.value.isOver, (isOver) => {
  if (isOver) {
    state.value.bestScore = Math.max(state.value.bestScore ?? 0, state.value.score)
  }
})
</script>

<template>
  <div id="viewport" ref="viewport">
    <div id="score">{{ state.score }}</div>
    <canvas ref="canvas"></canvas>
    <div id="game-over" v-if="state.isOver">
      <h1 v-if="state.bestScore">Best <span id="best-score">{{ state.bestScore }}</span></h1>
      <button @click="async () => await playAgain()">
        <label>Play again</label>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/design-tokens/typography';
@use '@/assets/styles/mixins';

@mixin player-color {
  & {
    color: #00ff96;
  }
}

#viewport {
  background-color: #0c0c18;
  height: 100vh;
  overflow: hidden;
  position: relative;
  width: 100vw;
}

canvas {
  @include mixins.absolute-cover;
}

#score {
  @include mixins.absolute-center;
  @include player-color;
  font-family: 'Inter SemiBold';
  font-size: 16rem;
  opacity: 0.1;
}

#best-score {
  @include player-color;
  @include typography.strong;
}

#game-over {
  @include mixins.absolute-cover;
  background-color: #0c0c18A0;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 100%;

  &,
  >* {
    margin: 0;
    text-shadow: 0 0 1em black;
    text-transform: uppercase;
    letter-spacing: 0.5rem;
  }

  label {
    @include player-color;
  }
}
</style>
