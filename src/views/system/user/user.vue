<template>
  <n-flex vertical>
    <n-card :bordered="false">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" />
    </n-card>
    <n-card :bordered="false">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row:ListData) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090"
        :striped="true"
      >
        <template #tableTitle>
          <n-button type="primary" @click="addTable">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button>
          <n-button type="error" v-debounce="deleteListUser" :disabled="!isDelet" class="ml-2">
            <template #icon>
              <n-icon>
                <DeleteFilled />
              </n-icon>
            </template>
            删除
          </n-button>
        </template>
      </BasicTable>
      <n-modal
        v-model:show="showModal"
        :show-icon="false"
        preset="dialog"
        :title="fromData.id ? '编辑' : '新建'"
      >
        <n-form
          :model="fromData"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="80"
          class="py-4"
          show-require-mark
        >
          <n-form-item label="登录名" path="name">
            <n-input placeholder="请输入名称" v-model:value="fromData.name" />
          </n-form-item>
          <n-form-item label="密码" path="pwd">
            <n-input
              :disabled="!!fromData.id"
              type="password"
              placeholder="请输入密码"
              v-model:value="fromData.pwd"
            />
          </n-form-item>
          <n-form-item :show-require-mark="false" label="姓名" path="userName">
            <n-input placeholder="请输入姓名" v-model:value="fromData.userName" />
          </n-form-item>
          <n-form-item :show-require-mark="false" label="手机" path="mobile">
            <n-input placeholder="请输入手机" v-model:value="fromData.mobile" />
          </n-form-item>
          <n-form-item :show-require-mark="false" label="状态" path="status">
            <n-radio-group v-model:value="fromData.status" name="radiogroup">
              <n-space>
                <n-radio v-for="song in songs" :key="song.value" :value="song.value">
                  {{ song.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item :show-require-mark="false" label="角色" path="role">
            <n-checkbox-group v-model:value="fromData.role">
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="item in roleLIst"
                  :key="item.id"
                  :value="item.id"
                  :label="item.label"
                />
              </n-space>
            </n-checkbox-group>
          </n-form-item>
          <n-form-item :show-require-mark="false" label="游戏" path="games">
            <n-checkbox-group v-model:value="fromData.games">
              <n-space item-style="display: flex;">
                <n-checkbox
                  v-for="item in gameLIst"
                  :key="item.id"
                  :value="item.id"
                  :label="item.label"
                />
              </n-space>
            </n-checkbox-group>
          </n-form-item>
          <n-form-item :show-require-mark="false" label="备注" path="remark">
            <n-input v-model:value="fromData.remark" type="textarea" placeholder="请输入备注" />
          </n-form-item>
        </n-form>

        <template #action>
          <n-space>
            <n-button @click="() => (showModal = false)">取消</n-button>
            <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
          </n-space>
        </template>
      </n-modal>

      <n-modal v-model:show="pwdShowModal" :show-icon="false" preset="dialog" title="重置密码">
        <n-form
          :model="fromData"
          :rules="rulesPwd"
          ref="formRefPwd"
          label-placement="left"
          :label-width="80"
          class="py-4"
          show-require-mark
        >
          <n-form-item label="登录名" path="name">
            <n-input disabled placeholder="请输入名称" v-model:value="fromData.name" />
          </n-form-item>
          <n-form-item label="密码" path="pwd">
            <n-input type="password" placeholder="请输入密码" v-model:value="fromData.pwd" />
          </n-form-item>
        </n-form>
        <template #action>
          <n-space>
            <n-button @click="() => (pwdShowModal = false)">取消</n-button>
            <n-button type="info" :loading="formBtnLoading" @click="confirmFormPwd">确定</n-button>
          </n-space>
        </template>
      </n-modal>
    </n-card>
  </n-flex>
</template>
<script lang="ts" setup>
  import { computed, h, nextTick, reactive, ref } from 'vue';
  import { PlusOutlined, DeleteFilled } from '@vicons/antd';

  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns, ListData } from './colums';
  import { getUserList } from '@/api/table/list';
  import { type FormRules } from 'naive-ui';

  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'NInput',
      label: '登录名称',
      componentProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      field: 'mobile',
      component: 'NInputNumber',
      label: '手机号码',
      componentProps: {
        placeholder: '请输入手机号码',
        showButton: false,
      },
    },
    {
      field: 'type',
      component: 'NSelect',
      label: '用户状态',
      componentProps: {
        placeholder: '请选择',
        options: [
          {
            label: '全部',
            value: 1,
          },
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 2,
          },
        ],
      },
    },
    {
      field: 'makeDate',
      component: 'NDatePicker',
      label: '预约时间',
      defaultValue: [0, Date.now()],
      componentProps: {
        type: 'daterange',
        clearable: true,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
  ];
  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:5 2xl:5' },
    labelWidth: 80,
    schemas,
    size: 'small',
  });

  // 操作栏
  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            // auth: ['basic_list'],
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            // auth: ['basic_list'],
          },
          {
            label: '重置密码',
            onClick: handleResetTab.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            auth: ['system_user_reset'],
          },
        ],
      });
    },
  });

  // 搜索
  const handleSubmit = (val) => {
    console.log('搜索', val);
  };
  // 重置
  const handleReset = () => {
    console.log('重置');
  };

  // 获取列表数据
  const loadDataTable = async (res) => {
    // console.log(getFieldsValue(), res);
    return await getUserList({ ...getFieldsValue(), ...res });
  };

  function handleDelete(record: Recordable) {
    window['$message'].info('删除');
  }
  function handleEdit(record: Recordable) {
    nextTick(() => {
      fromData.value = record as ListData;
      showModal.value = true;
    });
  }
  function handleResetTab(record: Recordable) {
    console.log('点击了重置', record);
    nextTick(() => {
      fromData.value = record as ListData;
      pwdShowModal.value = true;
    });
  }

  const selectArr = ref([]);
  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
    selectArr.value = rowKeys;
  }
  const isDelet = computed(() => {
    return !!selectArr.value.length;
  });

  const actionRef = ref();
  function reloadTable() {
    actionRef.value.reload();
  }
  // 新增编辑===================
  const songs = [
    {
      value: 0,
      label: '禁用',
    },
    {
      value: 1,
      label: '启用',
    },
  ];
  const FROMDATA = {
    name: '',
    id: 0,
    status: 0,
    createDate: '',
  };
  // 角色列表
  const roleLIst = [
    {
      id: 1,
      label: '超级管理员',
    },
    {
      id: 2,
      label: '管理员',
    },
  ];
  const gameLIst = [
    {
      id: 1,
      label: 'xxxx',
    },
    {
      id: 2,
      label: 'bbbb',
    },
  ];

  const showModal = ref(false);
  const fromData = ref<ListData>({
    ...FROMDATA,
  });
  const rules: FormRules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入名称',
    },
    pwd: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入密码',
    },
    userName: {
      required: false,
    },
  };
  // 新建
  function addTable() {
    nextTick(() => {
      fromData.value = { ...FROMDATA };
      showModal.value = true;
    });
  }
  // 删除
  function deleteListUser() {
    console.log('删除', selectArr.value);
  }

  // 提交修改
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate((errors) => {
      if (!errors) {
        // console.log(fromData.value);
        window['$message'].success('新建成功');
        setTimeout(() => {
          showModal.value = false;
          reloadTable();
        });
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  }

  // 重置密码
  const formRefPwd: any = ref();
  const pwdShowModal = ref(false);

  const rulesPwd: FormRules = {
    pwd: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入密码',
    },
  };
  function confirmFormPwd(e) {
    console.log(e);
    e.preventDefault();
    formBtnLoading.value = true;
    formRefPwd.value.validate((errors) => {
      if (!errors) {
        // console.log(fromData.value);
        window['$message'].success('修改成功');
        setTimeout(() => {
          showModal.value = false;
          reloadTable();
        });
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  }
</script>
