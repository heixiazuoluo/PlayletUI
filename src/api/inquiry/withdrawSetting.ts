import { Alova } from '@/utils/http/alova/index';

// 获取提现设置列表
export function getWithdrawSettingList(params: any) {
  return Alova.Get('/am/v1/data/cash/list', { params });
}

// 新增提现设置
export function createWithdrawSetting(data: any) {
  return Alova.Post('/am/v1/data/cash/create', data);
}

// 编辑提现设置
export function updateWithdrawSetting(data: any) {
  return Alova.Post('/am/v1/data/cash/update', data);
}
