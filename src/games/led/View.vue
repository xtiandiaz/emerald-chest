<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue';
// import { Game, type GameState } from '@/assets/emerald'
// import { DemoScene } from './scenes';

const viewport = useTemplateRef('viewport')
const canvas = useTemplateRef('canvas')
// let game: Game<GameState> | undefined

onMounted(async () => {
  // game = new Game({ isPaused: false }, [new DemoScene()])

  // await game.init({
  //   canvas: canvas.value!,
  //   // resizeTo: viewport.    value!,
  //   width: 1280,
  //   height: 720,
  //   background: 0x0AC2A3,
  //   antialias: true,
  //   // debug: {
  //   //   showsStats: true
  //   // }
  // }, 'demo')
})

onBeforeUnmount(() => {
  // game?.deinit()
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
