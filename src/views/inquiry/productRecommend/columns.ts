import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface ProductData {
  id: number;
  gameName: string;
  packageName: string;
  downloadUrl: string;
  icon: string;
  status: number;
  uploadType: number;
}

const statusMap: Record<number, { text: string; type: string }> = {
  1: { text: '启用', type: 'success' },
  0: { text: '禁用', type: 'error' },
};

const uploadTypeMap: Record<number, string> = {
  0: '禁用',
  1: '阿里云OSS',
  2: '备用',
};

export const columns: BasicColumn<ProductData>[] = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '游戏名称',
    key: 'gameName',
    width: 150,
  },
  {
    title: '包名',
    key: 'packageName',
    width: 200,
  },
  {
    title: '下载地址',
    key: 'downloadUrl',
    width: 250,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: 'Icon图',
    key: 'icon',
    width: 80,
    render(record) {
      return h(NAvatar, {
        size: 40,
        src: record.icon,
        fallbackSrc: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
      });
    },
  },
  {
    title: '打包上传方式',
    key: 'uploadType',
    width: 120,
    render(record) {
      return uploadTypeMap[record.uploadType] || '-';
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render(record) {
      const status = statusMap[record.status] || statusMap[0];
      return h(NTag, { type: status.type as any, size: 'small' }, { default: () => status.text });
    },
  },
];
