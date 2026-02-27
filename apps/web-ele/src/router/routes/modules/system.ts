import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:settings',
      order: 100,
      title: '系统管理',
    },
    name: 'System',
    path: '/system',
    children: [
      {
        meta: {
          icon: 'lucide:menu',
          title: '菜单管理',
        },
        name: 'SystemMenu',
        path: '/system/menu',
        component: () => import('#/views/system/menu/index.vue'),
      },
      {
        meta: {
          icon: 'lucide:menu',
          title: '用户管理',
        },
        name: 'SystemUser',
        path: '/system/user',
        component: () => import('#/views/system/user/index.vue'),
      },
    ],
  },
];

export default routes;
