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
        canResize
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
      <basicModal @register="modalRegister" @on-ok="onModalOk" style="width: 50vw">
        <template #default>
          <BasicForm @register="formRegister" />
        </template>
      </basicModal>

      <!-- 广告位管理弹窗 -->
      <basicModal @register="adSlotModalRegister" @on-ok="onAdSlotModalOk" style="width: 50vw">
        <template #default>
          <BasicForm @register="adSlotFormRegister" />
        </template>
      </basicModal>
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { basicModal, useModal } from '@/components/Modal';
  import { columns, AdData } from './columns';
  import { getAdList } from '@/api/inquiry/adManage';
  import { PlusOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  const router = useRouter();

  const actionRef = ref();
  const isEdit = ref(false);
  const currentId = ref<number | null>(null);
  const currentRecord = ref<AdData | null>(null);

  // 搜索表单配置
  const schemas: FormSchema[] = [
    {
      field: 'gameName',
      component: 'NInput',
      label: '游戏名称',
      componentProps: {
        placeholder: '请输入游戏名称',
      },
    },
  ];

  // 新增/编辑表单配置
  const formSchemas: FormSchema[] = [
    {
      field: 'appId',
      component: 'NInput',
      label: 'AppID',
      rules: [{ required: true, message: '请输入AppID' }],
      componentProps: {
        placeholder: '请输入AppID',
      },
    },
    {
      field: 'gameName',
      component: 'NInput',
      label: '游戏名称',
      rules: [{ required: true, message: '请输入游戏名称' }],
      componentProps: {
        placeholder: '请输入游戏名称',
      },
    },
    {
      field: 'adPlatform',
      component: 'NSelect',
      label: '广告平台',
      rules: [{ required: true, message: '请选择广告平台' }],
      componentProps: {
        placeholder: '请选择广告平台',
        options: [
          { label: 'sigmob聚合', value: 1 },
          { label: '穿山甲', value: 2 },
        ],
      },
    },
    {
      field: 'status',
      component: 'NRadioGroup',
      label: '状态',
      defaultValue: 1,
      rules: [{ required: true, message: '请选择状态' }],
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
  ];

  // 广告位管理表单配置
  const adSlotFormSchemas: FormSchema[] = [
    {
      field: 'gameName',
      component: 'NInput',
      label: '游戏名称',
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'appId',
      component: 'NInput',
      label: 'AppID',
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'adPlatformName',
      component: 'NInput',
      label: '广告平台',
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'shortVideoAd',
      component: 'NInput',
      label: '短视频广告',
      componentProps: {
        placeholder: '请输入短视频广告ID',
      },
    },
    {
      field: 'rewardVideoAd',
      component: 'NInput',
      label: '激励视频广告',
      componentProps: {
        placeholder: '请输入激励视频广告ID',
      },
    },
    {
      field: 'rewardVideoAdKey',
      component: 'NInput',
      label: '激励视频广告Key',
      componentProps: {
        placeholder: '请输入激励视频广告Key',
      },
    },
    {
      field: 'bannerAd',
      component: 'NInput',
      label: 'Banner广告',
      componentProps: {
        placeholder: '请输入Banner广告ID',
      },
    },
    {
      field: 'infoFlowAd',
      component: 'NInput',
      label: '信息流广告',
      componentProps: {
        placeholder: '请输入信息流广告ID',
      },
    },
    {
      field: 'interstitialAd',
      component: 'NInput',
      label: '插屏广告',
      componentProps: {
        placeholder: '请输入插屏广告ID',
      },
    },
    {
      field: 'splashAd',
      component: 'NInput',
      label: '开屏广告',
      componentProps: {
        placeholder: '请输入开屏广告ID',
      },
    },
  ];

  // 操作列配置
  const actionColumn = reactive({
    width: 200,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: AdData) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
          },
          {
            label: '广告位管理',
            onClick: handleAdSlot.bind(null, record),
          },
          {
            label: '代码位管理',
            onClick: to.bind(null, record),
          },
        ],
      });
    },
  });
  function to(record: AdData) {
    router.push({ name: 'ad-code', params: { id: record.id } });
  }
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  const [formRegister, { submit, setFieldsValue, resetFields }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 120,
    layout: 'horizontal',
    showActionButtonGroup: false,
    schemas: formSchemas,
  });

  const [
    adSlotFormRegister,
    { submit: adSlotSubmit, setFieldsValue: setAdSlotFieldsValue, resetFields: resetAdSlotFields },
  ] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 120,
    layout: 'horizontal',
    showActionButtonGroup: false,
    schemas: adSlotFormSchemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '新增广告',
  });

  const [
    adSlotModalRegister,
    {
      openModal: openAdSlotModal,
      closeModal: closeAdSlotModal,
      setSubLoading: setAdSlotSubLoading,
    },
  ] = useModal({
    title: '广告位管理',
  });

  // 加载表格数据
  const loadDataTable = async (res: any) => {
    return await getAdList({ ...getFieldsValue(), ...res });
  };

  // 刷新表格
  function reloadTable() {
    actionRef.value.reload();
  }

  // 新增
  function handleAdd() {
    isEdit.value = false;
    currentId.value = null;
    resetFields();
    openModal();
  }

  // 编辑
  function handleEdit(record: AdData) {
    isEdit.value = true;
    currentId.value = record.id;
    setTimeout(() => {
      setFieldsValue({
        appId: record.appId,
        gameName: record.gameName,
        adPlatform: record.adPlatform,
        status: record.status,
      });
    }, 50);
    openModal();
  }

  // 广告位管理
  function handleAdSlot(record: AdData) {
    currentRecord.value = record;
    const adPlatformMap: Record<number, string> = {
      1: 'sigmob聚合',
      2: '穿山甲',
    };
    setTimeout(() => {
      setAdSlotFieldsValue({
        gameName: record.gameName,
        appId: record.appId,
        adPlatformName: adPlatformMap[record.adPlatform] || '-',
        shortVideoAd: record.shortVideoAd || '',
        rewardVideoAd: record.rewardVideoAd || '',
        rewardVideoAdKey: record.rewardVideoAdKey || '',
        bannerAd: record.bannerAd || '',
        infoFlowAd: record.infoFlowAd || '',
        interstitialAd: record.interstitialAd || '',
        splashAd: record.splashAd || '',
      });
    }, 50);
    openAdSlotModal();
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

  // 广告位管理弹窗确认
  const onAdSlotModalOk = async () => {
    const formRes = await adSlotSubmit();
    if (formRes) {
      closeAdSlotModal();
      window['$message'].success('保存成功');
      reloadTable();
    } else {
      window['$message'].error('验证失败，请填写完整信息');
      setAdSlotSubLoading(false);
    }
  };

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
