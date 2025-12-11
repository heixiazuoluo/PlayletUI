<template>
  <n-modal
    v-model:show="showModal"
    :show-icon="false"
    preset="card"
    title="详情"
    style="width: 900px"
  >
    <n-flex vertical :size="16">
      <!-- 时间搜索 -->
      <n-form inline>
        <n-form-item label="提现时间">
          <n-date-picker
            v-model:value="dateRange"
            type="daterange"
            clearable
            @update:value="handleSearch"
          />
        </n-form-item>
      </n-form>

      <!-- 审核列表 -->
      <n-data-table
        :columns="auditRecordColumns"
        :data="tableData"
        :loading="loading"
        :row-key="(row) => row.id"
        :checked-row-keys="checkedKeys"
        @update:checked-row-keys="handleCheck"
        :max-height="400"
      />

      <!-- 操作按钮 -->
      <n-space justify="center">
        <n-button type="success" @click="handlePass"> 通过 </n-button>
        <n-button type="error" @click="handleReject"> 拒绝 </n-button>
        <n-button type="warning" @click="handleBlacklist"> 拉黑 </n-button>
        <n-button type="info" @click="handleMark"> 标记 </n-button>
        <n-button @click="handleCancel">取消</n-button>
      </n-space>
    </n-flex>
  </n-modal>

  <!-- 原因输入弹窗 -->
  <ReasonModal ref="reasonModalRef" @confirm="handleReasonConfirm" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useDialog, useMessage } from 'naive-ui';
  import { auditRecordColumns, AuditRecordData } from './columns';
  import { getAuditRecordList, auditWithdraw } from '@/api/inquiry/withdrawAudit';
  import { formatDate } from '@/utils/dateUtil';
  import ReasonModal from './ReasonModal.vue';

  const emit = defineEmits(['success']);

  const dialog = useDialog();
  const message = useMessage();

  const showModal = ref(false);
  const loading = ref(false);
  const tableData = ref<AuditRecordData[]>([]);
  const checkedKeys = ref<number[]>([]);
  const dateRange = ref<[number, number] | null>(null);
  const currentRecord = ref<any>(null);
  const currentAction = ref<string>('');
  const reasonModalRef = ref();

  // 显示弹窗
  function showModal2(record: any) {
    currentRecord.value = record;
    showModal.value = true;
    checkedKeys.value = [];
    loadData();
  }

  // 加载数据
  async function loadData() {
    loading.value = true;
    try {
      let start = '';
      let end = '';
      if (dateRange.value && dateRange.value.length === 2) {
        start = formatDate(dateRange.value[0]);
        end = formatDate(dateRange.value[1]);
      }
      const res = await getAuditRecordList({
        userId: currentRecord.value?.userId,
        start,
        end,
      });
      tableData.value = res?.Data || [];
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  // 搜索
  function handleSearch() {
    loadData();
  }

  // 选中行
  function handleCheck(keys: number[]) {
    checkedKeys.value = keys;
  }

  // 通过 - 需要确认
  function handlePass() {
    dialog.warning({
      title: '确认',
      content: `确定通过选中的记录吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await submitAudit('pass', '');
      },
    });
  }

  // 拒绝
  function handleReject() {
    currentAction.value = 'reject';
    reasonModalRef.value.showModal({
      nickname: currentRecord.value.nickname || '',
      action: '拒绝',
    });
  }

  // 拉黑
  function handleBlacklist() {
    currentAction.value = 'blacklist';
    reasonModalRef.value.showModal({
      nickname: currentRecord.value.nickname || '',
      action: '拉黑',
    });
  }

  // 标记
  function handleMark() {
    currentAction.value = 'mark';
    reasonModalRef.value.showModal({
      nickname: currentRecord.value.nickname || '',
      action: '标记',
    });
  }

  // 取消
  function handleCancel() {
    showModal.value = false;
  }

  // 原因确认回调
  async function handleReasonConfirm(reason: string) {
    await submitAudit(currentAction.value, reason);
  }

  // 提交审核
  async function submitAudit(action: string, reason: string) {
    try {
      await auditWithdraw({
        ids: checkedKeys.value,
        action,
        reason,
      });
      message.success('操作成功');
      checkedKeys.value = [];
      loadData();
      showModal.value = false;
      emit('success');
    } catch (error) {
      message.error('操作失败');
    }
  }

  defineExpose({
    showModal: showModal2,
  });
</script>
