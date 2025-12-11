<template>
  <n-flex vertical>
    <n-card :bordered="false">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" />
    </n-card>
    <n-card :bordered="false">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        :scroll-x="1600"
        :striped="true"
      />
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { ref, reactive, h } from 'vue';
  import { useDialog } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns, BlacklistUserData } from './columns';
  import { getBlacklistUserList, removeBlacklist } from '@/api/inquiry/blacklistUser';

  defineOptions({
    name: 'inquiry_blacklist_user',
  });

  const actionRef = ref();
  const dialog = useDialog();

  // 搜索表单
  const schemas: FormSchema[] = [
    {
      field: 'userId',
      component: 'NInput',
      label: '用户ID',
      componentProps: {
        placeholder: '请输入用户ID',
      },
    },
    {
      field: 'nickname',
      component: 'NInput',
      label: '用户昵称',
      componentProps: {
        placeholder: '请输入用户昵称',
      },
    },
    {
      field: 'masterId',
      component: 'NInput',
      label: '师傅ID',
      componentProps: {
        placeholder: '请输入师傅ID',
      },
    },
    {
      field: 'masterName',
      component: 'NInput',
      label: '师傅昵称',
      componentProps: {
        placeholder: '请输入师傅昵称',
      },
    },
    {
      field: 'appName',
      component: 'NSelect',
      label: 'App名称',
      componentProps: {
        placeholder: '请选择App',
        options: [
          { label: '消消乐', value: '消消乐' },
          { label: '斗地主', value: '斗地主' },
          { label: '跑酷大作战', value: '跑酷大作战' },
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

  // 操作栏
  const actionColumn = reactive({
    width: 120,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record: BlacklistUserData) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '解除黑名单',
            type: 'warning',
            onClick: handleRemoveBlacklist.bind(null, record),
          },
        ],
      });
    },
  });

  // 搜索
  const handleSubmit = () => {
    reloadTable();
  };

  // 重置
  const handleReset = () => {
    reloadTable();
  };

  // 获取列表数据
  const loadDataTable = async (res) => {
    const formValues = getFieldsValue();
    const params = {
      ...formValues,
      ...res,
    };
    return await getBlacklistUserList(params);
  };

  function reloadTable() {
    actionRef.value.reload();
  }

  // 解除黑名单
  function handleRemoveBlacklist(record: BlacklistUserData) {
    dialog.warning({
      title: '确认',
      content: `确定要解除用户 "${record.nickname}" 的黑名单状态吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await removeBlacklist({ id: record.id });
          window['$message'].success('解除成功');
          reloadTable();
        } catch (error) {
          window['$message'].error('操作失败');
        }
      },
    });
  }
</script>
