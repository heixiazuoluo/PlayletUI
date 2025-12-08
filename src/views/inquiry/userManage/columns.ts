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
  markStatus: number;
}

export interface FKRecord {
  id: number;
  data1: string;
  data2: string;
}

const markStatusMap = {
  1: { text: '状态1', type: 'success' },
  2: { text: '状态2', type: 'error' },
  3: { text: '状态3', type: 'warning' },
  4: { text: '状态4', type: 'info' },
  5: { text: '状态5', type: 'default' },
  6: { text: '状态6', type: 'default' },
};

const statusMap = {
  1: { text: '启用', type: 'success' },
  0: { text: '禁用', type: 'error' },
};

const levelMap = {
  1: { text: 'V1(初级团长)', type: 'default' },
  2: { text: 'V2(中级团长)', type: 'info' },
  3: { text: 'V3(高级团长)', type: 'warning' },
};
export const fkColumns: BasicColumn<FKRecord>[] = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '数据',
    key: 'data1',
    width: 120,
  },
  {
    title: '执行类型',
    key: 'data2',
    width: 120,
  },
];

export const columns: BasicColumn<UserData>[] = [
  {
    type: 'selection',
    key: 'selection',
    width: 80,
    fixed: 'left',
  },
  {
    title: '用户ID',
    key: 'userId',
    width: 80,
    fixed: 'left',
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
    width: 130,
    render(record) {
      const level = levelMap[record.userLevel] || levelMap[1];
      return level.text || '-';
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
    title: '标记状态',
    key: 'markStatus',
    width: 100,
    render(record) {
      const status = markStatusMap[record.markStatus] || markStatusMap[0];
      return status.text || '-';
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
