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
        :scroll-x="1200"
        :striped="true"
      />
    </n-card>
  </n-flex>

  <!-- 编辑弹窗 -->
  <basicModal @register="modalRegister">
    <template #default>
      <BasicForm @register="formRegister" />
    </template>
    <template #action>
      <n-space>
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" :loading="submitLoading" @click="handleConfirm">确定</n-button>
      </n-space>
    </template>
  </basicModal>
</template>

<script lang="ts" setup>
  import { ref, reactive, h } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { basicModal, useModal } from '@/components/Modal';
  import { columns, LeaderData } from './columns';
  import { getLeaderList, updateLeader } from '@/api/leader/manage';

  defineOptions({
    name: 'leader_manage',
  });

  const actionRef = ref();
  const submitLoading = ref(false);
  const currentId = ref<number | null>(null);

  // 状态选项
  const statusOptions = [
    { label: '全部', value: -1 },
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
  ];

  // 团长等级选项
  const levelOptions = [
    { label: 'LV1', value: 1 },
    { label: 'LV2', value: 2 },
    { label: 'LV3', value: 3 },
  ];

  // 搜索表单
  const schemas: FormSchema[] = [
    {
      field: 'leaderId',
      component: 'NInput',
      label: '团长ID',
      componentProps: {
        placeholder: '请输入团长ID',
      },
    },
    {
      field: 'leaderName',
      component: 'NInput',
      label: '团长昵称',
      componentProps: {
        placeholder: '请输入团长昵称',
      },
    },
    {
      field: 'status',
      component: 'NSelect',
      label: '状态',
      componentProps: {
        placeholder: '请选择',
        options: statusOptions,
      },
    },
  ];

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
    size: 'small',
  });

  // 编辑表单
  const formSchemas: FormSchema[] = [
    {
      field: 'loginName',
      component: 'NInput',
      label: '登录名称',
      componentProps: {
        placeholder: '登录名称',
        disabled: true,
      },
    },
    {
      field: 'userId',
      component: 'NInput',
      label: '用户ID',
      componentProps: {
        placeholder: '用户ID',
        disabled: true,
      },
    },
    {
      field: 'gameName',
      component: 'NInput',
      label: '游戏名称',
      componentProps: {
        placeholder: '游戏名称',
        disabled: true,
      },
    },
    {
      field: 'leaderLevel',
      component: 'NRadioGroup',
      label: '团长等级',
      componentProps: {
        placeholder: '请选择团长等级',
        options: levelOptions,
      },
      rules: [{ required: true, type: 'number', message: '请选择团长等级', trigger: 'change' }],
    },
    {
      field: 'status',
      component: 'NRadioGroup',
      label: '状态',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
      rules: [{ required: true, type: 'number', message: '请选择状态', trigger: 'change' }],
    },
    {
      field: 'realName',
      component: 'NInput',
      label: '姓名',
      componentProps: {
        placeholder: '姓名',
        disabled: true,
      },
    },
    {
      field: 'phone',
      component: 'NInput',
      label: '手机',
      componentProps: {
        placeholder: '手机',
        disabled: true,
      },
    },
    {
      field: 'remark',
      component: 'NInput',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
        rows: 3,
      },
    },
  ];

  const [formRegister, { submit, setFieldsValue, resetFields }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 100,
    layout: 'horizontal',
    showActionButtonGroup: false,
    schemas: formSchemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '编辑团长',
  });

  // 操作栏
  const actionColumn = reactive({
    width: 100,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record: LeaderData) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
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
    return await getLeaderList(params);
  };

  function reloadTable() {
    actionRef.value.reload();
  }

  // 编辑
  function handleEdit(record: LeaderData) {
    currentId.value = record.id;
    setTimeout(() => {
      setFieldsValue({
        loginName: record.loginName,
        userId: record.userId,
        gameName: record.gameName,
        leaderLevel: record.leaderLevel,
        status: record.status,
        realName: record.realName,
        phone: record.phone,
        remark: record.remark,
      });
    }, 50);

    openModal();
  }

  // 取消
  function handleCancel() {
    closeModal();
    resetFields();
  }

  // 确认提交
  async function handleConfirm() {
    try {
      const values = await submit();
      if (!values) return;

      submitLoading.value = true;
      setSubLoading(true);

      await updateLeader({
        id: currentId.value,
        ...values,
      });

      window['$message'].success('编辑成功');
      closeModal();
      resetFields();
      reloadTable();
    } catch (error) {
      window['$message'].error('编辑失败');
    } finally {
      submitLoading.value = false;
      setSubLoading(false);
    }
  }
</script>
