<template>
  <basicModal @register="modalRegister" ref="modalRef" @on-ok="okModal">
    <div class="pt-8">
      <BasicForm @register="registerForm" />
    </div>
  </basicModal>
</template>

<script lang="ts" setup>
  import { ref, nextTick, computed } from 'vue';
  import { FormSchema, useForm } from '@/components/Form';
  import { basicModal, useModal } from '@/components/Modal';
  import { updateRole } from '@/api/system/role';

  const emit = defineEmits(['success']);
  const currentId = ref<number>(0);

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
      componentProps: {
        placeholder: '请输入显示顺序',
        min: 0,
      },
    },
    {
      field: 'RoleStatus',
      component: 'NRadioGroup',
      label: '状态',
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

  const [registerForm, { submit, setFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 80,
    layout: 'horizontal',
    submitButtonText: '保存',
    showActionButtonGroup: false,
    schemas,
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '编辑角色',
    subBtuText: '保存',
  });

  async function showModal(record: any) {
    currentId.value = record.Id;
    // 设置已选中的菜单
    checkedKeys.value = record.MenuIds || [];
    openModal();
    nextTick(() => {
      setFieldsValue({
        RoleName: record.RoleName,
        RoleSort: record.RoleSort,
        RoleStatus: record.RoleStatus,
        Remark: record.Remark,
      });
    });
  }

  async function okModal() {
    const formRes = await submit();
    if (formRes) {
      try {
        await updateRole({
          Id: currentId.value,
          ...formRes,
        });
        window['$message'].success('修改成功');
        closeModal();
        emit('success');
      } catch (error) {
        window['$message'].error('修改失败');
        setSubLoading(false);
      }
    } else {
      setSubLoading(false);
    }
  }

  defineExpose({
    showModal,
  });
</script>
