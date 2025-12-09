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
          <n-space>
            <n-button type="info" @click="handleImport">
              <template #icon>
                <n-icon><CloudUploadOutlined /></n-icon>
              </template>
              导入
            </n-button>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><PlusOutlined /></n-icon>
              </template>
              新增
            </n-button>
          </n-space>
        </template>
      </BasicTable>

      <!-- 导入弹窗 -->
      <basicModal @register="importModalRegister" @on-ok="onImportOk" style="width: 500px">
        <template #default>
          <n-form
            :rules="importFormRules"
            :model="importFormData"
            ref="importFormRef"
            label-placement="left"
            :label-width="120"
            class="py-4"
          >
            <n-form-item label="下载模板">
              <n-button text type="primary" @click="downloadTemplate">
                <template #icon>
                  <n-icon><DownloadOutlined /></n-icon>
                </template>
                点击下载导入模板
              </n-button>
            </n-form-item>
            <n-form-item label="上传文件" path="file">
              <n-upload
                :max="1"
                accept=".xlsx,.xls"
                :default-upload="false"
                @change="handleUploadChange"
                v-model:file-list="importFormData.fileList"
              >
                <n-button>选择文件</n-button>
              </n-upload>
            </n-form-item>
            <n-form-item label="更新已存在数据" path="updateExist">
              <n-radio-group v-model:value="importFormData.updateExist">
                <n-space>
                  <n-radio :value="1">是</n-radio>
                  <n-radio :value="0">否</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </n-form>
        </template>
      </basicModal>

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
  import { columns, AdCodeData } from './columns';
  import { getAdCodeList, addAdCode, updateAdCode, deleteAdCode } from '@/api/inquiry/adCodeManage';
  import { PlusOutlined, CloudUploadOutlined, DownloadOutlined } from '@vicons/antd';
  import type { UploadFileInfo } from 'naive-ui';

  const importFormRules = {
    file: [{ required: true, message: '请选择要上传的文件' }],
  };
  const actionRef = ref();
  const isEdit = ref(false);
  const currentId = ref<number | null>(null);
  const importFormRef = ref();

  // 导入表单数据
  const importFormData = reactive({
    fileList: [] as UploadFileInfo[],
    updateExist: 0,
  });

  // 搜索表单配置
  const schemas: FormSchema[] = [
    {
      field: 'codeSlot',
      component: 'NInput',
      label: '代码位',
      componentProps: {
        placeholder: '请输入代码位',
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
    {
      field: 'priceType',
      component: 'NSelect',
      label: '广告价格类型',
      componentProps: {
        placeholder: '请选择价格类型',
        options: [
          { label: '竞价', value: 1 },
          { label: '固价', value: 2 },
        ],
      },
    },
  ];

  // 新增/编辑表单配置
  const formSchemas: FormSchema[] = [
    {
      field: 'adNetwork',
      component: 'NRadioGroup',
      label: '广告网络',
      rules: [{ required: true, message: '请选择广告网络' }],
      componentProps: {
        options: [
          { label: '百度联盟', value: 1 },
          { label: '穿山甲', value: 2 },
          { label: '腾讯广告', value: 3 },
          { label: 'sigmob', value: 4 },
          { label: '快手', value: 5 },
        ],
      },
    },
    {
      field: 'adType',
      component: 'NRadioGroup',
      label: '广告类型',
      rules: [{ required: true, message: '请选择广告类型' }],
      componentProps: {
        options: [
          { label: '短视频', value: 1 },
          { label: '激励视频', value: 2 },
          { label: 'Banner', value: 3 },
          { label: '信息流', value: 4 },
          { label: '插屏', value: 5 },
          { label: '开屏', value: 6 },
        ],
      },
    },
    {
      field: 'codeSlot',
      component: 'NInput',
      label: '代码位',
      rules: [{ required: true, message: '请输入代码位' }],
      componentProps: {
        placeholder: '请输入代码位',
      },
    },
    {
      field: 'priceType',
      component: 'NRadioGroup',
      label: '广告价格类型',
      rules: [{ required: true, message: '请选择广告价格类型' }],
      componentProps: {
        options: [
          { label: '竞价', value: 1 },
          { label: '固价', value: 2 },
        ],
      },
    },
    {
      field: 'price',
      component: 'NInputNumber',
      label: '广告价格',
      rules: [{ required: true, type: 'number', message: '请输入广告价格' }],
      componentProps: {
        placeholder: '请输入广告价格',
        min: 0,
        precision: 2,
        showButton: false,
        style: { width: '100%' },
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
    render(record: AdCodeData) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
          },
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
          },
        ],
      });
    },
  });

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:5' },
    labelWidth: 100,
    schemas,
  });

  const [formRegister, { submit, setFieldsValue, resetFields }] = useForm({
    gridProps: { cols: 1 },
    labelWidth: 120,
    layout: 'horizontal',
    showActionButtonGroup: false,
    schemas: formSchemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '新增广告代码位',
  });

  const [
    importModalRegister,
    {
      openModal: openImportModal,
      closeModal: closeImportModal,
      setSubLoading: setImportSubLoading,
    },
  ] = useModal({
    title: '导入广告代码位',
  });

  // 加载表格数据
  const loadDataTable = async (res: any) => {
    return await getAdCodeList({ ...getFieldsValue(), ...res });
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
    }, 50);
    openModal();
  }

  // 编辑
  function handleEdit(record: AdCodeData) {
    isEdit.value = true;
    currentId.value = record.id;
    setTimeout(() => {
      setFieldsValue({
        adNetwork: record.adNetwork,
        adType: record.adType,
        codeSlot: record.codeSlot,
        priceType: record.priceType,
        price: record.price,
        status: record.status,
      });
    }, 50);
    openModal();
  }

  // 删除
  function handleDelete(record: AdCodeData) {
    window['$dialog'].warning({
      title: '警告',
      content: `确定要删除代码位 "${record.codeSlot}" 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteAdCode({ id: record.id });
        window['$message'].success('删除成功');
        reloadTable();
      },
    });
  }

  // 弹窗确认
  const onModalOk = async () => {
    const formRes = await submit();
    if (formRes) {
      try {
        if (isEdit.value) {
          await updateAdCode({ id: currentId.value, ...formRes });
        } else {
          await addAdCode(formRes);
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

  // 导入
  function handleImport() {
    importFormData.fileList = [];
    importFormData.updateExist = 0;
    openImportModal();
  }

  // 文件上传变化
  function handleUploadChange(options: { fileList: UploadFileInfo[] }) {
    importFormData.fileList = options.fileList;
    console.log(importFormData.fileList);
  }

  // 下载模板
  function downloadTemplate() {
    const link = document.createElement('a');
    link.href = new URL('./model.xlsx', import.meta.url).href;
    link.download = 'model.xlsx';
    link.click();
  }

  // 导入确认
  const onImportOk = async () => {
    if (importFormData.fileList.length === 0) {
      window['$message'].error('请选择要导入的文件');
      setImportSubLoading(false);
      return;
    }
    try {
      // TODO: 调用导入接口
      const formData = new FormData();
      formData.append('file', importFormData.fileList[0].file as File);
      formData.append('updateExist', String(importFormData.updateExist));
      // await importAdCode(formData);
      closeImportModal();
      window['$message'].success('导入成功');
      reloadTable();
    } catch (e) {
      setImportSubLoading(false);
    }
  };
</script>

<style lang="less" scoped></style>
