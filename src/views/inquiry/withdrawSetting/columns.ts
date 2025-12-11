import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface WithdrawSettingData {
  id: number;
  appName: string;
  category: number;
  withdrawAmount: number;
  dailyLimit: number;
  description: string;
  subsidyAmount: number;
  subsidyStartTime: string;
  subsidyEndTime: string;
  status: number;
}

export const categoryMap: Record<number, string> = {
  1: '团长提现',
  2: '玩家提现',
};

export const statusMap: Record<number, { text: string; type: 'success' | 'error' }> = {
  1: { text: '启用', type: 'success' },
  0: { text: '禁用', type: 'error' },
};

export const columns: BasicColumn<WithdrawSettingData>[] = [
  {
    title: 'App名称',
    key: 'appName',
    width: 150,
  },
  {
    title: '类别',
    key: 'category',
    width: 100,
    render(row) {
      return categoryMap[row.category] || '-';
    },
  },
  {
    title: '提现金额',
    key: 'withdrawAmount',
    width: 120,
  },
  {
    title: '每日提现次数',
    key: 'dailyLimit',
    width: 120,
  },
  {
    title: '描述',
    key: 'description',
    width: 200,
    ellipsis: { tooltip: true },
  },
  {
    title: '补贴金额',
    key: 'subsidyAmount',
    width: 100,
  },
  {
    title: '补贴开始时间',
    key: 'subsidyStartTime',
    width: 160,
  },
  {
    title: '补贴结束时间',
    key: 'subsidyEndTime',
    width: 160,
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render(row) {
      const statusInfo = statusMap[row.status] || { text: '未知', type: 'error' };
      return h(NTag, { type: statusInfo.type, size: 'small' }, { default: () => statusInfo.text });
    },
  },
];
