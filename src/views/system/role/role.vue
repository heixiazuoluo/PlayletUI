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
          <n-button type="primary" @click="addRole">
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

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="editRoleTitle">
      <div class="py-3 menu-list">
        <n-tree
          block-line
          cascade
          checkable
          :virtual-scroll="true"
          :data="treeData"
          :expandedKeys="expandedKeys"
          :checked-keys="checkedKeys"
          style="max-height: 950px; overflow: hidden"
          @update:checked-keys="checkedTree"
          @update:expanded-keys="onExpandedKeys"
        />
      </div>
      <template #action>
        <n-space>
          <n-button type="info" ghost icon-placement="left" @click="packHandle">
            全部{{ expandedKeys.length ? '收起' : '展开' }}
          </n-button>

          <n-button type="info" ghost icon-placement="left" @click="checkedAllHandle">
            全部{{ checkedAll ? '取消' : '选择' }}
          </n-button>
          <n-button type="primary" :loading="formBtnLoading" @click="confirmForm">提交</n-button>
        </n-space>
      </template>
    </n-modal>
    <CreateModal ref="createModalRef" @success="reloadTable" />
    <EditModal ref="editModalRef" @success="reloadTable" />
  </n-flex>
</template>

<script lang="ts" setup>
  import { reactive, ref, h, onMounted, onActivated, computed } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getRoleList, batchDeleteRole, getMenuTreeData } from '@/api/system/role';
  import { columns } from './columns';
  import { PlusOutlined, DeleteFilled } from '@vicons/antd';
  import CreateModal from './CreateModal.vue';
  import EditModal from './EditModal.vue';

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

  // 将扁平数据转换为树形结构
  function convertToTree(list: MenuTreeItem[]): TreeNode[] {
    const map = new Map<number, TreeNode>();
    const roots: TreeNode[] = [];

    // 第一次遍历，创建所有节点
    list.forEach((item) => {
      map.set(item.Id, {
        key: item.Id,
        label: item.Menuname,
        children: [],
      });
    });

    // 第二次遍历，建立父子关系
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

    // 清理空的 children 数组
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

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:5 2xl:5' },
    labelWidth: 80,
    schemas,
    size: 'small',
  });

  const message = useMessage();
  const actionRef = ref();
  const createModalRef = ref();
  const editModalRef = ref();
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const checkedAll = ref(false);
  const editRoleTitle = ref('');
  const treeData = ref<TreeNode[]>([]);
  const expandedKeys = ref<number[]>([]);
  const checkedKeys = ref<number[]>([]);
  const selectArr = ref<number[]>([]);
  const allKeys = ref<number[]>([]);
  // 当前编辑的角色信息
  const currentRole = ref<{ Id: number; RoleName: string }>({ Id: 0, RoleName: '' });

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

  // 搜索
  const handleSubmit = (_val) => {
    reloadTable();
  };

  // 重置
  const handleReset = (_val) => {
    reloadTable();
  };

  const actionColumn = reactive({
    width: 250,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '菜单权限',
            onClick: handleMenuAuth.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['basic_list'],
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return true;
            },
            auth: ['basic_list'],
          },
          // {
          //   label: '删除',
          //   onClick: handleDelete.bind(null, record),
          //   // 根据业务控制是否显示 isShow 和 auth 是并且关系
          //   ifShow: () => {
          //     return true;
          //   },
          //   // 根据权限控制是否显示: 有权限，会显示，支持多个
          //   auth: ['basic_list'],
          // },
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

  function addRole() {
    createModalRef.value.openModal();
  }

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

  async function confirmForm(e: any) {
    e.preventDefault();
    formBtnLoading.value = true;
    try {
      // 提交选中的菜单Id数组
      const params = {
        Id: currentRole.value.Id,
        MenuIds: checkedKeys.value,
      };
      console.log('提交菜单权限:', params);
      // TODO: 调用保存菜单权限接口
      // await saveRoleMenus(params);
      showModal.value = false;
      message.success('提交成功');
      reloadTable();
    } catch (error) {
      message.error('提交失败');
    } finally {
      formBtnLoading.value = false;
    }
  }

  function handleEdit(record: Recordable) {
    console.log('点击了编辑', record);
    // router.push({ name: 'basic-info', params: { id: record.id } });
    editModalRef.value.showModal(record);
  }

  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    message.info('点击了删除');
  }

  function handleMenuAuth(record: Recordable) {
    // 保存当前角色信息
    currentRole.value = { Id: record.Id, RoleName: record.RoleName };
    editRoleTitle.value = `分配 ${record.RoleName} 的菜单权限`;
    // 设置已选中的菜单（如果有）
    checkedKeys.value = record.MenuIds || [];
    showModal.value = true;
  }

  function checkedTree(keys: number[]) {
    checkedKeys.value = keys;
  }

  function onExpandedKeys(keys) {
    expandedKeys.value = keys;
  }

  function packHandle() {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = treeData.value.map((item: any) => item.key) as [];
    }
  }

  function checkedAllHandle() {
    if (!checkedAll.value) {
      checkedKeys.value = [...allKeys.value];
      checkedAll.value = true;
    } else {
      checkedKeys.value = [];
      checkedAll.value = false;
    }
  }

  onMounted(async () => {
    try {
      const res = await getMenuTreeData();
      const list = res.Data || res;
      treeData.value = convertToTree(list);
      allKeys.value = getAllKeys(treeData.value);
      // 默认展开第一级
      expandedKeys.value = treeData.value.map((item) => item.key);
    } catch (error) {
      console.error('获取菜单树数据失败', error);
    }
  });
</script>

<style lang="less" scoped></style>
