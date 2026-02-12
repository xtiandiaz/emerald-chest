import { createRouter, createWebHashHistory } from 'vue-router'
import FizzView from '@/games/fizz/View.vue'
import LedView from '@/games/led/View.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'led',
    },
    {
      name: 'fizz',
      path: '/fizz',
      component: FizzView,
    },
    {
      name: 'led',
      path: '/led',
      component: LedView,
    },
  ],
})

export default router
