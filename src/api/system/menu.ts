import { Alova } from '@/utils/http/alova/index';
export interface ListDate {
  Id?: number;
  Createtime: Date;
  Modifytime: Date;
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
  Children?: Array<ListDate>;
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
  return Alova.Get<ListDate[]>('/am/v1/auths/menu/list', {
    params,
  });
}
/**
 * 修改tree菜单列表
 * @param params
 */
export function updateMenu(data: ListDate) {
  return Alova.Post('/am/v1/auths/menu/update', data);
}
// /am/v1/auths/menu/update
