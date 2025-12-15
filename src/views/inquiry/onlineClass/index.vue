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
        :scroll-x="800"
        :striped="true"
        :checked-row-keys="checkedKeys"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <n-space>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><PlusOutlined /></n-icon>
              </template>
              新增
            </n-button>
            <n-button type="error" :disabled="!checkedKeys.length" @click="handleBatchDelete">
              <template #icon>
                <n-icon><DeleteOutlined /></n-icon>
              </template>
              批量删除
            </n-button>
          </n-space>
        </template>
      </BasicTable>
    </n-card>
  </n-flex>

  <!-- 新增/编辑弹窗 -->
  <n-modal
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    :title="modalTitle"
    style="width: 700px"
  >
    <n-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-placement="left"
      :label-width="100"
      class="py-4"
    >
      <n-form-item label="游戏名称" path="gameName">
        <n-select
          v-model:value="formData.gameName"
          :options="gameOptions"
          placeholder="请选择游戏"
        />
      </n-form-item>
      <n-form-item label="标题" path="title">
        <n-input v-model:value="formData.title" placeholder="请输入标题" />
      </n-form-item>
      <n-form-item label="分类" path="category">
        <n-select
          v-model:value="formData.category"
          :options="categoryOptions"
          placeholder="请选择分类"
        />
      </n-form-item>
      <n-form-item label="是否热门" path="isHot">
        <n-radio-group v-model:value="formData.isHot">
          <n-space>
            <n-radio :value="1">是</n-radio>
            <n-radio :value="0">否</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="封面图" path="coverImage">
        <n-upload
          :max="1"
          list-type="image-card"
          :default-file-list="coverFileList"
          @change="handleCoverChange"
        >
          点击上传
        </n-upload>
      </n-form-item>
      <n-form-item label="视频" path="videoUrl">
        <n-upload :max="1" @change="handleVideoChange">
          <n-button>上传视频</n-button>
        </n-upload>
        <span v-if="formData.videoUrl" class="ml-2">{{ formData.videoUrl }}</span>
      </n-form-item>
      <n-form-item label="图文内容" path="content">
        <div style="display: block">
          <QuillEditor
            ref="quillEditor"
            style="height: 250px; width: 100%"
            :options="editorOptions"
            v-model:content="formData.content"
          />
        </div>
      </n-form-item>
      <n-form-item label="阅读量" path="readCount">
        <n-input-number
          v-model:value="formData.readCount"
          placeholder="请输入阅读量"
          :min="0"
          style="width: 100%"
        />
      </n-form-item>
      <n-form-item label="状态" path="status">
        <n-radio-group v-model:value="formData.status">
          <n-space>
            <n-radio :value="1">启用</n-radio>
            <n-radio :value="0">禁用</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="showModal = false">取消</n-button>
        <n-button type="primary" :loading="submitLoading" @click="handleConfirm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, h, computed } from 'vue';
  import { useDialog, type FormRules, type UploadFileInfo } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns, categoryMap, OnlineClassData } from './columns';
  import { getOnlineClassList, deleteOnlineClass } from '@/api/inquiry/onlineClass';
  import { PlusOutlined, DeleteOutlined } from '@vicons/antd';
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  defineOptions({
    name: 'inquiry_online_class',
  });

  const actionRef = ref();
  const formRef = ref();
  const quillEditor = ref();
  const dialog = useDialog();
  const showModal = ref(false);
  const submitLoading = ref(false);
  const currentId = ref<number | null>(null);
  const checkedKeys = ref<number[]>([]);
  const coverFileList = ref<UploadFileInfo[]>([]);

  const modalTitle = computed(() => (currentId.value ? '编辑' : '新增'));

  // 游戏选项
  const gameOptions = [
    { label: '消消乐', value: '消消乐' },
    { label: '斗地主', value: '斗地主' },
    { label: '跑酷大作战', value: '跑酷大作战' },
  ];

  // 分类选项
  const categoryOptions = Object.entries(categoryMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

  // 状态选项
  const statusOptions = [
    { label: '全部', value: -1 },
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
  ];

  // 富文本配置
  const editorOptions = {
    placeholder: '请输入图文内容...',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['link', 'image'],
        ['clean'],
      ],
    },
  };

  // 搜索表单
  const schemas: FormSchema[] = [
    {
      field: 'gameName',
      component: 'NSelect',
      label: '游戏名称',
      componentProps: {
        placeholder: '请选择游戏',
        options: gameOptions,
      },
    },
    {
      field: 'title',
      component: 'NInput',
      label: '文章标题',
      componentProps: {
        placeholder: '请输入文章标题',
      },
    },
    {
      field: 'category',
      component: 'NSelect',
      label: '分类',
      componentProps: {
        placeholder: '请选择',
        options: [{ label: '全部', value: -1 }, ...categoryOptions],
      },
    },
    {
      field: 'status',
      component: 'NSelect',
      label: '状态',
      componentProps: {
        placeholder: '请选择',
        options: statusOptions,
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
    width: 120,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record: OnlineClassData) {
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

  // 表单数据
  const FORM_DEFAULT = {
    gameName: '',
    title: '',
    category: '',
    isHot: '',
    coverImage: '',
    videoUrl: '',
    content: '',
    readCount: 0,
    status: 1,
  };

  const formData = reactive({ ...FORM_DEFAULT });

  const rules: FormRules = {
    gameName: { required: true, message: '请选择游戏名称', trigger: ['change'] },
    title: { required: true, message: '请输入标题', trigger: ['blur'] },
    category: { required: true, type: 'number', message: '请选择分类', trigger: ['change'] },
  };

  // 选中行
  function onCheckedRow(keys: number[]) {
    checkedKeys.value = keys;
  }

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
    return await getOnlineClassList(params);
  };

  function reloadTable() {
    actionRef.value.reload();
  }

  // 封面图上传
  function handleCoverChange({ fileList }: { fileList: UploadFileInfo[] }) {
    coverFileList.value = fileList;
    if (fileList.length > 0 && fileList[0].url) {
      formData.coverImage = fileList[0].url;
    } else {
      formData.coverImage = '';
    }
  }

  // 视频上传
  function handleVideoChange({ fileList }: { fileList: UploadFileInfo[] }) {
    if (fileList.length > 0 && fileList[0].name) {
      formData.videoUrl = fileList[0].name;
    } else {
      formData.videoUrl = '';
    }
  }

  // 新增
  function handleAdd() {
    currentId.value = null;
    Object.assign(formData, FORM_DEFAULT);
    coverFileList.value = [];
    showModal.value = true;
  }

  // 编辑
  function handleEdit(record: OnlineClassData) {
    currentId.value = record.id;
    Object.assign(formData, {
      gameName: record.gameName,
      title: record.title,
      category: record.category,
      isHot: record.isHot,
      coverImage: record.coverImage,
      videoUrl: record.videoUrl,
      content: record.content,
      readCount: record.readCount,
      status: record.status,
    });
    setTimeout(() => {
      const html = record.content;
      quillEditor.value.setHTML(html);
    }, 20);
    coverFileList.value = record.coverImage
      ? [{ id: '1', name: 'cover', status: 'finished', url: record.coverImage }]
      : [];
    showModal.value = true;
  }

  // 批量删除
  function handleBatchDelete() {
    dialog.warning({
      title: '确认',
      content: `确定要删除选中的 ${checkedKeys.value.length} 条记录吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await deleteOnlineClass({ ids: checkedKeys.value });
          window['$message'].success('删除成功');
          checkedKeys.value = [];
          reloadTable();
        } catch (error) {
          window['$message'].error('删除失败');
        }
      },
    });
  }

  // 确认提交
  async function handleConfirm() {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        submitLoading.value = true;
        try {
          window['$message'].success(currentId.value ? '编辑成功' : '新增成功');
          showModal.value = false;
          reloadTable();
        } catch (error) {
          window['$message'].error('操作失败');
        } finally {
          submitLoading.value = false;
        }
      }
    });
  }
</script>

<style scoped>
  :deep(.ql-container) {
    height: 200px;
  }
</style>
