import { Alova } from '@/utils/http/alova/index';

// 获取黑名单用户列表
export function getBlacklistUserList(params: any) {
  return Alova.Get('/inquiry/blacklist_user_list', { params });
}

// 解除黑名单
export function removeBlacklist(data: any) {
  return Alova.Post('/inquiry/remove_blacklist', data);
}
