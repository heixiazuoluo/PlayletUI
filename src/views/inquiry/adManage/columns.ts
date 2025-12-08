import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface AdData {
  id: number;
  appId: string;
  gameName: string;
  adPlatform: number;
  status: number;
  // 广告位配置
  shortVideoAd: string;
  rewardVideoAd: string;
  rewardVideoAdKey: string;
  bannerAd: string;
  infoFlowAd: string;
  interstitialAd: string;
  splashAd: string;
}

const statusMap: Record<number, { text: string; type: string }> = {
  1: { text: '启用', type: 'success' },
  0: { text: '禁用', type: 'error' },
};

const adPlatformMap: Record<number, string> = {
  1: 'sigmob聚合',
  2: '穿山甲',
};

export const columns: BasicColumn<AdData>[] = [
  {
    title: 'AppID',
    key: 'appId',
    width: 150,
  },
  {
    title: '游戏名称',
    key: 'gameName',
    width: 150,
  },
  {
    title: '广告平台',
    key: 'adPlatform',
    width: 120,
    render(record) {
      return adPlatformMap[record.adPlatform] || '-';
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
