<template>
  <basicModal @register="modalRegister" ref="modalRef" @on-ok="okModal">
    <div class="pt-8">
      <BasicForm @register="registerForm" />
    </div>
  </basicModal>
</template>

<script lang="ts" setup>
  import { FormSchema, useForm } from '@/components/Form';
  import { basicModal, useModal } from '@/components/Modal';
  import { createRole } from '@/api/system/role';

  const emit = defineEmits(['success']);

  const schemas: FormSchema[] = [
    {
      field: 'RoleName',
      component: 'NInput',
      label: '角色名称',
      componentProps: {
        placeholder: '请输入角色名称',
      },
      rules: [{ required: true, message: '请输入角色名称', trigger: ['blur'] }],
    },
    {
      field: 'RoleSort',
      component: 'NInputNumber',
      label: '显示顺序',
      defaultValue: 0,
      componentProps: {
        placeholder: '请输入显示顺序',
        min: 0,
      },
    },
    {
      field: 'RoleStatus',
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
      field: 'Remark',
      component: 'NInput',
      label: '备注',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入备注',
      },
    },
  ];

  const [registerForm, { submit, resetFields }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '保存',
    showActionButtonGroup: false,
    schemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '新增角色',
    subBtuText: '保存',
  });

  function showModal() {
    setTimeout(() => {
      resetFields();
    }, 50);
    openModal();
  }

  async function okModal() {
    const formRes = await submit();
    if (formRes) {
      try {
        await createRole(formRes);
        window['$message'].success('新增成功');
        closeModal();
        emit('success');
      } catch (error) {
        window['$message'].error('新增失败');
        setSubLoading(false);
      }
    } else {
      setSubLoading(false);
    }
  }

  defineExpose({
    openModal: showModal,
  });
</script>
