import { h } from 'vue';
import { NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';

export interface RoleData {
  Id: number;
  CreateTime: string;
  ModifyTime: string;
  CreatorId: number;
  ModifierId: number;
  RoleName: string;
  RoleSort: number;
  RoleStatus: number;
  Remark: string;
  MenuIds: number[];
}

export const columns: BasicColumn<RoleData>[] = [
  {
    type: 'selection',
    key: 'selection',
  },
  {
    title: '角色名称',
    key: 'RoleName',
    width: 150,
  },
  {
    title: '显示顺序',
    key: 'RoleSort',
    width: 100,
  },
  {
    title: '状态',
    key: 'RoleStatus',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.RoleStatus === 1 ? 'success' : 'error',
        },
        {
          default: () => (row.RoleStatus === 1 ? '启用' : '禁用'),
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'CreateTime',
    width: 180,
  },
];
