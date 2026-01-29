import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/components/Auth/Login.vue'
import ChecklistView from '@/views/ChecklistView.vue'
import Setup from '@/components/Interview/Setup.vue'
import Questions from '@/components/Interview/Questions.vue'
import Dashboard from '@/views/dashboard/Dashboard.vue'
import CasChecklist from '@/components/Dashboard/CasChecklist.vue'
import GeneralDocuments from '@/components/Dashboard/GeneralDocuments.vue'
import Interview from '@/components/Dashboard/Interview.vue'
import { useAuthStore } from '@/stores/auth'
import Hello from '@/components/Admin Dashboard/Hello.vue'
import AdminDashboard from '@/views/admin-dashboard/AdminDashboard.vue'


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
      ]
    },

    {
      path: '/admin-dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard

    }


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
