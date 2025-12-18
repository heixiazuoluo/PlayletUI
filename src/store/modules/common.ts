import { defineStore } from 'pinia';
import { store } from '@/store';
import {
  getCommonRoles,
  getCommonGames,
  getCommonTreeData,
  type RoleOption,
  type GameOption,
  type MenuTreeNode,
} from '@/api/common';

export interface ICommonState {
  roles: RoleOption[];
  games: GameOption[];
  menuTree: MenuTreeNode[];
  rolesLoaded: boolean;
  gamesLoaded: boolean;
  menuTreeLoaded: boolean;
}

export const useCommonStore = defineStore({
  id: 'app-common',
  state: (): ICommonState => ({
    roles: [],
    games: [],
    menuTree: [],
    rolesLoaded: false,
    gamesLoaded: false,
    menuTreeLoaded: false,
  }),
  getters: {
    // 角色列表
    getRoles(): RoleOption[] {
      return this.roles;
    },
    // 角色选项（用于下拉框）
    getRoleOptions(): { label: string; value: number }[] {
      return this.roles.map((item) => ({
        label: item.RoleName,
        value: item.Id,
      }));
    },
    // 游戏列表
    getGames(): GameOption[] {
      return this.games;
    },
    // 游戏选项（用于下拉框）
    getGameOptions(): { label: string; value: number }[] {
      return this.games.map((item) => ({
        label: item.name,
        value: item.Id,
      }));
    },
    // 菜单树
    getMenuTree(): MenuTreeNode[] {
      return this.menuTree;
    },
  },
  actions: {
    // 设置角色列表
    setRoles(roles: RoleOption[]) {
      this.roles = roles;
      this.rolesLoaded = true;
    },
    // 设置游戏列表
    setGames(games: GameOption[]) {
      this.games = games;
      this.gamesLoaded = true;
    },
    // 设置菜单树
    setMenuTree(menuTree: MenuTreeNode[]) {
      this.menuTree = menuTree;
      this.menuTreeLoaded = true;
    },
    // 获取角色列表
    async fetchRoles(force = false) {
      if (this.rolesLoaded && !force) {
        return this.roles;
      }
      try {
        const res = await getCommonRoles();
        const list = res.Data || [];
        this.setRoles(list);
        return list;
      } catch (error) {
        console.error('获取角色列表失败', error);
        return [];
      }
    },
    // 获取游戏列表
    async fetchGames(force = false) {
      if (this.gamesLoaded && !force) {
        return this.games;
      }
      try {
        const res = await getCommonGames();
        const list = res.Data || [];
        this.setGames(list);
        return list;
      } catch (error) {
        console.error('获取游戏列表失败', error);
        return [];
      }
    },
    // 获取菜单树
    async fetchMenuTree(force = false) {
      if (this.menuTreeLoaded && !force) {
        return this.menuTree;
      }
      try {
        const res = await getCommonTreeData();
        const list = res.Data || [];
        this.setMenuTree(list);
        return list;
      } catch (error) {
        console.error('获取菜单树失败', error);
        return [];
      }
    },
    // 批量获取所有公共数据
    async fetchAll(force = false) {
      await Promise.all([this.fetchRoles(force), this.fetchGames(force), this.fetchMenuTree(force)]);
    },
  },
});

// 在 setup 外部使用
export function useCommon() {
  return useCommonStore(store);
}
