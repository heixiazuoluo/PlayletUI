import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface ListData {
  id: number;
  userID: string;
  mobile: string | null;
  email: string | null;
  userName: string | null;
  pwd: string;
  createtime: string;
  salt: string;
  status: number;
  lastLoginTime: string | null;
  remark: string | null;
  parentid: number | null;
  istg: number;
  moneys: number | null;
  openid: string | null;
  ratioUnion: number | null;
  appSign: string | null;
  tgcode: string | null;
  QQ: string | null;
  channel: string | null;
  uid: string | null;
  RoleIds?: number;
  games?: number;
}

export const columns: BasicColumn<ListData>[] = [
  {
    type: 'selection',
    key: 'selection',
  },
  {
    title: '登录名',
    key: 'userID',
    width: 100,
  },
  {
    title: '用户名',
    key: 'userName',
    width: 120,
  },
  {
    title: '手机号',
    key: 'mobile',
    width: 130,
  },
  {
    title: '状态',
    key: 'status',
    width: 80,
    render(record) {
      return h(
        NTag,
        {
          type: record.status === 1 ? 'success' : 'error',
        },
        {
          default: () => (record.status === 1 ? '启用' : '禁用'),
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'createtime',
    width: 180,
  },
  {
    title: '最后登录时间',
    key: 'lastLoginTime',
    width: 180,
  },
  {
    title: '备注',
    key: 'remark',
    width: 150,
    ellipsis: { tooltip: true },
  },
];
