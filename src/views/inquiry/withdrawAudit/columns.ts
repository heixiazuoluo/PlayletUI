import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface WithdrawAuditData {
  id: number;
  userId: number;
  nickname: string;
  userLevel: number;
  masterId: number;
  masterNickname: string;
  withdrawTime: string;
  registerTime: string;
  remark: string;
  auditor: string;
  withdrawType: number;
  withdrawAmount: number;
  subsidyAmount: number;
  totalWithdraw: number;
}

export const userLevelMap: Record<number, string> = {
  1: 'V1',
  2: 'V2',
  3: 'V3',
};

export const withdrawTypeMap: Record<number, string> = {
  1: '金币提现',
  2: '师傅提现',
  3: '团长提现',
};

export const columns: BasicColumn<WithdrawAuditData>[] = [
  {
    title: '用户ID',
    key: 'userId',
    width: 100,
  },
  {
    title: '用户昵称',
    key: 'nickname',
    width: 120,
  },
  {
    title: '用户等级',
    key: 'userLevel',
    width: 80,
    render(row) {
      return userLevelMap[row.userLevel] || '-';
    },
  },
  {
    title: '师傅ID',
    key: 'masterId',
    width: 100,
  },
  {
    title: '师傅昵称',
    key: 'masterNickname',
    width: 120,
  },
  {
    title: '提现时间',
    key: 'withdrawTime',
    width: 160,
  },
  {
    title: '注册时间',
    key: 'registerTime',
    width: 160,
  },
  {
    title: '备注',
    key: 'remark',
    width: 150,
    ellipsis: { tooltip: true },
  },
  {
    title: '审核人',
    key: 'auditor',
    width: 100,
  },
  {
    title: '提现类型',
    key: 'withdrawType',
    width: 100,
    render(row) {
      return withdrawTypeMap[row.withdrawType] || '-';
    },
  },
  {
    title: '提现金额(元)',
    key: 'withdrawAmount',
    width: 120,
    render(row) {
      return (row.withdrawAmount / 100).toFixed(2);
    },
  },
  {
    title: '补贴金额(元)',
    key: 'subsidyAmount',
    width: 120,
    render(row) {
      return (row.subsidyAmount / 100).toFixed(2);
    },
  },
  {
    title: '累计提现',
    key: 'totalWithdraw',
    width: 120,
    render(row) {
      return (row.totalWithdraw / 100).toFixed(2);
    },
  },
];

// 审核记录列表列定义
export interface AuditRecordData {
  id: number;
  userId: number;
  nickname: string;
  withdrawAmount: number;
  withdrawTime: string;
  status: number;
}

export const auditStatusMap: Record<
  number,
  { text: string; type: 'success' | 'warning' | 'error' | 'info' }
> = {
  1: { text: '待审核', type: 'warning' },
  2: { text: '已通过', type: 'success' },
  3: { text: '已拒绝', type: 'error' },
  4: { text: '已拉黑', type: 'error' },
  5: { text: '已标记', type: 'info' },
};

export const auditRecordColumns: BasicColumn<AuditRecordData>[] = [
  {
    title: '用户ID',
    key: 'userId',
    width: 100,
  },
  {
    title: '用户昵称',
    key: 'nickname',
    width: 120,
  },
  {
    title: '提现金额(元)',
    key: 'withdrawAmount',
    width: 120,
    render(row) {
      return (row.withdrawAmount / 100).toFixed(2);
    },
  },
  {
    title: '提现时间',
    key: 'withdrawTime',
    width: 160,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      const statusInfo = auditStatusMap[row.status] || { text: '未知', type: 'info' };
      return h(NTag, { type: statusInfo.type, size: 'small' }, { default: () => statusInfo.text });
    },
  },
];
