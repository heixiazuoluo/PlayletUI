import { h } from 'vue';
import { NTag, NAvatar } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface BlacklistUserData {
  id: number;
  userId: string;
  nickname: string;
  masterId: string;
  masterName: string;
  isBlacklist: number;
  avatar: string;
  registerTime: string;
  loginTime: string;
  loginIp: string;
  coins: number;
  remark: string;
  banCount: number;
  banOperator: string;
}

export const blacklistStatusMap: Record<number, { text: string; type: 'success' | 'error' }> = {
  1: { text: '是', type: 'error' },
  0: { text: '否', type: 'success' },
};

export const columns: BasicColumn<BlacklistUserData>[] = [
  {
    title: '用户ID',
    key: 'userId',
    width: 120,
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 120,
  },
  {
    title: '师傅ID',
    key: 'masterId',
    width: 120,
  },
  {
    title: '师傅名称',
    key: 'masterName',
    width: 120,
  },
  {
    title: '是否拉黑',
    key: 'isBlacklist',
    width: 100,
    render(row) {
      const statusInfo = blacklistStatusMap[row.isBlacklist] || { text: '未知', type: 'error' };
      return h(NTag, { type: statusInfo.type, size: 'small' }, { default: () => statusInfo.text });
    },
  },
  {
    title: '头像',
    key: 'avatar',
    width: 80,
    render(row) {
      return h(NAvatar, { src: row.avatar, size: 'small', round: true });
    },
  },
  {
    title: '注册时间',
    key: 'registerTime',
    width: 160,
  },
  {
    title: '登录时间',
    key: 'loginTime',
    width: 160,
  },
  {
    title: '登录IP',
    key: 'loginIp',
    width: 130,
  },
  {
    title: '金币',
    key: 'coins',
    width: 100,
  },
  {
    title: '备注',
    key: 'remark',
    width: 150,
    ellipsis: { tooltip: true },
  },
  {
    title: '封禁次数',
    key: 'banCount',
    width: 100,
  },
  {
    title: '封禁客服',
    key: 'banOperator',
    width: 120,
  },
];
