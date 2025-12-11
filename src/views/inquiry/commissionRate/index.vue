<template>
  <n-card :bordered="false" class="card">
    <div>V1初级团长</div>
    <div>
      享直推金币提现金额的
      <n-input-number :disabled="!isEdit" class="input-number" v-model:value="form.v1" clearable />%
    </div>
    <div>V2中级团长</div>
    <div>
      推广
      <n-input-number
        :disabled="!isEdit"
        class="input-number"
        v-model:value="form.v2"
        clearable
      />%人及团队提现成功
      <n-input-number
        :disabled="!isEdit"
        class="input-number"
        v-model:value="form.v3"
        clearable
      />元
    </div>
    <div>
      享直推金币提现金额的<n-input-number
        :disabled="!isEdit"
        class="input-number"
        v-model:value="form.v4"
        clearable
      />%
    </div>
    <div>
      享间推金币提现金额的<n-input-number
        :disabled="!isEdit"
        class="input-number"
        v-model:value="form.v5"
        clearable
      />%
    </div>
    <div>V3中级团长</div>
    <div>
      推广
      <n-input-number
        class="input-number"
        :disabled="!isEdit"
        v-model:value="form.v6"
        clearable
      />%人及团队提现成功
      <n-input-number
        class="input-number"
        :disabled="!isEdit"
        v-model:value="form.v7"
        clearable
      />元
    </div>
    <div>
      享直推金币提现金额的<n-input-number
        :disabled="!isEdit"
        class="input-number"
        v-model:value="form.v8"
        clearable
      />%
    </div>
    <div>
      享间推金币提现金额的<n-input-number
        :disabled="!isEdit"
        class="input-number"
        v-model:value="form.v9"
        clearable
      />%
    </div>
    <div>
      <n-button @click="isEdit = !isEdit"> {{ isEdit ? '保存' : '编辑' }}</n-button>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  defineOptions({
    name: 'inquiry_commission_rate',
  });
  const isEdit = ref(false);
  const form = ref({
    v1: 0,
    v2: 0,
    v3: 0,
    v4: 0,
    v5: 0,
    v6: 0,
    v7: 0,
    v8: 0,
    v9: 0,
  });
</script>
<style scoped lang="less">
  .input-number {
    display: inline-block;
    width: 120px;
  }
  .card {
    height: 40rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    div {
      margin-bottom: 10px;
    }
  }
</style>
