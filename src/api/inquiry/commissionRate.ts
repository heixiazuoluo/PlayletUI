import { Alova } from '@/utils/http/alova/index';

export interface CommissionRateData {
  Id: number;
  v1ZhiTui: number;
  v2ZhiTui: number;
  v2JianTui: number;
  v3ZhiTui: number;
  v3JianTui: number;
  v2PersonCount: number;
  v2PersonMoneys: number;
  v2v1V: number;
  v2v2V: number;
  v2v2TDV: number;
  v2v2TDsV: number;
  v3PersonCount: number;
  v3PersonMoneys: number;
  v3v1V: number;
  v3v2TDV: number;
  v3v2TDsV: number;
  v3v3V: number;
  v3v3TDV: number;
  v3v3TDsV: number;
}

// 获取佣金比例设置
export function getCommissionRateDetail() {
  return Alova.Get<{ Data: CommissionRateData }>('/am/v1/data/systemset/detail');
}

// 更新佣金比例设置
export function updateCommissionRate(data: CommissionRateData) {
  return Alova.Post('/am/v1/data/systemset/update', data);
}
