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
      },

      //用户
      {
        path: 'user/list',
        name: 'user_list',
        component: () => import('../views/user/Index.vue'),
      },
      //地区
      {
        path: 'region/list',
        name: 'region_list',
        component: () => import('../views/region/Index.vue'),
      },
      //分类
      {
        path: 'category/list',
        name: 'category_list',
        component: () => import('../views/category/Index.vue'),
      },
      //分类类型
      {
        path: 'category_group/list',
        name: 'category_group_list',
        component: () => import('../views/category_group/Index.vue'),
      },
      //供应商
      {
        path: 'supplier/list',
        name: 'supplier_list',
        component: () => import('../views/supplier/Index.vue'),
      },
      //商品
      {
        path: 'goods/list',
        name: 'goods_list',
        component: () => import('../views/goods/Index.vue'),
      },
    ],
  },
];

export default routes;