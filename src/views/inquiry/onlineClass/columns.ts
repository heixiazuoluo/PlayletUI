import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface OnlineClassData {
  id: number;
  gameName: string;
  title: string;
  category: number;
  isHot: number;
  coverImage: string;
  videoUrl: string;
  content: string;
  readCount: number;
  status: number;
}

export const categoryMap: Record<number, string> = {
  1: '视频',
  2: '图文',
};

export const statusMap: Record<number, { text: string; type: 'success' | 'error' }> = {
  1: { text: '启用', type: 'success' },
  0: { text: '禁用', type: 'error' },
};

export const columns: BasicColumn<OnlineClassData>[] = [
  {
    type: 'selection',
    width: 50,
  },
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '文章标题',
    key: 'title',
    width: 200,
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
  {
    title: '分类',
    key: 'category',
    width: 100,
    render(row) {
      return categoryMap[row.category] || '-';
    },
  },
];
