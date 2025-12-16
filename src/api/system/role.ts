import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 角色列表
 * @param {string} roleName - 角色名称
 * @param {number} roleStatus - 角色状态
 * @param {number} pageSize - 每页数量
 * @param {number} pageIndex - 当前页码
 */
export function getRoleList(params) {
  return Alova.Get('/am/v1/auths/role/list', { params });
}

/**
 * @description: 新增角色
 * @param {string} RoleName - 角色名称
 * @param {number} RoleSort - 显示顺序
 * @param {number} RoleStatus - 状态 1启用 0禁用
 * @param {string} Remark - 备注
 */
export function createRole(data) {
  return Alova.Post('/am/v1/auths/role/create', data);
}

/**
 * @description: 修改角色
 * @param {number} Id - 角色ID
 * @param {string} RoleName - 角色名称
 * @param {number} RoleSort - 显示顺序
 * @param {number} RoleStatus - 状态 1启用 0禁用
 * @param {string} Remark - 备注
 */
export function updateRole(data) {
  return Alova.Post('/am/v1/auths/role/update', data);
}

/**
 * @description: 批量删除角色
 * @param {number[]} ids - 角色ID数组
 */
export function batchDeleteRole(ids: number[]) {
  return Alova.Post('/am/v1/auths/role/batch_delete', ids);
}

/**
 * @description: 菜单树数据
 */
export function getMenuTreeData() {
  return Alova.Get('/am/v1/data/common/listtreedata');
}
