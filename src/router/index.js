import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/questions',
      name: 'Questions',
      component: () => import('../views/QuestionsView.vue')
    },
    {
      path: '/question/:id',
      name: 'QuestionDetail',
      component: () => import('../views/QuestionDetailView.vue')
    },
    {
      path: '/algorithm',
      name: 'Algorithm',
      component: () => import('../views/AlgorithmView.vue')
    },
    {
      path: '/ai',
      name: 'AI',
      component: () => import('../views/AIView.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/admin/questions',
      name: 'AdminQuestions',
      component: () => import('../views/AdminQuestionView.vue'),
      meta: { requiresAdmin: true }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要管理员权限
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || user.role !== 'admin') {
      // 不是管理员，重定向到登录页
      next('/login')
    } else {
      // 是管理员，继续访问
      next()
    }
  } else {
    // 不需要管理员权限，继续访问
    next()
  }
})

export default router