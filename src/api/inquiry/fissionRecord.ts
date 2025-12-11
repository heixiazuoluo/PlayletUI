import { Alova } from '@/utils/http/alova/index';

// 获取裂变收益记录列表
export function getFissionRecordList(params: any) {
  return Alova.Get('/inquiry/fission_record_list', { params });
}
