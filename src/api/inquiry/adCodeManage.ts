import { Alova } from '@/utils/http/alova/index';

// 获取广告代码位列表
export function getAdCodeList(params: any) {
  return Alova.Get('/inquiry/ad_code_list', { params });
}

// 新增广告代码位
export function addAdCode(data: any) {
  return Alova.Post('/inquiry/ad_code_add', data);
}

// 更新广告代码位
export function updateAdCode(data: any) {
  return Alova.Post('/inquiry/ad_code_update', data);
}

// 删除广告代码位
export function deleteAdCode(data: any) {
  return Alova.Post('/inquiry/ad_code_delete', data);
}
