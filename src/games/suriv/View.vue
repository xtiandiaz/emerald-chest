<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue';
import scene from './scene';
import { Color, ColorScheme, schemeColor } from '@/assets/design-tokens/palette';

const viewport = useTemplateRef<HTMLElement>('viewport')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

onMounted(async () => {
  await scene.init({
    background: schemeColor(ColorScheme.Dark, Color.Gray),
    canvas: canvas.value!,
    resizeTo: viewport.value!,
  })
  
  scene.start()
})
</script>

<template>
  <div id="viewport" ref="viewport">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/design-tokens/palette';

#viewport {
  aspect-ratio: calc(16/9);
  position: relative;
  margin: 0 auto;
  overflow: hidden;
  width: 100vw;
  @include palette.color-attribute('background', 'orange');
}

canvas {
  position: absolute;
  background: transparent;
}
</style>
