import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { PeopleOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/leader',
    name: 'Leader',
    redirect: '/leader/manage',
    component: Layout,
    meta: {
      title: '团长管理',
      icon: renderIcon(PeopleOutline),
      sort: 2,
    },
    children: [
      {
        path: 'manage',
        name: 'leader_manage',
        meta: {
          title: '团长管理',
          keepAlive: true,
        },
        component: () => import('@/views/leader/manage/index.vue'),
      },
    ],
  },
];

export default routes;
