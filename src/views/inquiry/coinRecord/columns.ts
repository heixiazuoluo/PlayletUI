import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface CoinRecordData {
  id: number;
  userId: number;
  nickname: string;
  coin: number;
  coinBefore: number;
  coinAfter: number;
  time: string;
  content: string;
  type: number;
  sourceType: number;
}

const typeMap: Record<number, { text: string; type: string }> = {
  1: { text: '增加', type: 'success' },
  2: { text: '减少', type: 'error' },
};

export const sourceTypeMap: Record<number, string> = {
  1: '看广告',
  2: '提现未收款退回',
  3: '审核不通过退回',
};

export const columns: BasicColumn<CoinRecordData>[] = [
  {
    title: '用户ID',
    key: 'userId',
    width: 100,
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 120,
  },
  {
    title: '金币',
    key: 'coin',
    width: 100,
  },
  {
    title: '增加前金币',
    key: 'coinBefore',
    width: 120,
  },
  {
    title: '增加后金币',
    key: 'coinAfter',
    width: 120,
  },
  {
    title: '时间',
    key: 'time',
    width: 180,
  },
  {
    title: '内容',
    key: 'content',
    width: 150,
  },
  {
    title: '类型',
    key: 'type',
    width: 80,
    render(row) {
      const item = typeMap[row.type] || { text: '未知', type: 'default' };
      return h(NTag, { type: item.type as any, size: 'small' }, { default: () => item.text });
    },
  },
  {
    title: '记录来源类型',
    key: 'sourceType',
    width: 150,
    render(row) {
      return sourceTypeMap[row.sourceType] || '未知';
    },
  },
];
