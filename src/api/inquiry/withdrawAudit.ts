import { Alova } from '@/utils/http/alova/index';

// 获取待审核提现列表
export function getWithdrawAuditList(params: any) {
  return Alova.Get('/inquiry/withdraw_audit_list', { params });
}

// 获取审核记录列表（弹窗内）
export function getAuditRecordList(params: any) {
  return Alova.Get('/inquiry/audit_record_list', { params });
}

// 审核提现
export function auditWithdraw(data: { ids: number[]; action: string; reason: string }) {
  return Alova.Post('/inquiry/audit_withdraw', data);
}
