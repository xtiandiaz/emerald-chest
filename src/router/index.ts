import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import DodgeView from '@/games/dodge/View.vue'
import SurivView from '@/games/suriv/View.vue'
import LedView from '@/games/led/View.vue'
import BirdiesView from '@/games/birdies/View.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'dodge',
    },
    {
      name: 'dodge',
      path: '/dodge',
      component: DodgeView,
    },
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
