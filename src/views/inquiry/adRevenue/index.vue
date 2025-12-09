<template>
  <n-flex vertical>
    <n-card :bordered="false">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
        <template #ecpmSlot="{ model }">
          <n-input-group>
            <n-input v-model:value="model['ecpmMin']" placeholder="最小值" />
            <n-input v-model:value="model['ecpmMax']" placeholder="最大值" />
          </n-input-group>
        </template>
      </BasicForm>
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
  import { columns, adNetworkMap, adTypeMap } from './columns';
  import { getAdRevenueList } from '@/api/inquiry/adRevenue';

  const actionRef = ref();

  // 广告网络选项
  const adNetworkOptions = Object.entries(adNetworkMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  // 广告类型选项
  const adTypeOptions = Object.entries(adTypeMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  // 搜索表单配置
  const schemas: FormSchema[] = [
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
      field: 'userId',
      component: 'NInput',
      label: '用户ID',
      componentProps: {
        placeholder: '请输入用户ID',
      },
    },
    {
      field: 'codeSlotId',
      component: 'NInput',
      label: '代码位ID',
      componentProps: {
        placeholder: '请输入代码位ID',
      },
    },
    {
      field: 'adNetwork',
      component: 'NSelect',
      label: '广告网络',
      componentProps: {
        placeholder: '请选择广告网络',
        options: adNetworkOptions,
      },
    },
    {
      field: 'ecpm',
      label: 'ECPM区间',
      slot: 'ecpmSlot',
    },
    {
      field: 'adType',
      component: 'NSelect',
      label: '广告类型',
      componentProps: {
        placeholder: '请选择广告类型',
        options: adTypeOptions,
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
  ];

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 100,
    schemas,
    collapsedRows: 2,
  });

  // 加载表格数据
  const loadDataTable = async (res: any) => {
    return await getAdRevenueList({ ...getFieldsValue(), ...res });
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
