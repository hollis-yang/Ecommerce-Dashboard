import { createRouter, createWebHistory } from 'vue-router'
import SellerPage from '@/views/SellerPage.vue'
import TrendPage from '@/views/TrendPage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sellerpage',
      component: SellerPage
    },
    {
      path: '/trendpage',
      component: TrendPage
    }
  ]
})

export default router
