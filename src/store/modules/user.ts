import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login } from '@/api/system/user';
import { storage } from '@/utils/Storage';

export type UserInfoType = {
  // TODO: add your own data
  username: string;
  email: string;
};

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      const response = await login(params);
      const { Data, code } = response;
      if (code === 200) {
        const ex = 7 * 24 * 60 * 60;
        storage.set(ACCESS_TOKEN, Data.token, ex);
        storage.set(CURRENT_USER, Data, ex);
        storage.set(IS_SCREENLOCKED, false);
        this.setToken(Data.token);
        this.setUserInfo(Data);
      }
      return response;
    },

    // 获取用户信息
    async getInfo() {
      // const data = await getUserInfoApi();
      // const { Data } = data;
      const Data = adminInfo;
      if (Data.permissions && Data.permissions.length) {
        const permissionsList = Data.permissions;
        this.setPermissions(permissionsList);
        this.setUserInfo(Data);
      } else {
        throw new Error('getInfo: permissionsList must be a non-null array !');
      }
      this.setAvatar(Data.avatar);
      return Data;
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({ username: '', email: '' });
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}

const adminInfo = {
  userId: '1',
  username: 'admin',
  realName: 'Admin',
  avatar: '/src/assets/images/logo.png',
  email: 'admin@example.com',
  desc: 'manager',
  password: 111111111,
  permissions: [
    {
      label: '首页',
      value: 'dashboard_console',
    },
    {
      label: '监控页',
      value: 'dashboard_monitor',
    },
    {
      label: '工作台',
      value: 'dashboard_workplace',
    },
    {
      label: '基础列表',
      value: 'basic_list',
    },
    {
      label: '基础列表删除',
      value: 'basic_list_delete',
    },
    {
      label: '用户管理',
      value: 'system_user',
    },
    {
      label: '重置密码',
      value: 'system_user_reset',
    },
    {
      label: '菜单权限',
      value: 'system_menu',
    },
    {
      label: '角色权限',
      value: 'system_role',
    },
  ],
};
