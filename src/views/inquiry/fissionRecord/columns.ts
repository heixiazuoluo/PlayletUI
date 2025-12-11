import { BasicColumn } from '@/components/Table';

export interface FissionRecordData {
  id: number;
  userId: string;
  nickname: string;
  userLevel: number;
  subUserId: string;
  subNickname: string;
  subLevel: number;
  subWithdrawAmount: number;
  commissionIncome: number;
  commissionType: number;
  relation: number;
  commissionRate: number;
  withdrawTime: string;
}

export const userLevelMap: Record<number, string> = {
  1: 'V1',
  2: 'V2',
  3: 'V3',
};

export const commissionTypeMap: Record<number, string> = {
  1: '师徒奖励',
  2: '团长奖励',
};

export const relationMap: Record<number, string> = {
  1: '直推',
  2: '间推',
};

export const columns: BasicColumn<FissionRecordData>[] = [
  {
    title: '用户ID',
    key: 'userId',
    width: 120,
  },
  {
    title: '用户昵称',
    key: 'nickname',
    width: 120,
  },
  {
    title: '用户等级',
    key: 'userLevel',
    width: 100,
    render(row) {
      return userLevelMap[row.userLevel] || '-';
    },
  },
  {
    title: '下级ID',
    key: 'subUserId',
    width: 120,
  },
  {
    title: '下级昵称',
    key: 'subNickname',
    width: 120,
  },
  {
    title: '下级等级',
    key: 'subLevel',
    width: 100,
    render(row) {
      return userLevelMap[row.subLevel] || '-';
    },
  },
  {
    title: '下级金币提现金额(元)',
    key: 'subWithdrawAmount',
    width: 160,
  },
  {
    title: '佣金收入(元)',
    key: 'commissionIncome',
    width: 120,
  },
  {
    title: '佣金类型',
    key: 'commissionType',
    width: 100,
    render(row) {
      return commissionTypeMap[row.commissionType] || '-';
    },
  },
  {
    title: '关系',
    key: 'relation',
    width: 80,
    render(row) {
      return relationMap[row.relation] || '-';
    },
  },
  {
    title: '佣金比例',
    key: 'commissionRate',
    width: 100,
    render(row) {
      return row.commissionRate + '%';
    },
  },
  {
    title: '提现时间',
    key: 'withdrawTime',
    width: 160,
  },
];
