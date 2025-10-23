<script setup lang="ts">
import { onMounted } from 'vue';
import { TestScene } from './game/scenes/test';

const scene = new TestScene({
  speed: 1
})

onMounted(async () => {
  await scene.init()
  
  scene.start()
  
  // window.addEventListener('click', () => {
  //   scene.hastenCards()
  // })
})
</script>

<template>
</template>

<style scoped></style>
