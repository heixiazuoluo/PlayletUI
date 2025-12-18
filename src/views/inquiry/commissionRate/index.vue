<template>
  <n-card :bordered="false" class="card">
    <n-spin :show="loading">
      <div class="form-content">
        <div class="section-title">V1初级团长</div>
        <div>
          享直推金币提现金额的
          <n-input-number
            :disabled="!isEdit"
            class="input-number"
            v-model:value="form.v1ZhiTui"
            :precision="0"
          />%
        </div>

        <div class="section-title">V2中级团长</div>
        <div>
          推广
          <n-input-number
            :disabled="!isEdit"
            class="input-number"
            v-model:value="form.v2PersonCount"
            :precision="0"
          />人及团队提现成功
          <n-input-number
            :disabled="!isEdit"
            class="input-number"
            v-model:value="form.v2PersonMoneys"
            :precision="2"
          />元
        </div>
        <div>
          享直推金币提现金额的
          <n-input-number
            :disabled="!isEdit"
            class="input-number"
            v-model:value="form.v2ZhiTui"
            :precision="0"
          />%
        </div>
        <div>
          享间推金币提现金额的
          <n-input-number
            :disabled="!isEdit"
            class="input-number"
            v-model:value="form.v2JianTui"
            :precision="0"
          />%
        </div>

        <div class="section-title">V3高级团长</div>
        <div>
          推广
          <n-input-number
            :disabled="!isEdit"
            class="input-number"
            v-model:value="form.v3PersonCount"
            :precision="0"
          />人及团队提现成功
          <n-input-number
            :disabled="!isEdit"
            class="input-number"
            v-model:value="form.v3PersonMoneys"
            :precision="2"
          />元
        </div>
        <div>
          享直推金币提现金额的
          <n-input-number
            :disabled="!isEdit"
            class="input-number"
            v-model:value="form.v3ZhiTui"
            :precision="0"
          />%
        </div>
        <div>
          享间推金币提现金额的
          <n-input-number
            :disabled="!isEdit"
            class="input-number"
            v-model:value="form.v3JianTui"
            :precision="0"
          />%
        </div>

        <div class="btn-wrap">
          <n-button v-if="!isEdit" type="primary" @click="handleEdit">编辑</n-button>
          <template v-else>
            <n-button @click="handleCancel">取消</n-button>
            <n-button type="primary" :loading="submitLoading" @click="handleSave">保存</n-button>
          </template>
        </div>
      </div>
    </n-spin>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import {
    getCommissionRateDetail,
    updateCommissionRate,
    type CommissionRateData,
  } from '@/api/inquiry/commissionRate';

  defineOptions({
    name: 'inquiry_commission_rate',
  });

  const loading = ref(false);
  const submitLoading = ref(false);
  const isEdit = ref(false);

  const defaultForm: CommissionRateData = {
    Id: 0,
    v1ZhiTui: 0,
    v2ZhiTui: 0,
    v2JianTui: 0,
    v3ZhiTui: 0,
    v3JianTui: 0,
    v2PersonCount: 0,
    v2PersonMoneys: 0,
    v2v1V: 0,
    v2v2V: 0,
    v2v2TDV: 0,
    v2v2TDsV: 0,
    v3PersonCount: 0,
    v3PersonMoneys: 0,
    v3v1V: 0,
    v3v2TDV: 0,
    v3v2TDsV: 0,
    v3v3V: 0,
    v3v3TDV: 0,
    v3v3TDsV: 0,
  };

  const form = ref<CommissionRateData>({ ...defaultForm });
  const originalForm = ref<CommissionRateData>({ ...defaultForm });

  // 获取数据
  async function fetchData() {
    loading.value = true;
    try {
      const res = await getCommissionRateDetail();
      const data = res.Data || res;
      form.value = { ...defaultForm, ...data };
      originalForm.value = { ...form.value };
    } catch (error) {
      console.error('获取佣金比例设置失败', error);
    } finally {
      loading.value = false;
    }
  }

  // 编辑
  function handleEdit() {
    isEdit.value = true;
  }

  // 取消
  function handleCancel() {
    form.value = { ...originalForm.value };
    isEdit.value = false;
  }

  // 保存
  async function handleSave() {
    submitLoading.value = true;
    try {
      await updateCommissionRate(form.value);
      window['$message'].success('保存成功');
      originalForm.value = { ...form.value };
      isEdit.value = false;
    } catch (error) {
      window['$message'].error('保存失败');
    } finally {
      submitLoading.value = false;
    }
  }

  onMounted(() => {
    fetchData();
  });
</script>

<style scoped lang="less">
  .input-number {
    display: inline-block;
    width: 120px;
    margin: 0 4px;
  }
  .card {
    min-height: 40rem;
  }
  .form-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    > div {
      margin-bottom: 16px;
    }
  }
  .section-title {
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
  }
  .btn-wrap {
    margin-top: 30px;
    display: flex;
    gap: 12px;
  }
</style>
