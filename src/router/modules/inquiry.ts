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
          keepAlive: true,
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
          keepAlive: true,
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
          keepAlive: true,
          // activeMenu: 'app-invite',
        },
        component: () => import('@/views/inquiry/appList/profit/index.vue'),
      },
      {
        path: 'userManage',
        name: 'inquiry_user_manage',
        meta: {
          title: '用户管理',
          keepAlive: true,
          // permissions: ['inquiry_user_manage'],
        },
        component: () => import('@/views/inquiry/userManage/index.vue'),
      },
      {
        path: 'productRecommend',
        name: 'data_product_recommend',
        meta: {
          title: '其他产品推荐',
          keepAlive: true,
        },
        component: () => import('@/views/inquiry/productRecommend/index.vue'),
      },
      {
        path: 'adManage',
        name: 'inquiry_ad_manage',
        meta: {
          title: '广告管理',
          keepAlive: true,
        },
        component: () => import('@/views/inquiry/adManage/index.vue'),
      },
      {
        path: 'ad-code/:id?',
        name: 'ad-code',
        meta: {
          title: '代码位管理',
          hidden: true,
          keepAlive: true,
          // activeMenu: 'app-invite',
        },
        component: () => import('@/views/inquiry/adManage/adCode/index.vue'),
      },
      {
        path: 'coinRecord',
        name: 'inquiry_coin_record',
        meta: {
          title: '金币增加记录',
          keepAlive: true,
        },
        component: () => import('@/views/inquiry/coinRecord/index.vue'),
      },
      {
        path: 'adRevenue',
        name: 'inquiry_ad_revenue',
        meta: {
          title: '广告收益列表',
          keepAlive: true,
        },
        component: () => import('@/views/inquiry/adRevenue/index.vue'),
      },
      {
        path: 'abnormalData',
        name: 'inquiry_abnormal_data',
        meta: {
          title: '异常数据查询',
          keepAlive: true,
        },
        component: () => import('@/views/inquiry/abnormalData/index.vue'),
      },
      {
        path: 'withdrawRecord',
        name: 'inquiry_withdraw_record',
        meta: {
          title: '提现审核记录',
          keepAlive: true,
        },
        component: () => import('@/views/inquiry/withdrawRecord/index.vue'),
      },
      {
        path: 'withdrawFlow',
        name: 'inquiry_withdraw_flow',
        meta: {
          title: '提现流水',
          keepAlive: true,
        },
        component: () => import('@/views/inquiry/withdrawFlow/index.vue'),
      },
      {
        path: 'withdrawAudit',
        name: 'inquiry_withdraw_audit',
        meta: {
          title: '待审核提现',
          keepAlive: true,
        },
        component: () => import('@/views/inquiry/withdrawAudit/index.vue'),
      },
    ],
  },
];

export default routes;
