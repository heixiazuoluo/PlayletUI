import { Alova } from '@/utils/http/alova/index';

// 获取团长列表
export function getLeaderList(params: any) {
  return Alova.Get('/leader/manage_list', { params });
}

// 更新团长
export function updateLeader(data: any) {
  return Alova.Post('/leader/manage_update', data);
}
