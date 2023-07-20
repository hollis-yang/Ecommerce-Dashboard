import { createRouter, createWebHistory } from 'vue-router'
import ScreenPage from '@/views/ScreenPage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/screen'
    },
    {
      path: '/screen',
      component: ScreenPage
    }
  ]
})

export default router
