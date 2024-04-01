import { createRouter, createWebHistory } from 'vue-router'

import routeList from './route'

import { getToken } from '@/api/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeList
})

//前置验证
// router.beforeEach(async (to, from) => {
//   const authToken = getToken({});
//   const loginPage = import.meta.env.VITE_LOGIN_PAGE
//   // 检查用户是否已登录
//   if (authToken == '') {
//     // 避免无限重定向
//     if (to.name !== loginPage) {
//       // 将用户重定向到登录页面
//       return { name: loginPage }
//     }
//   }
// })

export default router
