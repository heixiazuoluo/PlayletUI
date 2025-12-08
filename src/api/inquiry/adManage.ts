import { Alova } from '@/utils/http/alova/index';

// 获取广告列表
export function getAdList(params: any) {
  return Alova.Get('/inquiry/ad_list', { params });
}

// 新增广告
export function addAd(data: any) {
  return Alova.Post('/inquiry/ad_add', data);
}

// 更新广告
export function updateAd(data: any) {
  return Alova.Post('/inquiry/ad_update', data);
}

// 更新广告位配置
export function updateAdSlot(data: any) {
  return Alova.Post('/inquiry/ad_slot_update', data);
}
