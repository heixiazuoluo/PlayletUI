import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取用户管理列表
 */
export function getUserManageList(params: any) {
  return Alova.Get('/inquiry/user_manage_list', {
    params,
  });
}

/**
 * @description: 加入黑名单
 */
export function addToBlacklist(userId: number) {
  return Alova.Post('/inquiry/add_blacklist', {
    userId,
  });
}

/**
 * @description: 修改团长信息
 */
export function updateLeaderInfo(params: { userId: number; leaderId: number }) {
  return Alova.Post('/inquiry/update_leader', {
    ...params,
  });
}
