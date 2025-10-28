<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { TestScene } from './minigames/scenes/test';

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const scene = new TestScene()

onMounted(async () => {
  await scene.init({
    canvas: canvas.value!,
    resizeTo: window,
  })
  
  scene.start()
  
  window.addEventListener('click', () => {
    scene.animateCards()
  })
})
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>

<style scoped lang="scss">
canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
