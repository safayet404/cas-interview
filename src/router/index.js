import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '@/views/dashboard/Dashboard.vue'
import CasChecklist from '@/components/Dashboard/CasChecklist.vue'
import GeneralDocuments from '@/components/Dashboard/GeneralDocuments.vue'
import Interview from '@/components/Dashboard/Interview.vue'
import { useAuthStore } from '@/stores/auth'

import CreateStudent from '@/components/Admin Dashboard/CreateStudent.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: HomeView,
      meta: { guestOnly: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },

      children: [
        { path: "", name: "dashboards", redirect: "/dashboard/interviews" },

        { path: "checklist", name: "dashboard-checklist", component: CasChecklist },
        { path: "documents", name: "dashboard-documents", component: GeneralDocuments },
        { path: "interviews", name: "dashboard-interviews", component: Interview },
        { path: "create-student", name: "create-student", component: CreateStudent },
      ]
    },

    {
      path: '/admin-dashboard',
      name: 'admin-dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },

      children: [

        { path: "create-student", name: "create-student", component: CreateStudent },
      ]
    },


  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.checked) {
    await auth.fetchMe()
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: "login" }
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: "dashboard" };
  }
})

export default router
