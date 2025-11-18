<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { BirdiesScene } from './scene';
import CardComponent from './Card.vue';

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const scene = new BirdiesScene()

interface Card {
  imgPath: string
  term: string
}

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
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
</style>
