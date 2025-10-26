<script setup lang="ts">
import { onMounted } from 'vue';
import { TestScene } from './minigames/scenes/test';

const scene = new TestScene({
  speed: 1
})

onMounted(async () => {
  await scene.init()
  
  scene.start()
  
  window.addEventListener('click', () => {
    scene.animateCards()
  })
})
</script>

<template>
</template>

<style scoped></style>
