import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface AdRevenueData {
  id: number;
  userId: number;
  nickname: string;
  appName: string;
  codeSlotId: string;
  adType: number;
  ecpm: number;
  userCoin: number;
  userRatio: number;
  time: string;
}

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

export const columns: BasicColumn<AdRevenueData>[] = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
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
    title: '应用名称',
    key: 'appName',
    width: 120,
  },
  {
    title: '代码位ID',
    key: 'codeSlotId',
    width: 150,
  },
  {
    title: '广告类型',
    key: 'adType',
    width: 100,
    render(row) {
      return adTypeMap[row.adType] || '未知';
    },
  },
  {
    title: 'ECPM',
    key: 'ecpm',
    width: 100,
    render(row) {
      return h('span', `${row.ecpm.toFixed(2)}`);
    },
  },
  {
    title: '用户获得金币',
    key: 'userCoin',
    width: 120,
  },
  {
    title: '用户分成比例',
    key: 'userRatio',
    width: 120,
    render(row) {
      return h(NTag, { type: 'info', size: 'small' }, { default: () => `${row.userRatio}%` });
    },
  },
  {
    title: '时间',
    key: 'time',
    width: 180,
  },
];
