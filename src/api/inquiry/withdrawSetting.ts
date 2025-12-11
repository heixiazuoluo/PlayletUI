import { Alova } from '@/utils/http/alova/index';

// 获取提现设置列表
export function getWithdrawSettingList(params: any) {
  return Alova.Get('/inquiry/withdraw_setting_list', { params });
}
