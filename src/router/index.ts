import { createRouter, createWebHistory } from 'vue-router'
import SurivView from '@/games/suriv/View.vue'
import LedView from '@/games/led/View.vue'
import BirdiesView from '@/games/birdies/View.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/suriv',
      component: SurivView,
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
