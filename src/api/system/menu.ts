import { Alova } from '@/utils/http/alova/index';
export interface ListDate {
  Id?: number;
  Createtime: string;
  Modifytime: string;
  Creatorid: number;
  Modifierid: number;
  Parentid: number;
  Menuname: string;
  Menuicon: string;
  Menuurl: string;
  Menutarget?: any;
  Menusort: number;
  Menutype: number;
  Menustatus: number;
  Authorize?: any;
  Remark?: any;
  ParentName?: any;
  Children?: Array<ListDate | null>;
}

// 新增菜单参数类型
export interface CreateMenuParams {
  Parentid: number;
  Menuname: string;
  Menuicon?: string;
  Menuurl?: string;
  Menusort: number;
  Menutype: number;
  Menustatus: number;
  Authorize?: string;
}

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return Alova.Get('/menus');
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return Alova.Get<{ Data: ListDate[] }>('/am/v1/auths/menu/list', {
    params,
  });
}
/**
 * 新增tree菜单列表
 * @param params
 */
export function updateMenu(data: ListDate) {
  return Alova.Post('/am/v1/auths/menu/update', data);
}
/**
 * 修改tree菜单列表
 * @param params
 */
export function createMenu(data: CreateMenuParams) {
  return Alova.Post('/am/v1/auths/menu/create', data);
}
/**
 * 删除tree菜单列表
 * @param params
 */
export function deleteMenu(ids: number) {
  return Alova.Post('/am/v1/auths/menu/delete', ids);
}
