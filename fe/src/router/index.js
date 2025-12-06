import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import MainView from '@/views/MainView.vue'
import { ROLE } from '@/configs/role'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/main',
    },
    {
      path: '/main',
      name: 'home',
      component: MainView,
      redirect: '/main/transform',
      children: [
        {
          path: 'transform',
          name: 'transform',
          meta: { allowedRoles: [ROLE.ADMIN, ROLE.MEMBER] },
          components: {
            header_bar: () => import('@/components/Transform/widgets/HeaderBar.vue'),
            default: () => import('@/components/Transform/widgets/Main.vue'),
          },
        },
        {
          path: 'skuspu',
          name: 'skuspu',
          meta: { allowedRoles: [ROLE.ADMIN, ROLE.MEMBER] },
          components: {
            header_bar: () => import('@/components/SkuSpu/widgets/HeaderBar.vue'),
            default: () => import('@/components/SkuSpu/widgets/Main.vue'),
          },
        },
        {
          path: 'link-design',
          name: 'link-design',
          meta: { allowedRoles: [ROLE.ADMIN, ROLE.MEMBER] },
          components: {
            header_bar: () => import('@/components/LinkDesign/widgets/HeaderBar.vue'),
            default: () => import('@/components/LinkDesign/widgets/Main.vue'),
          },
        },
        {
          path: 'store',
          name: 'store',
          meta: { allowedRoles: [ROLE.ADMIN, ROLE.MEMBER] },
          components: {
            header_bar: () => import('@/components/Store/widgets/HeaderBar.vue'),
            default: () => import('@/components/Store/widgets/Main.vue'),
          },
        },
        {
          path: 'user',
          name: 'user',
          meta: { allowedRoles: [ROLE.ADMIN] },
          components: {
            header_bar: () => import('@/components/User/widgets/HeaderBar.vue'),
            default: () => import('@/components/User/widgets/Main.vue'),
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: LoginView,
    },
  ],
})

router.beforeEach(to => {
  if (!to.meta?.allowedRoles) {
    return true
  }

  // eslint-disable-next-line no-undef
  const role = sessionStorage.getItem('role')

  if (!role) {
    return { name: 'home' }
  } else {
    if (to.meta.allowedRoles.includes(role)) {
      return true
    }

    return { name: 'home' }
  }
})

export default router
