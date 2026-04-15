import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user.js';

const routes = [
  // Public landing page
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/Landing.vue'),
  },

  // Auth pages (public, redirects to dashboard if already logged in)
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true },
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guest: true },
  },

  // Protected app shell
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'keys', name: 'Keys', component: () => import('../views/Keys.vue') },
      { path: 'usage', name: 'Usage', component: () => import('../views/Usage.vue') },
      { path: 'pricing', name: 'Pricing', component: () => import('../views/Pricing.vue') },
      { path: 'recharge', name: 'Recharge', component: () => import('../views/Recharge.vue') },
      { path: 'playground', name: 'Playground', component: () => import('../views/Playground.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isLoggedIn = !!userStore.token;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/auth/login');
  } else if (to.meta.guest && isLoggedIn) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
