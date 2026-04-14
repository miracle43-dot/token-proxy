import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true } },
  { path: '/api-keys', name: 'ApiKeys', component: () => import('../views/ApiKeys.vue'), meta: { requiresAuth: true } },
  { path: '/usage', name: 'Usage', component: () => import('../views/Usage.vue'), meta: { requiresAuth: true } },
  { path: '/recharge', name: 'Recharge', component: () => import('../views/Recharge.vue'), meta: { requiresAuth: true } },
  { path: '/settings', name: 'Settings', component: () => import('../views/Settings.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
