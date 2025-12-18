import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface WithdrawSettingData {
  Id: number;
  label: string;
  limit: number;
  value: number;
  gid: number;
  typeID: number;
  status: number;
  sign: number;
  SubsidyAmount: number;
  SubsidyStartTime: string;
  SubsidyEndTime: string;
}

// 类别映射：0-玩家，1-团长，2-师傅
export const typeMap: Record<number, string> = {
  0: '玩家',
  1: '团长',
  2: '师傅',
};

export const statusMap: Record<number, { text: string; type: 'success' | 'error' }> = {
  1: { text: '启用', type: 'success' },
  0: { text: '禁用', type: 'error' },
};

export const columns: BasicColumn<WithdrawSettingData>[] = [
  {
    title: 'ID',
    key: 'Id',
    width: 80,
  },
  {
    title: '描述',
    key: 'label',
    width: 150,
  },
  {
    title: '类别',
    key: 'typeID',
    width: 100,
    render(row) {
      return typeMap[row.typeID] || '-';
    },
  },
  {
    title: '提现金额',
    key: 'value',
    width: 120,
  },
  {
    title: '每日提现次数',
    key: 'limit',
    width: 120,
  },
  {
    title: '补贴金额',
    key: 'SubsidyAmount',
    width: 100,
  },
  {
    title: '补贴开始时间',
    key: 'SubsidyStartTime',
    width: 160,
  },
  {
    title: '补贴结束时间',
    key: 'SubsidyEndTime',
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
