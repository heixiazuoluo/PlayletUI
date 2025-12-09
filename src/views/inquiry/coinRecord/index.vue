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
        canResize
        :striped="true"
      />
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns } from './columns';
  import { getCoinRecordList } from '@/api/inquiry/coinRecord';

  const actionRef = ref();

  // 搜索表单配置
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
      field: 'timeRange',
      component: 'NDatePicker',
      label: '时间',
      componentProps: {
        type: 'daterange',
        clearable: true,
        placeholder: '请选择时间范围',
      },
    },
    {
      field: 'appName',
      component: 'NSelect',
      label: 'APP名称',
      componentProps: {
        placeholder: '请选择APP',
        options: [
          { label: 'APP A', value: 'A' },
          { label: 'APP B', value: 'B' },
        ],
      },
    },
    {
      field: 'type',
      component: 'NSelect',
      label: '类型',
      componentProps: {
        placeholder: '请选择类型',
        options: [
          { label: '增加', value: 1 },
          { label: '减少', value: 2 },
        ],
      },
    },
    {
      field: 'sourceType',
      component: 'NSelect',
      label: '记录来源类型',
      componentProps: {
        placeholder: '请选择记录来源类型',
        options: [
          { label: '看广告', value: 1 },
          { label: '提现未收款退回', value: 2 },
          { label: '审核不通过退回', value: 3 },
        ],
      },
    },
  ];

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:5' },
    labelWidth: 100,
    schemas,
  });

  // 加载表格数据
  const loadDataTable = async (res: any) => {
    return await getCoinRecordList({ ...getFieldsValue(), ...res });
  };

  // 刷新表格
  function reloadTable() {
    actionRef.value.reload();
  }

  // 搜索提交
  function handleSubmit(_values: Recordable) {
    reloadTable();
  }

  // 重置搜索
  function handleReset(_values: Recordable) {
    reloadTable();
  }
</script>

<style lang="less" scoped></style>
