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
        :scroll-x="1400"
        :striped="true"
      >
        <template #tableTitle>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon><PlusOutlined /></n-icon>
            </template>
            新增
          </n-button>
        </template>
      </BasicTable>

      <!-- 新增/编辑弹窗 -->
      <basicModal @register="modalRegister" @on-ok="onModalOk" style="width: 600px">
        <template #default>
          <BasicForm @register="formRegister">
            <template #msg>
              <n-alert type="info">
                当系统时间处于补贴开始时间至补贴结束时间的区间内时，补贴将自动生效并执行
              </n-alert>
            </template>
          </BasicForm>
        </template>
      </basicModal>
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { ref, reactive, h } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { basicModal, useModal } from '@/components/Modal';
  import { columns, categoryMap, WithdrawSettingData } from './columns';
  import { getWithdrawSettingList } from '@/api/inquiry/withdrawSetting';
  import { PlusOutlined } from '@vicons/antd';

  defineOptions({
    name: 'inquiry_withdraw_setting',
  });

  const actionRef = ref();
  const isEdit = ref(false);
  const currentId = ref<number | null>(null);

  // 类别选项
  const categoryOptions = Object.entries(categoryMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  // 搜索表单
  const schemas: FormSchema[] = [
    {
      field: 'appName',
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
      field: 'category',
      component: 'NSelect',
      label: '类别',
      componentProps: {
        placeholder: '请选择',
        options: [{ label: '全部', value: -1 }, ...categoryOptions],
      },
    },
  ];

  // 新增/编辑表单配置
  const formSchemas: FormSchema[] = [
    {
      field: 'appName',
      component: 'NInput',
      label: 'App名称',
      rules: [{ required: true, message: '请输入App名称', trigger: ['blur'] }],
      componentProps: {
        placeholder: '请输入App名称',
      },
    },
    {
      field: 'category',
      component: 'NSelect',
      label: '类别',
      rules: [{ required: true, type: 'number', message: '请选择类别', trigger: ['change'] }],
      componentProps: {
        placeholder: '请选择类别',
        options: categoryOptions,
      },
    },
    {
      field: 'withdrawAmount',
      component: 'NInputNumber',
      label: '提现金额',
      rules: [{ required: true, type: 'number', message: '请输入提现金额', trigger: ['blur'] }],
      componentProps: {
        placeholder: '请输入提现金额',
        min: 0,
        style: { width: '100%' },
      },
    },
    {
      field: 'dailyLimit',
      component: 'NInputNumber',
      label: '每日提现次数',
      componentProps: {
        placeholder: '请输入每日提现次数',
        min: 0,
        style: { width: '100%' },
      },
    },
    {
      field: 'description',
      component: 'NInput',
      label: '描述',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入描述',
      },
    },
    {
      field: 'subsidyAmount',
      component: 'NInputNumber',
      label: '补贴金额',
      componentProps: {
        placeholder: '请输入补贴金额',
        min: 0,
        style: { width: '100%' },
      },
    },
    {
      field: 'subsidyStartTime',
      component: 'NDatePicker',
      label: '补贴开始时间',
      componentProps: {
        type: 'datetime',
        clearable: true,
        style: { width: '100%' },
      },
    },
    {
      field: 'subsidyEndTime',
      component: 'NDatePicker',
      label: '补贴结束时间',
      componentProps: {
        type: 'datetime',
        clearable: true,
        style: { width: '100%' },
      },
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
    },
    {
      slot: 'msg',
      field: 'msg',
      label: '',
    },
  ];

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
    size: 'small',
  });

  const [formRegister, { submit, setFieldsValue, resetFields }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 120,
    layout: 'horizontal',
    showActionButtonGroup: false,
    schemas: formSchemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading, setProps }] = useModal({
    title: '新增',
  });

  // 操作栏
  const actionColumn = reactive({
    width: 120,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
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
      appName: formValues.appName || '',
      category: formValues.category ?? -1,
      ...res,
    };
    return await getWithdrawSettingList(params);
  };

  function reloadTable() {
    actionRef.value.reload();
  }

  // 新增
  function handleAdd() {
    setTimeout(() => {
      isEdit.value = false;
      currentId.value = null;
      resetFields();
      setProps({ title: '新增' });
    }, 50);
    openModal();
  }

  // 编辑
  function handleEdit(record: WithdrawSettingData) {
    isEdit.value = true;
    currentId.value = record.id;
    setProps({ title: '编辑' });
    setTimeout(() => {
      setFieldsValue({
        appName: record.appName,
        category: record.category,
        withdrawAmount: record.withdrawAmount,
        dailyLimit: record.dailyLimit,
        description: record.description,
        subsidyAmount: record.subsidyAmount,
        subsidyStartTime: record.subsidyStartTime,
        subsidyEndTime: record.subsidyEndTime,
        status: record.status,
      });
    }, 50);
    openModal();
  }

  // 弹窗确认
  const onModalOk = async () => {
    const formRes = await submit();
    if (formRes) {
      closeModal();
      window['$message'].success(isEdit.value ? '编辑成功' : '新增成功');
      reloadTable();
    } else {
      window['$message'].error('验证失败，请填写完整信息');
      setSubLoading(false);
    }
  };
</script>
