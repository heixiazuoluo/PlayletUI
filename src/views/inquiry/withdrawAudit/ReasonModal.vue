<template>
  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="title">
    <n-form :model="formData" :rules="rules" ref="formRef" label-placement="left" :label-width="60">
      <n-form-item label="昵称" path="nickname">
        <n-input disabled v-model:value="formData.nickname" placeholder="用户昵称" />
      </n-form-item>
      <n-form-item label="原因" path="reason">
        <n-input
          v-model:value="formData.reason"
          type="textarea"
          placeholder="请输入原因"
          :rows="4"
        />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" :loading="loading" @click="handleConfirm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { type FormRules } from 'naive-ui';

  const emit = defineEmits(['confirm']);

  const showModal = ref(false);
  const loading = ref(false);
  const title = ref('');
  const formRef = ref();

  const formData = reactive({
    nickname: '',
    reason: '',
  });

  const rules: FormRules = {
    reason: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入原因',
    },
  };

  function showModal2(data: { nickname: string; action: string }) {
    formData.nickname = data.nickname;
    formData.reason = '';
    title.value = `${data.action}原因`;
    showModal.value = true;
  }

  function handleCancel() {
    showModal.value = false;
  }

  function handleConfirm() {
    formRef.value.validate((errors) => {
      if (!errors) {
        loading.value = true;
        emit('confirm', formData.reason);
        setTimeout(() => {
          loading.value = false;
          showModal.value = false;
        }, 300);
      }
    });
  }

  defineExpose({
    showModal: showModal2,
  });
</script>
