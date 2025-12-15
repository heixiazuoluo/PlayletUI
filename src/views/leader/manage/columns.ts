import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface LeaderData {
  id: number;
  leaderId: string;
  leaderName: string;
  leaderLevel: number;
  inviteCount: number;
  directCommission: number;
  indirectCommission: number;
  withdrawable: number;
  totalWithdraw: number;
  remark: string;
  status: number;
  loginName: string;
  userId: string;
  gameName: string;
  realName: string;
  phone: string;
}

export const statusMap: Record<number, { text: string; type: 'success' | 'error' }> = {
  1: { text: '启用', type: 'success' },
  0: { text: '禁用', type: 'error' },
};

export const columns: BasicColumn<LeaderData>[] = [
  {
    title: '团长ID',
    key: 'leaderId',
    width: 120,
  },
  {
    title: '团长昵称',
    key: 'leaderName',
    width: 150,
    ellipsis: { tooltip: true },
  },
  {
    title: '团长等级',
    key: 'leaderLevel',
    width: 100,
    render(row) {
      return `LV${row.leaderLevel}`;
    },
  },
  {
    title: '邀请人数',
    key: 'inviteCount',
    width: 100,
  },
  {
    title: '直推佣金',
    key: 'directCommission',
    width: 120,
    render(row) {
      return `¥${row.directCommission.toFixed(2)}`;
    },
  },
  {
    title: '间推佣金',
    key: 'indirectCommission',
    width: 120,
    render(row) {
      return `¥${row.indirectCommission.toFixed(2)}`;
    },
  },
  {
    title: '可提现',
    key: 'withdrawable',
    width: 120,
    render(row) {
      return `¥${row.withdrawable.toFixed(2)}`;
    },
  },
  {
    title: '累计提现(元)',
    key: 'totalWithdraw',
    width: 120,
    render(row) {
      return `¥${row.totalWithdraw.toFixed(2)}`;
    },
  },
  {
    title: '备注',
    key: 'remark',
    width: 150,
    ellipsis: { tooltip: true },
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      const statusInfo = statusMap[row.status] || { text: '未知', type: 'error' };
      return h(NTag, { type: statusInfo.type, size: 'small' }, { default: () => statusInfo.text });
    },
  },
];
