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
        :checked-row-keys="selectArr"
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
        >
          <n-form-item label="登录名" path="userID">
            <n-input placeholder="请输入登录名" v-model:value="fromData.userID" />
          </n-form-item>
          <n-form-item label="密码" path="pwd">
            <n-input
              :disabled="!!fromData.id"
              type="password"
              placeholder="请输入密码"
              v-model:value="fromData.pwd"
            />
          </n-form-item>
          <n-form-item label="姓名" path="userName">
            <n-input placeholder="请输入姓名" v-model:value="fromData.userName" />
          </n-form-item>
          <n-form-item label="手机" path="mobile">
            <n-input placeholder="请输入手机" v-model:value="fromData.mobile" />
          </n-form-item>
          <n-form-item label="状态" path="status">
            <n-radio-group v-model:value="fromData.status" name="radiogroup">
              <n-space>
                <n-radio v-for="song in songs" :key="song.value" :value="song.value">
                  {{ song.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="角色" path="RoleIds">
            <n-checkbox-group v-model:value="fromData.RoleIds">
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
          <n-form-item label="游戏" path="GameIds">
            <n-checkbox-group v-model:value="fromData.GameIds">
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
          <n-form-item label="备注" path="remark">
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
        >
          <n-form-item label="登录名" path="userID">
            <n-input disabled placeholder="请输入登录名" v-model:value="fromData.userID" />
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
  import { computed, h, nextTick, onActivated, onMounted, reactive, ref } from 'vue';
  import { PlusOutlined, DeleteFilled } from '@vicons/antd';

  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns, ListData } from './colums';
  import {
    getAdminslist,
    batchDeleteAdmins,
    batchResetpwdAdmins,
    updateAdmins,
  } from '@/api/permission/user';
  import { useCommonStore } from '@/store/modules/common';
  import { type FormRules } from 'naive-ui';
  import { formatDate } from '@/utils/dateUtil';

  // 定义组件名称，用于 keep-alive 缓存
  defineOptions({
    name: 'system_user',
  });
  onActivated(() => {
    reloadTable();
  });

  const schemas: FormSchema[] = [
    {
      field: 'userName',
      component: 'NInput',
      label: '用户昵称',
      componentProps: {
        placeholder: '请输入用户昵称',
      },
    },
    {
      field: 'mobile',
      component: 'NInput',
      label: '手机号',
      componentProps: {
        placeholder: '请输入手机号',
      },
    },
    {
      field: 'userStatus',
      component: 'NSelect',
      label: '用户状态',
      componentProps: {
        placeholder: '请选择',
        options: [
          {
            label: '全部',
            value: -1,
          },
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 0,
          },
        ],
      },
    },
    {
      field: 'dateRange',
      component: 'NDatePicker',
      label: '时间范围',
      componentProps: {
        type: 'daterange',
        clearable: true,
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
          // {
          //   label: '删除',
          //   onClick: handleDelete.bind(null, record),
          //   // 根据业务控制是否显示 isShow 和 auth 是并且关系
          //   ifShow: () => {
          //     return true;
          //   },
          //   // 根据权限控制是否显示: 有权限，会显示，支持多个
          //   // auth: ['basic_list'],
          // },
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
  const handleSubmit = (_val) => {
    reloadTable();
  };
  // 重置
  const handleReset = (_val) => {
    reloadTable();
  };

  // 获取列表数据
  const loadDataTable = async (res) => {
    const formValues = getFieldsValue();
    // 处理时间范围 - NDatePicker 返回的是时间戳数组
    let start = '';
    let end = '';
    if (formValues.dateRange && formValues.dateRange.length === 2) {
      start = formatDate(formValues.dateRange[0]);
      end = formatDate(formValues.dateRange[1]);
    }
    const params = {
      pageSize: res.pageSize,
      pageIndex: res.pageIndex,
      userName: formValues.userName || '',
      mobile: formValues.mobile || '',
      userStatus: formValues.userStatus ?? -1,
      start,
      end,
    };
    return await getAdminslist(params);
  };

  // function handleDelete(record: Recordable) {
  //   window['$message'].info('删除');
  // }
  async function handleEdit(record: Recordable) {
    isEdit.value = 1;
    showModal.value = true;
    record.GameIds = record.GameIds.map((i) => Number(i));
    record.RoleIds = record.RoleIds.map((i) => Number(i));
    fromData.value = record as ListData;
  }
  function handleResetTab(record: Recordable) {
    nextTick(() => {
      record.pwd = '';
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
    id: 0,
    userID: '',
    mobile: null,
    email: null,
    userName: null,
    pwd: '',
    createtime: '',
    salt: '',
    status: 0,
    lastLoginTime: null,
    remark: null,
    parentid: null,
    istg: 0,
    moneys: null,
    openid: null,
    ratioUnion: null,
    appSign: null,
    tgcode: null,
    QQ: null,
    channel: null,
    uid: null,
  };
  // 使用公共 store
  const commonStore = useCommonStore();

  // 角色列表
  const roleLIst = computed(() =>
    commonStore.getRoles.map((item) => ({
      id: item.Id,
      label: item.RoleName,
    }))
  );
  // 游戏/应用列表
  const gameLIst = computed(() =>
    commonStore.getGames.map((item) => ({
      id: item.Id,
      label: item.name,
    }))
  );

  // 获取角色和游戏列表
  async function loadCommonData() {
    await Promise.all([commonStore.fetchRoles(), commonStore.fetchGames()]);
  }

  onMounted(() => {
    loadCommonData();
  });

  const showModal = ref(false);
  const fromData = ref<ListData>({
    ...FROMDATA,
  });
  const rules = computed(() => {
    if (isEdit.value) {
      return {
        userID: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入名称',
        },
      };
    } else {
      return {
        userID: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入名称',
        },
        pwd: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入密码',
        },
      };
    }
  });
  // 0: 新建 1: 编辑
  const isEdit = ref(0);
  // 新建
  function addTable() {
    nextTick(() => {
      isEdit.value = 0;
      fromData.value = { ...FROMDATA };
      showModal.value = true;
    });
  }
  // 删除
  async function deleteListUser() {
    if (!selectArr.value.length) return;
    try {
      await batchDeleteAdmins(selectArr.value);
      window['$message'].success('删除成功');
      selectArr.value = [];
      reloadTable();
    } catch (error) {
      window['$message'].error('删除失败');
    }
  }

  // 提交修改
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const params = {
          id: fromData.value.id || 0,
          userID: fromData.value.userID || '',
          pwd: fromData.value.pwd || '',
          userName: fromData.value.userName || '',
          mobile: fromData.value.mobile || '',
          roleIds: fromData.value.RoleIds || [],
          games: fromData.value.GameIds || [],
          remark: fromData.value.remark || '',
          status: fromData.value.status || 0,
        };
        await updateAdmins(params).finally(() => {
          formBtnLoading.value = false;
        });
        setTimeout(() => {
          window['$message'].success(isEdit.value === 0 ? '新建成功' : '编辑成功');
          showModal.value = false;
          reloadTable();
        }, 500);
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
    e.preventDefault();
    formBtnLoading.value = true;
    formRefPwd.value.validate(async (errors) => {
      if (!errors) {
        const Data = {
          id: fromData.value.id,
          pwd: fromData.value.pwd,
        };
        console.log(Data);
        await batchResetpwdAdmins({ ...Data }).finally(() => {
          formBtnLoading.value = false;
        });
        // setTimeout(() => {
        window['$message'].success('修改成功');
        setTimeout(() => {
          pwdShowModal.value = false;
          reloadTable();
        }, 500);
        // });
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  }
</script>
