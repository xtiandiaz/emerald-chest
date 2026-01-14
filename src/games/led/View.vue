<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
import { game } from './game';
import { Color } from './types'

const viewport = useTemplateRef('viewport')
const canvas = useTemplateRef('canvas')

onMounted(async () => {
  await game.init({
    canvas: canvas.value!,
    // resizeTo: viewport.value!,
    width: 1280,
    height: 720,
    background: Color.BACKGROUND,
    antialias: true,
    debug: {
      showsStats: true
    }
  }, 'demo')
})

onBeforeUnmount(() => {
  game.deinit()
})
</script>

<template>
  <div ref="viewport" id="viewport">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style lang="scss" scoped>
canvas {
  aspect-ratio: 16 / 9;
  width: 100vw;
}
</style>
