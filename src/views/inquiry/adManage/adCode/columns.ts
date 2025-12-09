import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface AdCodeData {
  id: number;
  appName: string;
  adNetwork: number;
  adType: number;
  codeSlot: string;
  priceType: number;
  price: number;
  status: number;
}

const statusMap: Record<number, { text: string; type: string }> = {
  1: { text: '启用', type: 'success' },
  0: { text: '禁用', type: 'error' },
};

export const adNetworkMap: Record<number, string> = {
  1: '百度联盟',
  2: '穿山甲',
  3: '腾讯广告',
  4: 'sigmob',
  5: '快手',
};

export const adTypeMap: Record<number, string> = {
  1: '短视频',
  2: '激励视频',
  3: 'Banner',
  4: '信息流',
  5: '插屏',
  6: '开屏',
};

export const priceTypeMap: Record<number, string> = {
  1: '竞价',
  2: '固价',
};

export const columns: BasicColumn<AdCodeData>[] = [
  {
    title: 'App名称',
    key: 'appName',
    width: 120,
  },
  {
    title: '广告网络',
    key: 'adNetwork',
    width: 100,
    render(record) {
      return adNetworkMap[record.adNetwork] || '-';
    },
  },
  {
    title: '广告类型',
    key: 'adType',
    width: 100,
    render(record) {
      return adTypeMap[record.adType] || '-';
    },
  },
  {
    title: '代码位',
    key: 'codeSlot',
    width: 180,
  },
  {
    title: '广告价格类型',
    key: 'priceType',
    width: 110,
    render(record) {
      return priceTypeMap[record.priceType] || '-';
    },
  },
  {
    title: '广告价格',
    key: 'price',
    width: 100,
    render(record) {
      return `¥${record.price.toFixed(2)}`;
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
