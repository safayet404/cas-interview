import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/components/Auth/Login.vue'
import ChecklistView from '@/views/ChecklistView.vue'
import Setup from '@/components/Interview/Setup.vue'
import Questions from '@/components/Interview/Questions.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: HomeView,
    },
        {
      path: '/checklist',
      name: 'checklist',
      component: ChecklistView,
    },
    {
      path: '/setup',
      name: 'setup',
      component: Setup,
    },

      {
      path: '/questions',
      name: 'questions',
      component: Questions,
    },
   
  ],
})

export default router
