<template>
  <n-flex vertical>
    <n-card :bordered="false">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" />
    </n-card>
    <n-card :bordered="false">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row:ListData) => row.Id"
        ref="actionRef"
        :actionColumn="actionColumn"
        canResize
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
        </template>
      </BasicTable>
      <n-modal
        v-model:show="showModal"
        :show-icon="false"
        preset="dialog"
        :title="fromData.Id ? '编辑' : '新建'"
        style="width: 50vw; height: 70vh"
      >
        <n-form
          :model="fromData"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="150"
          class="py-4"
          style="height: 60vh; overflow-y: scroll"
        >
          <n-form-item label="游戏名" path="name">
            <n-input placeholder="请输入游戏名" v-model:value="fromData.name" />
          </n-form-item>
          <n-form-item label="appId" path="appId">
            <n-input placeholder="请输入appId" v-model:value="fromData.appId" />
          </n-form-item>
          <n-form-item label="appSecret" path="appSecret">
            <n-input placeholder="请输入appSecret" v-model:value="fromData.appSecret" />
          </n-form-item>
          <n-form-item label="联系客服QQ群key" path="kfQQKey">
            <n-input placeholder="请输入客服QQ群key" v-model:value="fromData.kfQQKey" />
          </n-form-item>
          <n-form-item label="网站域名" path="webUrl">
            <n-input placeholder="请输入网站域名" v-model:value="fromData.webUrl" />
          </n-form-item>
          <n-form-item label="短剧免费解锁集数" path="playletFreeUnlockEpisodes">
            <n-input
              placeholder="请输入短剧免费解锁集数"
              v-model:value="fromData.playletFreeUnlockEpisodes"
              :allow-input="onlyAllowNumber"
            />
          </n-form-item>
          <n-form-item label="每看完1个激励广告解锁集数" path="lookOneStimulateUnlockEpisodes">
            <n-input
              placeholder="请输入"
              v-model:value="fromData.lookOneStimulateUnlockEpisodes"
              :allow-input="onlyAllowNumber"
            />
          </n-form-item>
          <n-form-item label="信息流循环调用时间间隔" path="streamLoopCallInterval">
            <n-input
              placeholder="请输入"
              v-model:value="fromData.streamLoopCallInterval"
              :allow-input="onlyAllowNumber"
            />
          </n-form-item>
          <n-form-item label="横幅循环调用时间间隔" path="bannerLoopCallInterval">
            <n-input
              placeholder="请输入"
              v-model:value="fromData.bannerLoopCallInterval"
              :allow-input="onlyAllowNumber"
            />
          </n-form-item>
          <n-form-item label="ulinkid" path="ulinkid">
            <n-input placeholder="请输入" v-model:value="fromData.ulinkid" />
          </n-form-item>
          <n-form-item label="友盟appkey" path="ulinkkey">
            <n-input placeholder="请输入" v-model:value="fromData.ulinkkey" />
          </n-form-item>
          <n-form-item label="游戏下载地址" path="downloadAppUrl">
            <n-input placeholder="请输入" v-model:value="fromData.downloadAppUrl" />
          </n-form-item>
          <n-form-item label="版本号" path="app_version">
            <n-input placeholder="请输入" v-model:value="fromData.app_version" />
          </n-form-item>
          <n-form-item label="协议地址" path="agreement">
            <n-input placeholder="请输入" v-model:value="fromData.agreement" />
          </n-form-item>
          <n-form-item label="附件地址" path="privicy">
            <n-input placeholder="请输入" v-model:value="fromData.privicy" />
          </n-form-item>
          <n-form-item label="单个红包最大金币数量" path="max_redpack_amount">
            <n-input
              placeholder="请输入"
              :allow-input="onlyAllowNumber"
              v-model:value="fromData.max_redpack_amount"
            />
          </n-form-item>
          <n-form-item label="提现审核金额(元)" path="maxTiXianCount">
            <n-input
              placeholder="请输入"
              :allow-input="onlyAllowNumber"
              v-model:value="fromData.maxTiXianCount"
            />
          </n-form-item>
          <div class="ml-40">注释：大于等于提现审核金额</div>
          <n-form-item label="是否提现到本游戏" path="isWeiXinTiXian">
            <n-radio-group v-model:value="fromData.isWeiXinTiXian">
              <n-space>
                <n-radio :value="0"> 是 </n-radio>
                <n-radio :value="1"> 否 </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="状态" path="status">
            <n-radio-group v-model:value="fromData.status">
              <n-space>
                <n-radio :value="0"> 启用 </n-radio>
                <n-radio :value="1"> 禁用 </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="商户号" path="weixinMchid">
            <n-input placeholder="请输入" v-model:value="fromData.weixinMchid" />
          </n-form-item>
          <n-form-item label="证书地址" path="weixinCerPath">
            <n-input placeholder="请输入" v-model:value="fromData.weixinCerPath" />
          </n-form-item>
          <n-form-item label="商户证书序列号" path="weixinSerialNo">
            <n-input placeholder="请输入" v-model:value="fromData.weixinSerialNo" />
          </n-form-item>
          <n-form-item label="APIV3" path="weixinAPIV3">
            <n-input placeholder="请输入" v-model:value="fromData.weixinAPIV3" />
          </n-form-item>
          <n-form-item label="提现回调地址" path="weixinNotify_url">
            <n-input placeholder="请输入" v-model:value="fromData.weixinNotify_url" />
          </n-form-item>
          <n-form-item label="登录方式" path="loginType">
            <n-radio-group v-model:value="fromData.loginType">
              <n-space>
                <n-radio :value="0"> 微信登录 </n-radio>
                <n-radio :value="1"> 账号登录 </n-radio>
              </n-space>
            </n-radio-group>
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
      <n-modal
        v-model:show="showRecordModal"
        style="width: 50vw"
        :show-icon="false"
        preset="dialog"
        title="设置公告"
      >
        <QuillEditor
          ref="quillEditor"
          style="height: 350px"
          :options="options"
          v-model:content="formRecordData.announcementContent"
        />
        <div class="flex mt-4">
          <div class="mr-4">状态:</div>
          <n-radio-group v-model:value="formRecordData.status">
            <n-space>
              <n-radio :value="0"> 启用 </n-radio>
              <n-radio :value="1"> 禁用 </n-radio>
            </n-space>
          </n-radio-group>
        </div>
        <template #action>
          <n-space>
            <n-button @click="() => (showRecordModal = false)">取消</n-button>
            <n-button type="info" :loading="formBtnLoading" @click="confirmRecordForm"
              >确定</n-button
            >
          </n-space>
        </template>
      </n-modal>

      <basicModal @register="modalRegister" class="basicModal">
        <template #action></template>
        <template #default>
          <n-form
            :model="fkData"
            :rules="fkrules"
            ref="formRef"
            label-placement="left"
            :label-width="220"
          >
            <n-form-item label="是否开启风控" path="states">
              <n-select
                :disabled="!fkData.isChange"
                v-model:value="fkData.states"
                :options="fkoptions"
              />
            </n-form-item>
            <n-form-item label="一个微信每天最多登录几台手机" path="num1">
              <n-input
                :disabled="!fkData.isChange"
                placeholder="请输入"
                :allow-input="onlyAllowNumber"
                v-model:value="fkData.num1"
              />
            </n-form-item>
            <n-form-item label="一个IP每天最多允许几台手机" path="num2">
              <n-input
                :disabled="!fkData.isChange"
                placeholder="请输入"
                :allow-input="onlyAllowNumber"
                v-model:value="fkData.num2"
              />
            </n-form-item>
            <n-form-item label=" ">
              <n-button type="primary" :secondary="!fkData.isChange" @click="fkSubmit"
                >{{ fkData.isChange ? '立即保存' : '编辑' }}
              </n-button>
            </n-form-item>
          </n-form>
        </template>
      </basicModal>
    </n-card>
  </n-flex>
</template>
<script lang="ts" setup>
  import { computed, h, nextTick, reactive, ref } from 'vue';
  import { PlusOutlined } from '@vicons/antd';
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import { useRouter } from 'vue-router';

  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { columns, ListData } from './colums';
  import { getAppList } from '@/api/table/list';
  import { type FormRules } from 'naive-ui';
  import { onlyAllowNumber } from '@/utils';
  import { basicModal, useModal } from '@/components/Modal';

  const router = useRouter();

  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'NInput',
      label: '名称',
      componentProps: {
        placeholder: '请输入名称',
      },
    },
    {
      field: 'type',
      component: 'NSelect',
      label: '状态',
      componentProps: {
        placeholder: '请选择',
        options: [
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
  ];

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 80,
    schemas,
    size: 'small',
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
    const data = await getAppList({ ...getFieldsValue(), ...res });
    return data;
  };
  // 操作栏
  const actionColumn = reactive({
    width: 520,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
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
            label: '设置邀请奖励任务',
            onClick: to.bind(null, record, 'app-invite'),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            // auth: ['basic_list'],
          },
          {
            label: '设置公告',
            onClick: handleNotice.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            // auth: ['basic_list'],
          },
          {
            label: '设置收益比例',
            onClick: to.bind(null, record, 'app-profit'),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            // auth: ['basic_list'],
          },
          {
            label: '设置风控',
            onClick: handleFk.bind(null, record),
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return true;
            },
            // 根据权限控制是否显示: 有权限，会显示，支持多个
            // auth: ['basic_list'],
          },
        ],
      });
    },
  });
  function to(record: Recordable, path: string) {
    router.push({ name: path, params: { id: record.Id } });
  }

  function handleEdit(record: Recordable) {
    nextTick(() => {
      fromData.value = record as ListData;
      showModal.value = true;
    });
  }
  const FROMDATA = {
    Id: 0,
    name: '',
    appId: '',
    ulinkid: '',
    status: 0,
    app_version: '',
  };
  // 新建
  function addTable() {
    nextTick(() => {
      fromData.value = { ...FROMDATA };
      showModal.value = true;
    });
  }
  const showModal = ref(false);

  const fromData = ref<ListData>({
    ...FROMDATA,
  });
  const rules: FormRules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入游戏名',
    },
  };
  const actionRef: any = ref(null);
  function reloadTable() {
    actionRef.value.reload();
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

  // 公告========
  interface RECORD {
    Id?: number;
    status?: number;
    announcementContent?: string | any;
  }

  const formRecordData = ref<RECORD>({});
  const showRecordModal = ref(false);
  function handleNotice(record: Recordable) {
    const { announcementContent, Id, announcementStatus } = record as ListData;
    nextTick(() => {
      formRecordData.value = {
        announcementContent,
        Id,
        status: announcementStatus,
      };
      showRecordModal.value = true;
      setTimeout(() => {
        const html = announcementContent;
        quillEditor.value.setHTML(html);
      }, 20);
    });
  }
  const options = reactive({
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ['clean'],
        ['image'],
      ],
    },
    theme: 'snow',
    placeholder: '输入您喜欢的内容吧！',
  });
  const quillEditor = ref();
  function getHtmlVal() {
    return quillEditor.value.getHTML();
  }
  // 提交公告
  const confirmRecordForm = () => {
    console.log(formRecordData.value);
    console.log(getHtmlVal());
    showRecordModal.value = false;
  };

  // 风控===========
  interface FKDATA {
    Id: number;
    states: number;
    num1: number;
    num2: number;
    isChange?: number;
  }
  const fkoptions = [
    {
      label: '开启',
      value: 0,
    },
    {
      label: '关闭',
      value: 1,
    },
  ];
  const [modalRegister, { openModal, closeModal, setSubLoading }] = useModal({
    title: '设置风控',
  });
  function handleFk(record: Recordable) {
    console.log('风控', record);
    nextTick(() => {
      fkData.value.isChange = 0;
    });
    openModal();
  }
  const FKDATA = {
    Id: 0,
    states: 0,
    num1: 0,
    num2: 0,
    isChange: 0,
  };
  const fkData = ref<FKDATA>({
    ...FKDATA,
  });
  const fkrules: FormRules = {
    states: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入',
    },
  };
  function fkSubmit() {
    if (fkData.value.isChange) {
      window['$message'].success('提交信息');
      closeModal();
    } else {
      fkData.value.isChange = 1;
    }
  }
</script>
<style lang="less" scoped></style>
