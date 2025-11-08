<script setup lang="ts">
import { ref } from 'vue'

const showsFront = ref(true)

defineProps<{
  imgPath: string,
  term: string
}>()
</script>

<template>
  <div 
    class="card" 
    @click="showsFront = !showsFront" 
    @mousedown="console.log('down!')"
    @mouseup="console.log('up!')"
  >
    <Transition mode="out-in">
      <div v-if="showsFront" class="front" :style="{ backgroundImage: `url('${imgPath}')` }"></div>
      <div v-else class="back">
        <p>{{ term }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/design-tokens/palette';

.v-enter-from, .v-leave-to {
  transform: rotateY(90deg);
}
.v-enter-active, .v-leave-active {
  transition: transform 0.25s ease-out;
}
.v-leave-active {
  transition-timing-function: ease-in;
}

.card {
  aspect-ratio: 1;
  min-width: 200px;
  overflow: hidden;
  position: relative;
  
  & > * {
    border-radius: 24px;
    height: 100%;
    position: absolute;
    width: 100%;
  }
  
  .front {
    background-size: cover;
  }
  
  .back {
    align-items: center;
    display: flex;
    font-size: 1.5rem;
    justify-content: center;
    @include palette.color-attribute('background-color', 'secondary-background');
  }
}
</style>
