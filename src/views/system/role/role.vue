<template>
  <n-flex vertical>
    <n-card :bordered="false">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" />
    </n-card>
    <n-card :bordered="false">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.Id"
        ref="actionRef"
        :actionColumn="actionColumn"
        :checked-row-keys="selectArr"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新增角色
          </n-button>
          <n-button
            type="error"
            v-debounce="handleBatchDelete"
            :disabled="!selectArr.length"
            class="ml-2"
          >
            <template #icon>
              <n-icon>
                <DeleteFilled />
              </n-icon>
            </template>
            删除
          </n-button>
        </template>

        <template #action>
          <TableAction />
        </template>
      </BasicTable>
    </n-card>

    <!-- 新增/编辑弹窗 -->
    <basicModal @register="modalRegister" @on-ok="handleSubmitForm">
      <div class="pt-4">
        <BasicForm @register="formRegister" />
        <div class="px-4">
          <div class="mb-2 font-medium">菜单权限</div>
          <div class="border rounded p-2" style="max-height: 300px; overflow-y: auto">
            <n-tree
              block-line
              cascade
              checkable
              :data="treeData"
              :checked-keys="formData.MenuIds"
              :expanded-keys="expandedKeys"
              @update:checked-keys="onCheckedKeys"
              @update:expanded-keys="onExpandedKeys"
            />
          </div>
          <div class="mt-2">
            <n-space>
              <n-button size="small" @click="toggleExpand">
                {{ expandedKeys.length ? '收起全部' : '展开全部' }}
              </n-button>
              <n-button size="small" @click="toggleCheckAll">
                {{ isAllChecked ? '取消全选' : '全部选择' }}
              </n-button>
            </n-space>
          </div>
        </div>
      </div>
    </basicModal>
  </n-flex>
</template>

<script lang="ts" setup>
  import { reactive, ref, h, onMounted, onActivated, computed, nextTick } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { basicModal, useModal } from '@/components/Modal';
  import { getRoleList, batchDeleteRole, getMenuTreeData, createRole, updateRole } from '@/api/system/role';
  import { columns } from './columns';
  import { PlusOutlined, DeleteFilled } from '@vicons/antd';

  // 菜单树数据接口返回类型
  interface MenuTreeItem {
    Id: number;
    Menuname: string;
    Parentid: number;
    ParentName: string | null;
    Menustatus: number;
    Menusort: number;
  }

  // 树节点类型
  interface TreeNode {
    key: number;
    label: string;
    children?: TreeNode[];
  }

  // 角色数据类型
  interface RoleData {
    Id: number;
    Createtime: string;
    Modifytime: string;
    Creatorid: number;
    Modifierid: number;
    Rolename: string;
    Rolesort: number;
    Rolestatus: number;
    Remark: string;
    MenuIds: number[];
  }

  // 将扁平数据转换为树形结构
  function convertToTree(list: MenuTreeItem[]): TreeNode[] {
    const map = new Map<number, TreeNode>();
    const roots: TreeNode[] = [];

    list.forEach((item) => {
      map.set(item.Id, {
        key: item.Id,
        label: item.Menuname,
        children: [],
      });
    });

    list.forEach((item) => {
      const node = map.get(item.Id)!;
      if (item.Parentid === 0) {
        roots.push(node);
      } else {
        const parent = map.get(item.Parentid);
        if (parent) {
          parent.children!.push(node);
        }
      }
    });

    function cleanEmptyChildren(nodes: TreeNode[]) {
      nodes.forEach((node) => {
        if (node.children && node.children.length === 0) {
          delete node.children;
        } else if (node.children) {
          cleanEmptyChildren(node.children);
        }
      });
    }
    cleanEmptyChildren(roots);

    return roots;
  }

  // 获取所有节点key
  function getAllKeys(nodes: TreeNode[]): number[] {
    const keys: number[] = [];
    function traverse(list: TreeNode[]) {
      list.forEach((node) => {
        keys.push(node.key);
        if (node.children) {
          traverse(node.children);
        }
      });
    }
    traverse(nodes);
    return keys;
  }

  // 定义组件名称，用于 keep-alive 缓存
  defineOptions({
    name: 'system_role',
  });

  onActivated(() => {
    reloadTable();
  });

  // 搜索表单配置
  const schemas: FormSchema[] = [
    {
      field: 'roleName',
      component: 'NInput',
      label: '角色名称',
      componentProps: {
        placeholder: '请输入角色名称',
      },
    },
    {
      field: 'roleStatus',
      component: 'NSelect',
      label: '角色状态',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '全部', value: -1 },
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
  ];

  // 编辑表单配置
  const editSchemas: FormSchema[] = [
    {
      field: 'Rolename',
      component: 'NInput',
      label: '角色名称',
      componentProps: {
        placeholder: '请输入角色名称',
      },
      rules: [{ required: true, message: '请输入角色名称', trigger: ['blur'] }],
    },
    {
      field: 'Rolesort',
      component: 'NInputNumber',
      label: '显示顺序',
      defaultValue: 0,
      componentProps: {
        placeholder: '请输入显示顺序',
        min: 0,
      },
    },
    {
      field: 'Rolestatus',
      component: 'NRadioGroup',
      label: '状态',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
    {
      field: 'Remark',
      component: 'NInput',
      label: '备注',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入备注',
      },
    },
  ];

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:5 2xl:5' },
    labelWidth: 80,
    schemas,
    size: 'small',
  });

  const [formRegister, { submit: submitForm, setFieldsValue, resetFields }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 80,
    layout: 'horizontal',
    showActionButtonGroup: false,
    schemas: editSchemas,
  });

  const message = useMessage();
  const actionRef = ref();
  const selectArr = ref<number[]>([]);
  const treeData = ref<TreeNode[]>([]);
  const expandedKeys = ref<number[]>([]);
  const allKeys = ref<number[]>([]);
  const isEdit = ref(false);

  // 表单数据
  const formData = ref<RoleData>({
    Id: 0,
    Createtime: '',
    Modifytime: '',
    Creatorid: 0,
    Modifierid: 0,
    Rolename: '',
    Rolesort: 0,
    Rolestatus: 1,
    Remark: '',
    MenuIds: [],
  });

  // 是否全选
  const isAllChecked = computed(() => {
    return allKeys.value.length > 0 && formData.value.MenuIds.length === allKeys.value.length;
  });

  // 弹窗
  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: computed(() => (isEdit.value ? '编辑角色' : '新增角色')),
    subBtuText: '保存',
  });

  // 搜索
  const handleSubmit = (_val) => {
    reloadTable();
  };

  // 重置
  const handleReset = (_val) => {
    reloadTable();
  };

  const actionColumn = reactive({
    width: 180,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => true,
          },
        ],
      });
    },
  });

  const loadDataTable = async (res: any) => {
    const formValues = getFieldsValue();
    const params = {
      pageSize: res.pageSize,
      pageIndex: res.pageIndex,
      roleName: formValues.roleName || '',
      roleStatus: formValues.roleStatus ?? -1,
    };
    return await getRoleList(params);
  };

  function onCheckedRow(rowKeys: any[]) {
    selectArr.value = rowKeys;
  }

  // 批量删除
  async function handleBatchDelete() {
    if (!selectArr.value.length) return;
    try {
      await batchDeleteRole(selectArr.value);
      message.success('删除成功');
      selectArr.value = [];
      reloadTable();
    } catch (error) {
      message.error('删除失败');
    }
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  // 新增
  function handleAdd() {
    isEdit.value = false;
    formData.value = {
      Id: 0,
      Createtime: '',
      Modifytime: '',
      Creatorid: 0,
      Modifierid: 0,
      Rolename: '',
      Rolesort: 0,
      Rolestatus: 1,
      Remark: '',
      MenuIds: [],
    };
    openModal();
    nextTick(() => {
      resetFields();
    });
  }

  // 编辑
  function handleEdit(record: Recordable) {
    isEdit.value = true;
    formData.value = {
      Id: record.Id,
      Createtime: record.Createtime || '',
      Modifytime: record.Modifytime || '',
      Creatorid: record.Creatorid || 0,
      Modifierid: record.Modifierid || 0,
      Rolename: record.Rolename || record.RoleName || '',
      Rolesort: record.Rolesort || record.RoleSort || 0,
      Rolestatus: record.Rolestatus ?? record.RoleStatus ?? 1,
      Remark: record.Remark || '',
      MenuIds: record.MenuIds || [],
    };
    openModal();
    nextTick(() => {
      setFieldsValue({
        Rolename: formData.value.Rolename,
        Rolesort: formData.value.Rolesort,
        Rolestatus: formData.value.Rolestatus,
        Remark: formData.value.Remark,
      });
    });
  }

  // 菜单树选中
  function onCheckedKeys(keys: number[]) {
    formData.value.MenuIds = keys;
  }

  // 菜单树展开
  function onExpandedKeys(keys: number[]) {
    expandedKeys.value = keys;
  }

  // 展开/收起全部
  function toggleExpand() {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = treeData.value.map((item) => item.key);
    }
  }

  // 全选/取消全选
  function toggleCheckAll() {
    if (isAllChecked.value) {
      formData.value.MenuIds = [];
    } else {
      formData.value.MenuIds = [...allKeys.value];
    }
  }

  // 提交表单
  async function handleSubmitForm() {
    const formResult = await submitForm();
    if (!formResult) {
      setSubLoading(false);
      return;
    }

    try {
      const params: RoleData = {
        ...formData.value,
        Rolename: formResult.Rolename,
        Rolesort: formResult.Rolesort,
        Rolestatus: formResult.Rolestatus,
        Remark: formResult.Remark || '',
      };

      console.log('提交参数:', params);

      if (isEdit.value) {
        await updateRole(params);
        message.success('编辑成功');
      } else {
        await createRole(params);
        message.success('新增成功');
      }
      closeModal();
      reloadTable();
    } catch (error) {
      message.error(isEdit.value ? '编辑失败' : '新增失败');
      setSubLoading(false);
    }
  }

  onMounted(async () => {
    try {
      const res = await getMenuTreeData();
      const list = res.Data || res;
      treeData.value = convertToTree(list);
      allKeys.value = getAllKeys(treeData.value);
      expandedKeys.value = treeData.value.map((item) => item.key);
    } catch (error) {
      console.error('获取菜单树数据失败', error);
    }
  });
</script>

<style lang="less" scoped></style>
