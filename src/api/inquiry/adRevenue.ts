import { Alova } from '@/utils/http/alova/index';

// 获取广告收益列表
export function getAdRevenueList(params: any) {
  return Alova.Get('/inquiry/ad_revenue_list', { params });
}
