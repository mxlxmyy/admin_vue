// 定义路由
const routes = [
  //错误页
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('../views/error/404.vue')
  },

  //登录
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login.vue')
  },

  //后台
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index/Index.vue'),
    children: [
      {
        path: '',
        name: 'index_main',
        component: () => import('../views/index/Main.vue'),
      }
    ],
  },
];

export default routes;