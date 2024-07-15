import { createRouter, createWebHistory } from 'vue-router'
import WeatherReport from '../views/WeatherReport.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'weatherreport',
      component:WeatherReport
    },
  ]
})

export default router
