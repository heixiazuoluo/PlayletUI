import { Alova } from '@/utils/http/alova/index';

// 获取在线课堂列表
export function getOnlineClassList(params: any) {
  return Alova.Get('/inquiry/online_class_list', { params });
}

// 删除在线课堂
export function deleteOnlineClass(data: any) {
  return Alova.Post('/inquiry/online_class_delete', data);
}

// 新增在线课堂
export function createOnlineClass(data: any) {
  return Alova.Post('/inquiry/online_class_create', data);
}

// 修改在线课堂
export function updateOnlineClass(data: any) {
  return Alova.Post('/inquiry/online_class_update', data);
}
