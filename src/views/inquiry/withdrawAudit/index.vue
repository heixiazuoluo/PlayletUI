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
        :scroll-x="1800"
        :striped="true"
      />
    </n-card>
  </n-flex>
  <AuditModal ref="auditModalRef" @success="reloadTable" />
</template>

<script lang="ts" setup>
  import { ref, reactive, h } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns, userLevelMap, withdrawTypeMap } from './columns';
  import { getWithdrawAuditList } from '@/api/inquiry/withdrawAudit';
  import AuditModal from './AuditModal.vue';
  import { formatDate } from '@/utils/dateUtil';

  // 定义组件名称，用于 keep-alive 缓存
  defineOptions({
    name: 'inquiry_withdraw_audit',
  });

  const actionRef = ref();
  const auditModalRef = ref();

  // 用户等级选项
  const userLevelOptions = Object.entries(userLevelMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  // 提现类型选项
  const withdrawTypeOptions = Object.entries(withdrawTypeMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  const schemas: FormSchema[] = [
    {
      field: 'game',
      component: 'NSelect',
      label: '游戏',
      componentProps: {
        placeholder: '请选择游戏',
        options: [
          { label: '消消乐', value: '消消乐' },
          { label: '斗地主', value: '斗地主' },
          { label: '跑酷大作战', value: '跑酷大作战' },
        ],
      },
    },
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
      field: 'auditor',
      component: 'NInput',
      label: '审核人',
      componentProps: {
        placeholder: '请输入审核人',
      },
    },
    {
      field: 'userLevel',
      component: 'NSelect',
      label: '用户等级',
      componentProps: {
        placeholder: '请选择',
        options: [{ label: '全部', value: -1 }, ...userLevelOptions],
      },
    },
    {
      field: 'withdrawType',
      component: 'NSelect',
      label: '提现类型',
      componentProps: {
        placeholder: '请选择',
        options: [{ label: '全部', value: -1 }, ...withdrawTypeOptions],
      },
    },
    {
      field: 'dateRange',
      component: 'NDatePicker',
      label: '提现时间',
      componentProps: {
        type: 'daterange',
        clearable: true,
      },
    },
  ];

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
    size: 'small',
  });

  // 操作栏
  const actionColumn = reactive({
    width: 100,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '审核',
            onClick: handleAudit.bind(null, record),
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
    let start = '';
    let end = '';
    if (formValues.dateRange && formValues.dateRange.length === 2) {
      start = formatDate(formValues.dateRange[0]);
      end = formatDate(formValues.dateRange[1]);
    }
    const params = {
      game: formValues.game || '',
      userId: formValues.userId || '',
      nickname: formValues.nickname || '',
      auditor: formValues.auditor || '',
      userLevel: formValues.userLevel ?? -1,
      withdrawType: formValues.withdrawType ?? -1,
      start,
      end,
      ...res,
    };
    return await getWithdrawAuditList(params);
  };

  function reloadTable() {
    actionRef.value.reload();
  }

  // 审核
  function handleAudit(record) {
    auditModalRef.value.showModal(record);
  }
</script>
