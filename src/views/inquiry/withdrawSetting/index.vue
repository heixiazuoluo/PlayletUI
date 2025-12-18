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
  import { ref, reactive, h, onMounted } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { basicModal, useModal } from '@/components/Modal';
  import { columns, typeMap, WithdrawSettingData } from './columns';
  import {
    getWithdrawSettingList,
    createWithdrawSetting,
    updateWithdrawSetting,
  } from '@/api/inquiry/withdrawSetting';
  import { getCommonGames } from '@/api/common';
  import { PlusOutlined } from '@vicons/antd';

  defineOptions({
    name: 'inquiry_withdraw_setting',
  });

  const actionRef = ref();
  const isEdit = ref(false);
  const currentId = ref<number | null>(null);
  const gameOptions = ref<{ label: string; value: number }[]>([]);

  // 类别选项：0-玩家，1-团长，2-师傅
  const typeOptions = Object.entries(typeMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  // 搜索表单
  const schemas: FormSchema[] = [
    {
      field: 'apps',
      component: 'NSelect',
      label: '游戏',
      componentProps: {
        placeholder: '请选择游戏',
        options: gameOptions,
      },
    },
    {
      field: 'typeID',
      component: 'NSelect',
      label: '类别',
      defaultValue: 0,
      componentProps: {
        placeholder: '请选择',
        options: [...typeOptions],
      },
    },
  ];

  // 新增/编辑表单配置
  const formSchemas: FormSchema[] = [
    {
      field: 'gid',
      component: 'NSelect',
      label: '游戏',
      rules: [{ required: true, type: 'number', message: '请选择游戏', trigger: ['change'] }],
      componentProps: {
        placeholder: '请选择游戏',
        options: gameOptions,
      },
    },
    {
      field: 'typeID',
      component: 'NSelect',
      label: '类别',
      rules: [{ required: true, type: 'number', message: '请选择类别', trigger: ['change'] }],
      componentProps: {
        placeholder: '请选择类别',
        options: typeOptions,
      },
    },
    {
      field: 'label',
      component: 'NInput',
      label: '描述',
      rules: [{ required: true, message: '请输入描述', trigger: ['blur'] }],
      componentProps: {
        placeholder: '请输入描述',
      },
    },
    {
      field: 'value',
      component: 'NInputNumber',
      label: '提现金额',
      rules: [{ required: true, type: 'number', message: '请输入提现金额', trigger: ['blur'] }],
      componentProps: {
        placeholder: '请输入提现金额',
        min: 0,
        step: 0.1,
        style: { width: '100%' },
      },
    },
    {
      field: 'limit',
      component: 'NInputNumber',
      label: '每日提现次数',
      componentProps: {
        placeholder: '请输入每日提现次数',
        min: 0,
        style: { width: '100%' },
      },
    },
    {
      field: 'SubsidyAmount',
      component: 'NInputNumber',
      label: '补贴金额',
      componentProps: {
        placeholder: '请输入补贴金额',
        min: 0,
        style: { width: '100%' },
      },
    },
    {
      field: 'SubsidyStartTime',
      component: 'NDatePicker',
      label: '补贴开始时间',
      componentProps: {
        type: 'datetime',
        clearable: true,
        style: { width: '100%' },
      },
    },
    {
      field: 'SubsidyEndTime',
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

  const [register, { getFieldsValue, setFieldsValue: setSearchFieldsValue }] = useForm({
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
      apps: formValues.apps || '',
      typeID: formValues.typeID,
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
    currentId.value = record.Id;
    setProps({ title: '编辑' });
    setTimeout(() => {
      setFieldsValue({
        gid: record.gid,
        typeID: record.typeID,
        label: record.label,
        value: record.value,
        limit: record.limit,
        SubsidyAmount: record.SubsidyAmount,
        SubsidyStartTime: record.SubsidyStartTime,
        SubsidyEndTime: record.SubsidyEndTime,
        status: record.status,
      });
    }, 50);
    openModal();
  }

  // 弹窗确认
  const onModalOk = async () => {
    const formRes = await submit();
    if (formRes) {
      try {
        const params = {
          ...formRes,
          Id: isEdit.value ? currentId.value : 0,
        };
        if (isEdit.value) {
          await updateWithdrawSetting(params);
        } else {
          await createWithdrawSetting(params);
        }
        closeModal();
        window['$message'].success(isEdit.value ? '编辑成功' : '新增成功');
        reloadTable();
      } catch (error) {
        window['$message'].error(isEdit.value ? '编辑失败' : '新增失败');
        setSubLoading(false);
      }
    } else {
      window['$message'].error('验证失败，请填写完整信息');
      setSubLoading(false);
    }
  };

  // 获取游戏列表
  onMounted(async () => {
    try {
      const res = await getCommonGames();
      const list = res.Data || res;
      gameOptions.value = list.map((item) => ({
        label: item.name,
        value: item.Id,
      }));
      // 设置默认值为第一个游戏
      if (gameOptions.value.length > 0) {
        console.log(gameOptions.value[0].value);
        setSearchFieldsValue({ apps: gameOptions.value[0].value });
        setTimeout(() => {
          console.log(getFieldsValue());
          reloadTable();
        }, 50);
      }
    } catch (error) {
      console.error('获取游戏列表失败', error);
    }
  });
</script>
