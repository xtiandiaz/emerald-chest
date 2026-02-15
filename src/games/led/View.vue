<script setup lang="ts">
import { onMounted, useTemplateRef, onUnmounted, ref } from 'vue';
import { MainScene } from './scenes';
import { Led, type LedState } from './game';
import { Color } from './types';

const viewport = useTemplateRef<HTMLDivElement>('viewport')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const state = ref<LedState>({ isPaused: false })
const game = new Led(state.value)

onMounted(async () => {
  await game.init({
    antialias: true,
    background: Color.BACKGROUND,
    canvas: canvas.value!,
    resizeTo: viewport.value!,
  })

  await game.playScene(MainScene)
})

onUnmounted(() => {
  game.destroy()
})
</script>

<template>
  <div id="viewport" ref="viewport">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/design-tokens/typography';
@use '@/assets/styles/mixins';

@mixin player-color {
  & {
    // color: #00ff96;
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
</style>
