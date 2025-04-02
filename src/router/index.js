import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/store'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/common/404.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/common/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/common/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/account',
    component: () => import('@/views/account/Index.vue'),
    redirect: '/account/profile', // 默认跳转到第一个子页面
    children: [
      {
        path: 'profile',
        component: () => import('@/views/account/Profile.vue'),
        meta: { title: '个人信息' }
      },
      {
        path: ':pathMatch(.*)*',
        name: 'AccountNotFound',
        component: () => import('@/views/common/404.vue'),
        meta: { title: '页面未找到' }
      }
      // 未来可以在这里添加更多子路由
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/home')
  } else {
    next()
  }
})

export default router