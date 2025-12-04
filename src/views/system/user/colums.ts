import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface ListData {
  id: number;
  name: string;
  userName?: string;
  status: number;
  createDate: string;
  pwd?: string;
  mobile?: string;
  role?: number[];
  games?: number[];
  remark?: string;
}

export const columns: BasicColumn<ListData>[] = [
  {
    type: 'selection',
  },
  {
    title: 'id',
    key: 'id',
  },
  {
    title: '登录名',
    key: 'name',
  },
  {
    title: '状态',
    key: 'status',
    render(record) {
      return h(
        NTag,
        {
          type: record.status === 1 ? 'success' : 'error',
        },
        {
          default: () => (record.status === 1 ? '启用' : '禁用'),
        }
      );
    },
  },
];
