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
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { basicModal, useModal } from '@/components/Modal';
  import { columns, ProductData } from './columns';
  import { getProductList, addProduct, updateProduct } from '@/api/dataManage/productRecommend';
  import { PlusOutlined } from '@vicons/antd';

  const actionRef = ref();
  const isEdit = ref(false);
  const currentId = ref<number | null>(null);

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
    {
      field: 'status',
      component: 'NSelect',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
  ];

  // 弹窗表单配置
  const formSchemas: FormSchema[] = [
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
      field: 'packageName',
      component: 'NInput',
      label: '包名',
      rules: [{ required: true, message: '请输入包名' }],
      componentProps: {
        placeholder: '请输入包名',
      },
    },
    {
      field: 'downloadUrl',
      component: 'NInput',
      label: '下载地址',
      rules: [{ required: true, message: '请输入下载地址' }],
      componentProps: {
        placeholder: '请输入下载链接',
      },
    },
    {
      field: 'icon',
      component: 'NUpload',
      label: 'Icon图',
      rules: [{ required: true, message: '请上传Icon图' }],
      componentProps: {
        max: 1,
        listType: 'image-card',
        accept: 'image/*',
      },
    },
    {
      field: 'uploadType',
      component: 'NSelect',
      label: '打包上传方式',
      defaultValue: 1,
      // rules: [{ required: true, message: '请选择打包上传方式' }],
      componentProps: {
        disabled: true,
        options: [
          { label: '阿里云OSS', value: 1, disabled: true },
          { label: '备用', value: 2, disabled: true },
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

  // 操作列配置
  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: ProductData) {
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

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
  });

  const [formRegister, { submit, setFieldsValue, resetFields }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 100,
    layout: 'horizontal',
    showActionButtonGroup: false,
    schemas: formSchemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '新增产品',
  });

  // 加载表格数据
  const loadDataTable = async (res: any) => {
    return await getProductList({ ...getFieldsValue(), ...res });
  };

  // 刷新表格
  function reloadTable() {
    actionRef.value.reload();
  }

  // 新增
  function handleAdd() {
    isEdit.value = false;
    currentId.value = null;
    setTimeout(() => {
      resetFields();
    }, 20);
    openModal();
  }

  // 编辑
  function handleEdit(record: ProductData) {
    isEdit.value = true;
    currentId.value = record.id;
    setTimeout(() => {
      setFieldsValue({
        gameName: record.gameName,
        packageName: record.packageName,
        downloadUrl: record.downloadUrl,
        icon: record.icon,
        uploadType: record.uploadType,
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
        if (isEdit.value) {
          await updateProduct({ id: currentId.value, ...formRes });
        } else {
          await addProduct(formRes);
        }
        closeModal();
        window['$message'].success(isEdit.value ? '编辑成功' : '新增成功');
        reloadTable();
      } catch (e) {
        setSubLoading(false);
      }
    } else {
      window['$message'].error('验证失败，请填写完整信息');
      setSubLoading(false);
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
