import { Alova } from '@/utils/http/alova/index';

// 获取金币记录列表
export function getCoinRecordList(params: any) {
  return Alova.Get('/inquiry/coin_record_list', { params });
}
