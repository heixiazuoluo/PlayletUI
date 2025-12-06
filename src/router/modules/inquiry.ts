import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { SearchOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/inquiry',
    name: 'Inquiry',
    redirect: '/inquiry/appList',
    component: Layout,
    meta: {
      title: '数据查询',
      icon: renderIcon(SearchOutline),
      sort: 1,
      // permissions: ['system_menu', 'system_role', 'system_user'],
    },
    children: [
      {
        path: 'appList',
        name: 'inquiry_app_list',
        meta: {
          title: '应用列表',
          // permissions: ['inquiry_app_list'],
        },
        component: () => import('@/views/inquiry/appList/appList.vue'),
      },
      {
        path: 'userManage',
        name: 'inquiry_user_manage',
        meta: {
          title: '用户管理',
          // permissions: ['inquiry_user_manage'],
        },
        component: () => import('@/views/inquiry/userManage/index.vue'),
      },
    ],
  },
];

export default routes;
