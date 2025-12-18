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
  import { ref, onMounted, computed } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns, commissionTypeMap, relationMap, userLevelMap } from './columns';
  import { getFissionRecordList } from '@/api/inquiry/fissionRecord';
  import { useCommonStore } from '@/store/modules/common';
  import { formatDate } from '@/utils/dateUtil';

  defineOptions({
    name: 'inquiry_fission_record',
  });

  const actionRef = ref();

  // 使用公共 store
  const commonStore = useCommonStore();
  const gameOptions = computed(() => commonStore.getGameOptions);

  // 佣金类型选项：1=师徒奖励，2=团长奖励
  const commissionTypeOptions = Object.entries(commissionTypeMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  // 关系选项：0=全部，1=直推，2=间推
  const relationOptions = [
    { label: '全部', value: 0 },
    ...Object.entries(relationMap).map(([value, label]) => ({
      label,
      value: Number(value),
    })),
  ];

  // 用户等级选项：1=V1(初级团长)，2=V2(中级团长)，3=V3(高级团长)
  const userLevelOptions = [
    { label: 'V1(初级团长)', value: 1 },
    { label: 'V2(中级团长)', value: 2 },
    { label: 'V3(高级团长)', value: 3 },
  ];

  // 搜索表单
  const schemas: FormSchema[] = [
    {
      field: 'gid',
      component: 'NSelect',
      label: '游戏',
      componentProps: {
        placeholder: '请选择游戏',
        options: gameOptions,
      },
    },
    {
      field: 'userID',
      component: 'NInput',
      label: '用户ID',
      componentProps: {
        placeholder: '请输入用户ID',
      },
    },
    {
      field: 'username',
      component: 'NInput',
      label: '用户名',
      componentProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      field: 'tvG',
      component: 'NSelect',
      label: '用户等级',
      componentProps: {
        placeholder: '请选择',
        options: userLevelOptions,
      },
    },
    {
      field: 'xjuserID',
      component: 'NInput',
      label: '下级ID',
      componentProps: {
        placeholder: '请输入下级ID',
      },
    },
    {
      field: 'xjusername',
      component: 'NInput',
      label: '下级昵称',
      componentProps: {
        placeholder: '请输入下级昵称',
      },
    },
    {
      field: 'typeID',
      component: 'NSelect',
      label: '佣金类型',
      componentProps: {
        placeholder: '请选择',
        options: commissionTypeOptions,
      },
    },
    {
      field: 'typeIDs',
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

  const [register, { getFieldsValue, setFieldsValue: setSearchFieldsValue }] = useForm({
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
    // 处理时间范围
    let StartTime = '';
    let EndTime = '';
    if (formValues.time && formValues.time.length === 2) {
      StartTime = formatDate(formValues.time[0], 'YYYY-MM-DD HH:mm:ss');
      EndTime = formatDate(formValues.time[1], 'YYYY-MM-DD HH:mm:ss');
    }
    const params = {
      StartTime,
      EndTime,
      ...res,
      ...formValues,
    };
    return await getFissionRecordList(params);
  };

  function reloadTable() {
    actionRef.value.reload();
  }

  // 获取游戏列表
  onMounted(async () => {
    await commonStore.fetchGames();
    // 设置默认值为第一个游戏
    if (gameOptions.value.length > 0) {
      setSearchFieldsValue({ gid: gameOptions.value[0].value });
      setTimeout(() => {
        reloadTable();
      }, 50);
    }
  });
</script>
