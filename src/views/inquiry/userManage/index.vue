<template>
  <n-flex vertical>
    <n-card :bordered="false">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" />
    </n-card>
    <n-card :bordered="false">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.userId"
        ref="actionRef"
        :actionColumn="actionColumn"
        canResize
        :striped="true"
      />

      <!-- 修改团长信息弹窗 -->
      <n-modal
        v-model:show="showLeaderModal"
        :show-icon="false"
        preset="dialog"
        title="修改团长信息"
      >
        <n-form
          :model="leaderFormParams"
          ref="leaderFormRef"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <n-form-item label="团长ID" path="leaderId">
            <n-input-number
              placeholder="请输入新团长ID"
              v-model:value="leaderFormParams.leaderId"
              :show-button="false"
              style="width: 100%"
            />
          </n-form-item>
        </n-form>

        <template #action>
          <n-space>
            <n-button @click="() => (showLeaderModal = false)">取消</n-button>
            <n-button type="info" :loading="leaderFormLoading" @click="confirmLeaderForm">
              确定
            </n-button>
          </n-space>
        </template>
      </n-modal>
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getUserManageList } from '@/api/inquiry/userManage';
  import { columns, UserData } from './columns';

  const actionRef = ref();

  // 修改团长弹窗
  const showLeaderModal = ref(false);
  const leaderFormLoading = ref(false);
  const leaderFormRef = ref();
  const currentEditUser = ref<UserData | null>(null);
  const leaderFormParams = reactive({
    leaderId: null as number | null,
  });

  // 搜索表单配置
  const schemas: FormSchema[] = [
    {
      field: 'userId',
      component: 'NInputNumber',
      label: '用户ID',
      componentProps: {
        placeholder: '请输入用户ID',
        showButton: false,
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
      field: 'masterId',
      component: 'NInputNumber',
      label: '师父ID',
      componentProps: {
        placeholder: '请输入师父ID',
        showButton: false,
      },
    },
    {
      field: 'masterNickname',
      component: 'NInput',
      label: '师父昵称',
      componentProps: {
        placeholder: '请输入师父昵称',
      },
    },
    {
      field: 'leaderId',
      component: 'NInputNumber',
      label: '团长ID',
      componentProps: {
        placeholder: '请输入团长ID',
        showButton: false,
      },
    },
    {
      field: 'leaderNickname',
      component: 'NInput',
      label: '团长昵称',
      componentProps: {
        placeholder: '请输入团长昵称',
      },
    },
    {
      field: 'registerTime',
      component: 'NDatePicker',
      label: '注册时间',
      componentProps: {
        type: 'daterange',
        clearable: true,
        placeholder: '请选择注册时间范围',
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
      field: 'appName',
      component: 'NSelect',
      label: 'APP名称',
      componentProps: {
        placeholder: '请选择APP',
        options: [
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B' },
        ],
      },
    },
    {
      field: 'totalWithdraw',
      component: 'NInputNumber',
      label: '累计提现',
      componentProps: {
        placeholder: '请输入累计提现金额',
        showButton: false,
      },
    },
  ];

  // 操作列配置
  const actionColumn = reactive({
    width: 180,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record: UserData) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '加入黑名单',
            onClick: handleAddBlacklist.bind(null, record),
          },
          {
            label: '修改团长',
            onClick: handleEditLeader.bind(null, record),
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

  // 加载表格数据
  const loadDataTable = async (res: any) => {
    return await getUserManageList({ ...getFieldsValue(), ...res });
  };

  // 刷新表格
  function reloadTable() {
    actionRef.value.reload();
  }

  // 加入黑名单
  function handleAddBlacklist(record: UserData) {
    window['$dialog'].warning({
      title: '警告',
      content: `确定要将用户 "${record.nickname}" 加入黑名单吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        window['$message'].success('已加入黑名单');
        reloadTable();
      },
    });
  }

  // 修改团长信息
  function handleEditLeader(record: UserData) {
    currentEditUser.value = record;
    leaderFormParams.leaderId = record.leaderId;
    showLeaderModal.value = true;
  }

  // 确认修改团长
  function confirmLeaderForm() {
    leaderFormLoading.value = true;
    setTimeout(() => {
      window['$message'].success('修改成功');
      showLeaderModal.value = false;
      leaderFormLoading.value = false;
      reloadTable();
    }, 500);
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
