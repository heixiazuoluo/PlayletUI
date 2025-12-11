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
        :scroll-x="1500"
        :striped="true"
      />
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns, commissionTypeMap, relationMap, userLevelMap } from './columns';
  import { getFissionRecordList } from '@/api/inquiry/fissionRecord';

  defineOptions({
    name: 'inquiry_fission_record',
  });

  const actionRef = ref();

  // 佣金类型选项
  const commissionTypeOptions = Object.entries(commissionTypeMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  // 关系选项
  const relationOptions = [
    { label: '全部', value: 0 },
    ...Object.entries(relationMap).map(([value, label]) => ({
      label,
      value: Number(value),
    })),
  ];

  // 用户等级选项
  const userLevelOptions = Object.entries(userLevelMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  // 搜索表单
  const schemas: FormSchema[] = [
    {
      field: 'gameName',
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
      field: 'userLevel',
      component: 'NSelect',
      label: '用户等级',
      componentProps: {
        placeholder: '请选择',
        options: userLevelOptions,
      },
    },
    {
      field: 'subUserId',
      component: 'NInput',
      label: '下级ID',
      componentProps: {
        placeholder: '请输入下级ID',
      },
    },
    {
      field: 'subNickname',
      component: 'NInput',
      label: '下级昵称',
      componentProps: {
        placeholder: '请输入下级昵称',
      },
    },
    {
      field: 'commissionType',
      component: 'NSelect',
      label: '佣金类型',
      componentProps: {
        placeholder: '请选择',
        options: commissionTypeOptions,
      },
    },
    {
      field: 'relation',
      component: 'NSelect',
      label: '关系',
      componentProps: {
        placeholder: '请选择',
        options: relationOptions,
      },
    },
    {
      field: 'time',
      component: 'NDatePicker',
      label: '时间',
      componentProps: {
        type: 'datetimerange',
        clearable: true,
      },
    },
  ];

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:5' },
    labelWidth: 80,
    schemas,
    size: 'small',
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
    return await getFissionRecordList(params);
  };

  function reloadTable() {
    actionRef.value.reload();
  }
</script>
