<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { TestScene } from './minigames/scenes/test';
import type { Card } from './types';
import CardComponent from './components/Card.vue';

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const scene = new TestScene()

const cards: Card[] = [
  { imgPath: 'img/blue-jay.jpg', term: 'Blue Jay' },
  { imgPath: 'img/cardenal.jpg', term: 'Cardenal' },
  { imgPath: 'img/hummingbird.jpg', term: 'Hummingbird' },
  { imgPath: 'img/sparrow.jpg', term: 'Sparrow' },
]

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
  <div class="cards">
    <CardComponent 
      v-for="(card, index) in cards"
      :key="index"
      :img-path="card.imgPath" 
      :term="card.term"
    />
  </div>
</template>

<style scoped lang="scss">
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  width: 100%;
}

canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
