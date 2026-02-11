import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import FizzView from '@/games/fizz/View.vue'
import LedView from '@/games/led/View.vue'
import BirdiesView from '@/games/birdies/View.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/fizz',
      component: FizzView,
    },
    {
      path: '/led',
      component: LedView,
    },
    {
      path: '/birdies',
      component: BirdiesView,
    },
  ],
})

export default router
