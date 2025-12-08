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
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <n-button :disabled="!selectList.length" type="primary" @click="handleRiskControl">
            一键风控
          </n-button>
          <n-button class="ml-2" type="primary" @click="fkRecord"> 查看一键风控失败记录 </n-button>
        </template>
      </BasicTable>

      <!-- 一键风控弹窗 -->
      <n-modal
        v-model:show="showRiskModal"
        class="baseModal"
        :show-icon="false"
        preset="dialog"
        title="一键风控"
        style="width: 54vw; height: 70vh"
      >
        <n-form
          :model="riskFormParams"
          ref="riskFormRef"
          :rules="riskFormRules"
          label-placement="left"
          :label-width="80"
          class="py-4"
          style="height: 58vh; overflow-y: scroll"
        >
          <n-form-item label="用户" path="userInfo">
            <block v-for="user in selectedUsersDisplay" :key="user">
              <n-button strong secondary type="tertiary" class="mr-2">
                {{ user }}
              </n-button>
            </block>
          </n-form-item>
          <n-form-item label="用户状态" path="riskStatus">
            <n-radio-group v-model:value="riskFormParams.riskStatus">
              <n-space>
                <n-radio :value="1">正常</n-radio>
                <n-radio :value="2">收益限制</n-radio>
                <n-radio :value="3">拉黑(无法登录APP)</n-radio>
                <n-radio :value="4"> 可以登录APP，只请求开屏广告，其它广告一律不请求！ </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <!-- 收益限制时显示 -->
          <template v-if="riskFormParams.riskStatus === 2">
            <n-form-item label="APP名称" path="appName">
              <n-select
                v-model:value="riskFormParams.appName"
                placeholder="请选择APP"
                :options="appOptions"
              />
            </n-form-item>
            <n-form-item label="收益配置" path="profitConfig">
              <n-radio-group v-model:value="riskFormParams.profitConfig">
                <n-space>
                  <n-radio :value="1">通用限制收益配置</n-radio>
                  <n-radio :value="2">自定义限制收益配置</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <template v-if="riskFormParams.profitConfig === 2">
              <block v-for="item in riskFormParams.list" :key="item">
                <div class="text-center mb-4">{{ item?.name || '--' }} 广告</div>
                <n-grid x-gap="12" :cols="2">
                  <n-gi>
                    <n-form-item label-placement="top" label="广告网络">
                      <n-select :value="item?.name" disabled type="text" />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item
                      label-placement="top"
                      label="是否启用 如果不配置此广告网络也请配置成禁用"
                    >
                      <n-radio-group v-model:value="item.status">
                        <n-space>
                          <n-radio :value="0">启用</n-radio>
                          <n-radio :value="1">禁用</n-radio>
                        </n-space>
                      </n-radio-group>
                    </n-form-item>
                  </n-gi>
                </n-grid>
                <n-grid x-gap="12" :cols="6">
                  <n-gi>
                    <n-form-item label-placement="top" label="短视频收益获取比例(%)">
                      <n-input-number
                        v-model:value="item.shortVideo"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                        :min="0"
                        :max="100"
                      >
                        <template #suffix> % </template>
                      </n-input-number>
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label-placement="top" label="短视频金币最大值">
                      <n-input-number
                        v-model:value="item.maxShortVideoCoin"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label-placement="top" label="激励收益获取比例(%)">
                      <n-input-number
                        v-model:value="item.incentive"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                        :min="0"
                        :max="100"
                      >
                        <template #suffix> % </template>
                      </n-input-number>
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label-placement="top" label="激励金币最大值">
                      <n-input-number
                        v-model:value="item.maxIncentiveCoin"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label-placement="top" label="Banner收益获取比例(%)">
                      <n-input-number
                        v-model:value="item.banner"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                        :min="0"
                        :max="100"
                      >
                        <template #suffix> % </template>
                      </n-input-number>
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label-placement="top" label="Banner金币最大值">
                      <n-input-number
                        v-model:value="item.maxBannerCoin"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                      />
                    </n-form-item>
                  </n-gi>
                </n-grid>
                <n-grid x-gap="12" :cols="6">
                  <n-gi>
                    <n-form-item label-placement="top" label="信息流收益获取比例(%)">
                      <n-input-number
                        v-model:value="item.infoFlow"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                        :min="0"
                        :max="100"
                      >
                        <template #suffix> % </template>
                      </n-input-number>
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label-placement="top" label="信息流金币最大值">
                      <n-input-number
                        v-model:value="item.maxInfoFlowCoin"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label-placement="top" label="插屏收益获取比例(%)">
                      <n-input-number
                        v-model:value="item.interstitial"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                        :min="0"
                        :max="100"
                      >
                        <template #suffix> % </template>
                      </n-input-number>
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label-placement="top" label="插屏金币最大值">
                      <n-input-number
                        v-model:value="item.maxInterstitialCoin"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label-placement="top" label="开屏收益获取比例(%)">
                      <n-input-number
                        v-model:value="item.splash"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                        :min="0"
                        :max="100"
                      >
                        <template #suffix> % </template>
                      </n-input-number>
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label-placement="top" label="开屏金币最大值">
                      <n-input-number
                        v-model:value="item.maxSplashCoin"
                        placeholder="请输入"
                        :show-button="false"
                        style="width: 100%"
                      />
                    </n-form-item>
                  </n-gi>
                </n-grid>
              </block>
              <div></div>
            </template>
          </template>
          <!-- 拉黑时显示 -->
          <n-form-item v-if="riskFormParams.riskStatus === 3" label="备注" path="remark">
            <n-input
              v-model:value="riskFormParams.remark"
              type="textarea"
              placeholder="请输入备注"
              :rows="3"
            />
          </n-form-item>
        </n-form>

        <template #action>
          <n-space>
            <n-button @click="() => (showRiskModal = false)">取消</n-button>
            <n-button type="info" :loading="riskFormLoading" @click="confirmRiskForm">
              确定
            </n-button>
          </n-space>
        </template>
      </n-modal>

      <!-- 修改团长信息弹窗 -->
      <basicModal @register="leaderModalRegister" @on-ok="onLeaderModal" style="width: 50vw">
        <template #default>
          <BasicForm @register="leaderRegisterForm" />
        </template>
      </basicModal>
      <!-- 一键风控失败记录 -->
      <basicModal @register="modalRegister" style="width: 60vw">
        <template #action></template>
        <template #default>
          <BasicTable
            :columns="fkColumns"
            :request="loadFkRecord"
            :row-key="(row) => row.id"
            :actionColumn="fkActionColumn"
            canResize
            :striped="true"
          />
        </template>
      </basicModal>
      <!-- 标记用户 -->
      <basicModal @register="bjModalRegister" @on-ok="onBjModal" style="width: 40vw">
        <template #default>
          <BasicForm @register="bjRegisterForm" />
        </template>
      </basicModal>
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, computed } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getUserManageList, getFkRecord } from '@/api/inquiry/userManage';
  import { columns, UserData, fkColumns } from './columns';
  import { basicModal, useModal } from '@/components/Modal';
  const bjSchemas: FormSchema[] = [
    {
      field: 'name',
      component: 'NInput',
      label: '昵称',
      giProps: {
        span: 1,
      },
      componentProps: {
        placeholder: '请输入昵称',
        disabled: true,
      },
    },
    {
      field: 'markStatus',
      component: 'NRadioGroup',
      label: '标记状态',
      giProps: {
        //span: 24,
      },
      rules: [{ required: true, message: '请选择' }],
      componentProps: {
        options: [
          {
            label: '无',
            value: 0,
          },
          {
            label: '状态1',
            value: 1,
          },
          {
            label: '状态2',
            value: 2,
          },
          {
            label: '状态3',
            value: 3,
          },
          {
            label: '状态4',
            value: 4,
          },
          {
            label: '状态5',
            value: 5,
          },
          {
            label: '状态6',
            value: 6,
          },
        ],
        onUpdateChecked: (e: any) => {
          console.log(e);
        },
      },
    },
  ];
  const [bjRegisterForm, { submit, setFieldsValue }] = useForm({
    gridProps: { cols: 1 },
    collapsedRows: 3,
    labelWidth: 120,
    layout: 'horizontal',
    submitButtonText: '用户标记',
    showActionButtonGroup: false,
    schemas: bjSchemas,
  });

  const onBjModal = async () => {
    const formRes = await submit();
    if (formRes) {
      bjCloseModal();
      console.log('formRes', formRes);
      window['$message'].success('提交成功');
    } else {
      window['$message'].error('验证失败，请填写完整信息');
      bjSetSubLoading(false);
    }
  };
  const [
    bjModalRegister,
    { openModal: bjOpenModal, closeModal: bjCloseModal, setSubLoading: bjSetSubLoading },
  ] = useModal({
    title: '用户标记',
  });

  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '一键风控失败记录',
  });
  const fkRecord = () => {
    openModal();
  };
  const loadFkRecord = async (res: any) => {
    let result = await getFkRecord({ ...res });
    console.log(result);
    return result;
  };
  const fkActionColumn = reactive({
    width: 180,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: UserData) {
      return h(TableAction as any, {
        style: 'button',
        actions: [],
      });
    },
  });

  const actionRef = ref();

  // 一键风控弹窗
  const showRiskModal = ref(false);
  const riskFormLoading = ref(false);
  const riskFormRef = ref();

  interface LIST {
    name: string;
    status: number;
    shortVideo: number;
    maxShortVideoCoin: number;
    incentive: number;
    maxIncentiveCoin: number;
    banner: number;
    maxBannerCoin: number;
    infoFlow: number;
    maxInfoFlowCoin: number;
    interstitial: number;
    maxInterstitialCoin: number;
    splash: number;
    maxSplashCoin: number;
  }
  const riskList: Array<LIST> = [
    {
      name: 'gdt',
      status: 0,
      shortVideo: 0,
      maxShortVideoCoin: 0,
      incentive: 0,
      maxIncentiveCoin: 0,
      banner: 0,
      maxBannerCoin: 0,
      infoFlow: 0,
      maxInfoFlowCoin: 0,
      interstitial: 0,
      maxInterstitialCoin: 0,
      splash: 0,
      maxSplashCoin: 0,
    },
  ];
  const riskFormParams = reactive({
    riskStatus: null as number | null,
    appName: null as string | null,
    profitConfig: null as number | null,
    remark: '',
    list: [] as Array<LIST>,
  });

  // APP名称选项
  const appOptions = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
  ];

  // 动态表单验证规则
  const riskFormRules = computed(() => {
    const rules: any = {
      riskStatus: {
        required: true,
        type: 'number',
        message: '请选择用户状态',
        trigger: ['change'],
      },
    };
    // 收益限制时，APP名称和收益配置必填
    if (riskFormParams.riskStatus === 2) {
      rules.appName = {
        required: true,
        message: '请选择APP名称',
        trigger: ['change'],
      };
      rules.profitConfig = {
        required: true,
        type: 'number',
        message: '请选择收益配置',
        trigger: ['change'],
      };
    }
    // 拉黑时，备注必填
    if (riskFormParams.riskStatus === 3) {
      rules.remark = {
        required: true,
        message: '请输入备注',
        trigger: ['blur', 'input'],
      };
    }

    return rules;
  });

  // 修改团长弹窗
  const currentEditUser = ref<UserData | null>(null);
  const leaderSchemas: FormSchema[] = [
    {
      field: 'loginName',
      component: 'NInput',
      label: '登录名称',
      componentProps: {
        placeholder: '登录名称',
        disabled: true,
      },
    },
    {
      field: 'password',
      component: 'NInput',
      label: '密码',
      componentProps: {
        placeholder: '密码',
        disabled: true,
        type: 'password',
      },
    },
    {
      field: 'userInfo',
      component: 'NInput',
      label: '用户ID',
      componentProps: {
        placeholder: '用户ID',
        disabled: true,
      },
    },
    {
      field: 'leaderLevel',
      component: 'NRadioGroup',
      label: '团长等级',
      rules: [{ required: true, message: '请选择团长等级' }],
      componentProps: {
        options: [
          { label: 'V1', value: 1 },
          { label: 'V2', value: 2 },
          { label: 'V3', value: 3 },
        ],
      },
    },
    {
      field: 'status',
      component: 'NRadioGroup',
      label: '状态',
      rules: [{ required: true, message: '请选择状态' }],
      componentProps: {
        options: [
          { label: '正常', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
    {
      field: 'realName',
      component: 'NInput',
      label: '姓名',
      componentProps: {
        placeholder: '姓名',
        disabled: true,
      },
    },
    {
      field: 'phone',
      component: 'NInput',
      label: '手机',
      componentProps: {
        placeholder: '手机',
        disabled: true,
      },
    },
    {
      field: 'remark',
      component: 'NInput',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
        rows: 3,
      },
    },
  ];

  const [leaderRegisterForm, { submit: leaderSubmit, setFieldsValue: setLeaderFieldsValue }] =
    useForm({
      gridProps: { cols: 1 },
      labelWidth: 100,
      layout: 'horizontal',
      showActionButtonGroup: false,
      schemas: leaderSchemas,
    });

  const [
    leaderModalRegister,
    {
      openModal: leaderOpenModal,
      closeModal: leaderCloseModal,
      setSubLoading: leaderSetSubLoading,
    },
  ] = useModal({
    title: '修改团长信息',
  });

  const onLeaderModal = async () => {
    const formRes = await leaderSubmit();
    if (formRes) {
      leaderCloseModal();
      console.log('leaderFormRes', formRes);
      window['$message'].success('修改成功');
      reloadTable();
    } else {
      window['$message'].error('验证失败，请填写完整信息');
      leaderSetSubLoading(false);
    }
  };

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
    width: 280,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record: UserData) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '风控',
            onClick: handleAddBlacklist.bind(null, record),
          },
          {
            label: '修改团长',
            onClick: handleEditLeader.bind(null, record),
          },
          {
            label: '用户标记',
            onClick: handleBj.bind(null, record),
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

  function handleBj(record: UserData) {
    console.log(record);
    setTimeout(() => {
      setFieldsValue({ name: record.nickname, markStatus: record.markStatus });
    }, 50);
    bjOpenModal();
  }

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
    selectList.value = [record.userId];
    selectedUsersData.value = [record];
    handleRiskControl();
  }

  // 修改团长信息
  function handleEditLeader(record: UserData) {
    currentEditUser.value = record;
    setTimeout(() => {
      setLeaderFieldsValue({
        loginName: record.nickname || '',
        password: '******',
        userInfo: `${record.nickname}(${record.userId})`,
        leaderLevel: record.userLevel || 1,
        status: record.status,
        realName: record.nickname || '',
        phone: record.loginIp || '',
        remark: '',
      });
    }, 50);
    leaderOpenModal();
  }

  // 搜索提交
  function handleSubmit(_values: Recordable) {
    reloadTable();
  }

  // 重置搜索
  function handleReset(_values: Recordable) {
    reloadTable();
  }

  const selectList = ref<any[]>([]);
  const selectedUsersData = ref<UserData[]>([]);

  // 选中用户展示
  const selectedUsersDisplay = computed(() => {
    return selectedUsersData.value.map((u) => `${u.nickname}(${u.userId})`);
  });
  // 选择
  function onCheckedRow(rowKeys: string[], rows: UserData[]) {
    selectList.value = rowKeys;
    selectedUsersData.value = rows;
  }

  // 一键风控
  function handleRiskControl() {
    if (!selectList.value.length) {
      window['$message'].warning('请先选择用户');
      return;
    }
    // 重置表单
    riskFormParams.riskStatus = null;
    riskFormParams.appName = null;
    riskFormParams.profitConfig = null;
    riskFormParams.remark = '';
    riskFormParams.list = [...riskList];
    showRiskModal.value = true;
  }

  // 确认风控设置
  function confirmRiskForm() {
    riskFormRef.value?.validate((errors: any) => {
      if (!errors) {
        riskFormLoading.value = true;
        setTimeout(() => {
          window['$message'].success('风控设置成功');
          showRiskModal.value = false;
          riskFormLoading.value = false;
          reloadTable();
        }, 500);
      }
    });
  }
</script>

<style lang="less" scoped></style>
