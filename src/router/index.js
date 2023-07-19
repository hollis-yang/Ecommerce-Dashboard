import { createRouter, createWebHistory } from 'vue-router'
import SellerPage from '@/views/SellerPage.vue'
import TrendPage from '@/views/TrendPage.vue'
import MapPage from '@/views/MapPage.vue'


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
    },
    {
      path: '/mappage',
      component: MapPage
    }
  ]
})

export default router
