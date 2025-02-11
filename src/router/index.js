import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ChatView from '../views/ChatView.vue'
import LoginView from '@/views/LoginView.vue'
import RegistView from '@/views/RegistView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChatView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/regist',
      name: 'regist',
      component: RegistView,
    },
  ],
})

// navigation guard
router.beforeEach(async (to, from, next) => {
  console.log(`router.beforeEach::to.path: ${to.path}`)
  const publicPages = ['/login', '/regist']
  const authRequired = !publicPages.includes(to.path)
  const userStore = useUserStore()

  if (!userStore.initialized) {
    await userStore.initialize()
  }

  const isLoggedIn = userStore.isLoggedIn
  console.log('isLoggedIn : ' + isLoggedIn)

  if (authRequired && !isLoggedIn) {
    return next('/login')
  }

  next()
})

export default router
