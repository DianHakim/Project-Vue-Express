import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import NewReceipt from '../views/NewReceipt.vue'
import ReceiptDetail from '../views/ReceiptDetail.vue'
import Settings from '../views/Settings.vue'
import Trash from '../views/Trash.vue'
import Kasir from '../views/Kasir.vue'

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false } },
  { path: '/', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/new', name: 'new', component: NewReceipt, meta: { requiresAuth: true } },
  { path: '/receipt/:id', name: 'receipt', component: ReceiptDetail, props: true, meta: { requiresAuth: true } },
  { path: '/settings', name: 'settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/trash', name: 'trash', component: Trash, meta: { requiresAuth: true } },
  { path: '/kasir', name: 'kasir', component: Kasir, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Try to restore session if not already loaded
  if (!authStore.isLoggedIn) {
    authStore.restoreSession()
  }

  const isLoggedIn = authStore.isLoggedIn
  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else if ((to.path === '/trash' || to.path === '/settings') && authStore.user && authStore.user.role !== 'admin') {
    // prevent non-admin from accessing trash/settings
    next('/')
  } else {
    next()
  }
})

export default router
