import { createRouter, createWebHistory } from 'vue-router'
import Settings from '@/views/Settings.vue'
import Resources from '@/views/Resources.vue'
import GlobalNote from '@/views/GlobalNote.vue'
import VariableStorage from '@/views/VariableStorage.vue'

const routes = [
  {
    path: '/',
    redirect: '/settings'
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/resources',
    name: 'Resources',
    component: Resources
  },
  {
    path: '/global-note',
    name: 'GlobalNote',
    component: GlobalNote
  },
  {
    path: '/variable-storage',
    name: 'VariableStorage',
    component: VariableStorage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 