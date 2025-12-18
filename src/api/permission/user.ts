import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 管理员列表
 * @param {number} pageSize - 每页数量
 * @param {number} pageIndex - 当前页码
 * @param {string} userName - 用户昵称
 * @param {string} mobile - 手机号
 * @param {number} userStatus - 角色状态(默认全部) -1：全部； 1:启用； 2:禁用
 * @param {string($date-time)} start - 开始时间
 * @param {string($date-time)} end - 结束时间
 */
export function getAdminslist(params) {
  return Alova.Get<InResult>('/am/v1/auths/admins/list', {
    params,
  });
}

/**
 * @description: 批量删除管理员
 * @param {number[]} ids - 管理员ID数组
 */
export function batchDeleteAdmins(ids: number[]) {
  return Alova.Post<InResult>('/am/v1/auths/admins/delete', ids);
}
/**
 * @description: 重置密码
 *
 */
export function batchResetpwdAdmins(params) {
  return Alova.Post<InResult>(`/am/v1/auths/admins/resetpwd?id=${params.id}&pwd=${params.pwd}`);
}

/**
 * @description: 新增或修改管理员
 *
 */
export function updateAdmins(params) {
  return Alova.Post<InResult>('/am/v1/auths/admins/save', params);
}
