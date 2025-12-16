import { Alova } from '@/utils/http/alova/index';

/**
 * 角色选项
 */
export interface RoleOption {
  Id: number;
  CreateTime: string;
  ModifyTime: string;
  CreatorId: number;
  ModifierId: number;
  RoleName: string;
  RoleSort: number;
  RoleStatus: number;
  Remark: string | null;
  MenuIds: number[] | null;
}

/**
 * 应用/游戏选项
 */
export interface GameOption {
  Id: number;
  name: string;
  status: number;
  addTime: string;
  acName: string;
}

/**
 * 菜单树节点
 */
export interface MenuTreeNode {
  Id: number;
  Menuname: string;
  Children?: MenuTreeNode[];
}

/**
 * 获取角色列表
 */
export function getCommonRoles() {
  return Alova.Get<{ Data: RoleOption[] }>('/am/v1/data/common/listroles');
}

/**
 * 获取应用列表
 */
export function getCommonGames() {
  return Alova.Get<{ Data: GameOption[] }>('/am/v1/data/common/listgames');
}

/**
 * 获取菜单树数据
 */
export function getCommonTreeData() {
  return Alova.Get<{ Data: MenuTreeNode[] }>('/am/v1/data/common/listtreedata');
}
