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
        path: 'app-invite/:id?',
        name: 'app-invite',
        meta: {
          title: '设置邀请奖励任务',
          hidden: true,
          // activeMenu: 'app-invite',
        },
        component: () => import('@/views/inquiry/appList/invite/invite.vue'),
      },
      {
        path: 'app-profit/:id?',
        name: 'app-profit',
        meta: {
          title: '设置收益比例',
          hidden: true,
          // activeMenu: 'app-invite',
        },
        component: () => import('@/views/inquiry/appList/profit/index.vue'),
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
      {
        path: 'productRecommend',
        name: 'data_product_recommend',
        meta: {
          title: '其他产品推荐',
        },
        component: () => import('@/views/inquiry/productRecommend/index.vue'),
      },
      {
        path: 'adManage',
        name: 'inquiry_ad_manage',
        meta: {
          title: '广告管理',
        },
        component: () => import('@/views/inquiry/adManage/index.vue'),
      },
    ],
  },
];

export default routes;
