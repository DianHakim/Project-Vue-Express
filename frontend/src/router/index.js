import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import NewReceipt from '../views/NewReceipt.vue'
import ReceiptDetail from '../views/ReceiptDetail.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', name: 'dashboard', component: Dashboard },
  { path: '/new', name: 'new', component: NewReceipt },
  { path: '/receipt/:id', name: 'receipt', component: ReceiptDetail, props: true },
  { path: '/settings', name: 'settings', component: Settings }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
