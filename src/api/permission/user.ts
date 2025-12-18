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
  return Alova.Post<InResult>('/am/v1/auths/admins/batch_delete', ids);
}
/**
 * @description: 重置密码
 *
 */
export function batchResetpwdAdmins(params) {
  return Alova.Post<InResult>('/am/v1/auths/admins/reset_pwd', params);
}
/**
 * @description: 创建管理员
 *
 */
export function createAdmins(params) {
  return Alova.Post<InResult>('/am/v1/auths/admins/create', params);
}
/**
 * @description: 更新管理员
 *
 */
export function updateAdmins(params) {
  return Alova.Post<InResult>('/am/v1/auths/admins/update', params);
}
/**
 * @description: 获取管理员信息
 *
 */
export function getAdminsinfo(id: number) {
  return Alova.Get<InResult>('/am/v1/auths/admins/getadminsinfo?id=' + id);
}
