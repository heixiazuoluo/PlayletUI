import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface UserData {
  userId: number;
  nickname: string;
  avatar: string;
  userLevel: number;
  masterId: number | null;
  masterNickname: string;
  leaderId: number | null;
  leaderNickname: string;
  totalCoins: number;
  totalWithdraw: number;
  availableCoins: number;
  status: number;
  registerTime: string;
  loginTime: string;
  loginIp: string;
  banCount: number;
}

const statusMap = {
  1: { text: '启用', type: 'success' },
  0: { text: '禁用', type: 'error' },
};

const levelMap = {
  1: { text: '普通用户', type: 'default' },
  2: { text: '会员', type: 'info' },
  3: { text: 'VIP', type: 'warning' },
  4: { text: 'SVIP', type: 'success' },
};

export const columns: BasicColumn<UserData>[] = [
  {
    title: '用户ID',
    key: 'userId',
    width: 80,
  },
  {
    title: '用户昵称',
    key: 'nickname',
    width: 120,
  },
  {
    title: '头像',
    key: 'avatar',
    width: 80,
    render(record) {
      return h(NAvatar, {
        size: 40,
        src: record.avatar,
        fallbackSrc: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
      });
    },
  },
  {
    title: '用户等级',
    key: 'userLevel',
    width: 100,
    render(record) {
      const level = levelMap[record.userLevel] || levelMap[1];
      return h(NTag, { type: level.type as any, size: 'small' }, { default: () => level.text });
    },
  },
  {
    title: '师傅ID',
    key: 'masterId',
    width: 80,
    render(record) {
      return record.masterId || '-';
    },
  },
  {
    title: '师傅昵称',
    key: 'masterNickname',
    width: 100,
    render(record) {
      return record.masterNickname || '-';
    },
  },
  {
    title: '团长ID',
    key: 'leaderId',
    width: 80,
    render(record) {
      return record.leaderId || '-';
    },
  },
  {
    title: '团长昵称',
    key: 'leaderNickname',
    width: 100,
    render(record) {
      return record.leaderNickname || '-';
    },
  },
  {
    title: '累计金币',
    key: 'totalCoins',
    width: 100,
  },
  {
    title: '累计提现(元)',
    key: 'totalWithdraw',
    width: 110,
    render(record) {
      return `¥${record.totalWithdraw.toFixed(2)}`;
    },
  },
  {
    title: '可提现金币',
    key: 'availableCoins',
    width: 100,
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
    title: '封禁次数',
    key: 'banCount',
    width: 90,
  },
];
