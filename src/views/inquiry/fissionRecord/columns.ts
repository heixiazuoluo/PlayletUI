import { BasicColumn } from '@/components/Table';

export interface FissionRecordData {
  userid: number;
  nickname: string;
  tgV: number;
  xjUserID: number;
  nickname2: string;
  tgV2: number;
  coinsWithdrawAll: number;
  money: number;
  addTime: string;
  typeid: number;
  msg: string;
  remark: string;
}

// 用户等级：1=V1(初级团长)，2=V2(中级团长)，3=V3(高级团长)
export const userLevelMap: Record<number, string> = {
  0: '-',
  1: 'V1(初级团长)',
  2: 'V2(中级团长)',
  3: 'V3(高级团长)',
};

// 佣金类型：1=师徒奖励，2=团长奖励
export const commissionTypeMap: Record<number, string> = {
  1: '师徒奖励',
  2: '团长奖励',
};

// 关系：0=全部，1=直推，2=间推
export const relationMap: Record<number, string> = {
  1: '直推',
  2: '间推',
};

export const columns: BasicColumn<FissionRecordData>[] = [
  {
    title: '用户ID',
    key: 'userid',
    width: 100,
  },
  {
    title: '用户昵称',
    key: 'nickname',
    width: 150,
  },
  {
    title: '用户等级',
    key: 'tgV',
    width: 120,
    render(row) {
      return userLevelMap[row.tgV] || '-';
    },
  },
  {
    title: '下级ID',
    key: 'xjUserID',
    width: 100,
  },
  {
    title: '下级昵称',
    key: 'nickname2',
    width: 150,
  },
  {
    title: '下级等级',
    key: 'tgV2',
    width: 120,
    render(row) {
      return userLevelMap[row.tgV2] || '-';
    },
  },
  {
    title: '下级金币提现金额',
    key: 'coinsWithdrawAll',
    width: 140,
  },
  {
    title: '佣金收入(元)',
    key: 'money',
    width: 120,
  },
  {
    title: '佣金类型',
    key: 'typeid',
    width: 100,
    render(row) {
      return commissionTypeMap[row.typeid] || '-';
    },
  },
  {
    title: '描述',
    key: 'msg',
    width: 150,
  },
  {
    title: '备注',
    key: 'remark',
    width: 180,
  },
  {
    title: '时间',
    key: 'addTime',
    width: 160,
  },
];
