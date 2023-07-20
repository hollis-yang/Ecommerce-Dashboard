import { createRouter, createWebHistory } from 'vue-router'
import SellerPage from '@/views/SellerPage.vue'
import TrendPage from '@/views/TrendPage.vue'
import MapPage from '@/views/MapPage.vue'
import RankPage from '@/views/RankPage.vue'
import HotPage from '@/views/HotPage.vue'


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
    },
    {
      path: '/rankpage',
      component: RankPage
    },
    {
      path: '/hotpage',
      component: HotPage
    }
  ]
})

export default router
