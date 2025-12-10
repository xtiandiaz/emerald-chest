<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { Suriv } from './game'

const viewport = useTemplateRef<HTMLElement>('viewport')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

const score = ref(0)
const game = new Suriv({
  score: score,
  isPaused: false
})

onMounted(async () => {
  await game.init({
    backgroundAlpha: 0,
    canvas: canvas.value!,
    resizeTo: viewport.value!,
    antialias: true,
  })

  await game.switchToScene('demo')
})

onBeforeUnmount(() => {
  game.deinit()
})
</script>

<template>
  <div id="viewport" ref="viewport">
    <canvas ref="canvas"></canvas>
    <div id="HUD">
      <span class="score">{{ score }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/design-tokens/typography';
@use '@/assets/design-tokens/palette';

#viewport {
  aspect-ratio: calc(16/9);
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  width: 100vw;
  @include palette.color-attribute('background', 'red');
}

#HUD {
  align-items: center;
  color: white;
  display: flex;
  justify-content: center;
  height: 100%;
  pointer-events: none;
  position: absolute;
  width: 100%;
  z-index: 0;

  // >* {
  //   pointer-events: auto;
  // }

  .score {
    font-family: 'Inter SemiBold';
    font-size: 20rem;
    opacity: 10%;
  }
}

canvas {
  position: absolute;
  background: transparent;
  z-index: 1;
}
</style>
