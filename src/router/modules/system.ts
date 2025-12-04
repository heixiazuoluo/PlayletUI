import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ReorderFourOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/user',
    component: Layout,
    meta: {
      title: '权限管理',
      icon: renderIcon(ReorderFourOutline),
      sort: 1,
      permissions: ['system_menu', 'system_role', 'system_user'],
    },
    children: [
      {
        path: 'user',
        name: 'system_user',
        meta: {
          title: '用户管理',
          permissions: ['system_user'],
        },
        component: () => import('@/views/system/user/user.vue'),
      },
      {
        path: 'menu',
        name: 'system_menu',
        meta: {
          title: '菜单权限',
          permissions: ['system_menu'],
        },
        component: () => import('@/views/system/menu/menu.vue'),
      },
      {
        path: 'role',
        name: 'system_role',
        meta: {
          title: '角色权限',
          permissions: ['system_role'],
        },
        component: () => import('@/views/system/role/role.vue'),
      },
    ],
  },
];

export default routes;
