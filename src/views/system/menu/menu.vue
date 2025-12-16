<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="菜单权限管理">
        页面数据为 Mock 示例数据，非真实数据。
      </n-card>
    </div>
    <n-grid class="mt-4" cols="1 s:1 m:1 l:3 xl:3 2xl:3" responsive="screen" :x-gap="12">
      <n-gi span="1">
        <n-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-dropdown trigger="hover" @select="selectAddMenu" :options="addMenuOptions">
                <n-button type="info" ghost icon-placement="right">
                  添加菜单
                  <template #icon>
                    <div class="flex items-center">
                      <n-icon size="14">
                        <DownOutlined />
                      </n-icon>
                    </div>
                  </template>
                </n-button>
              </n-dropdown>
              <n-button type="info" ghost icon-placement="left" @click="packHandle">
                全部{{ expandedKeys.length ? '收起' : '展开' }}
                <template #icon>
                  <div class="flex items-center">
                    <n-icon size="14">
                      <AlignLeftOutlined />
                    </n-icon>
                  </div>
                </template>
              </n-button>
            </n-space>
          </template>
          <div class="w-full menu">
            <n-input type="input" v-model:value="pattern" placeholder="输入菜单名称搜索">
              <template #suffix>
                <n-icon size="18" class="cursor-pointer">
                  <SearchOutlined />
                </n-icon>
              </template>
            </n-input>
            <div class="py-3 menu-list">
              <template v-if="loading">
                <div class="flex items-center justify-center py-4">
                  <n-spin size="medium" />
                </div>
              </template>
              <template v-else>
                <n-tree
                  block-line
                  cascade
                  checkable
                  :virtual-scroll="true"
                  :pattern="pattern"
                  :data="treeData"
                  key-field="Id"
                  label-field="Menuname"
                  children-field="Children"
                  :expandedKeys="expandedKeys"
                  style="max-height: 650px; overflow: hidden"
                  @update:selected-keys="selectedTree"
                  @update:expanded-keys="onExpandedKeys"
                />
              </template>
            </div>
          </div>
        </n-card>
      </n-gi>
      <n-gi span="2">
        <n-card :segmented="{ content: true }" :bordered="false" size="small">
          <template #header>
            <n-space>
              <n-icon size="18">
                <FormOutlined />
              </n-icon>
              <span>编辑菜单{{ treeItemTitle ? `：${treeItemTitle}` : '' }}</span>
            </n-space>
          </template>
          <n-alert type="info" closable> 从菜单列表选择一项后，进行编辑</n-alert>
          <n-form
            :model="formParams"
            :rules="rules"
            ref="formRef"
            label-placement="left"
            :label-width="100"
            v-if="isEditMenu"
            class="py-4"
          >
            <n-form-item label="菜单类型" path="Menutype">
              <n-radio-group v-model:value="formParams.Menutype" name="Menutype">
                <n-space>
                  <n-radio :value="1">目录</n-radio>
                  <n-radio :value="2">页面</n-radio>
                  <n-radio :value="3">按钮</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="菜单名称" path="Menuname">
              <n-input placeholder="请输入菜单名称" v-model:value="formParams.Menuname" />
            </n-form-item>
            <!-- 目录和页面显示图标 -->
            <n-form-item v-if="formParams.Menutype === 1" label="图标" path="Menuicon">
              <n-input placeholder="请输入图标" v-model:value="formParams.Menuicon" />
            </n-form-item>
            <!-- 页面和按钮显示权限标识 -->
            <n-form-item
              v-if="formParams.Menutype === 2 || formParams.Menutype === 3"
              label="权限标识"
              path="Authorize"
            >
              <n-input placeholder="请输入权限标识" v-model:value="formParams.Authorize" />
            </n-form-item>
            <!-- 页面显示请求地址 -->
            <n-form-item v-if="formParams.Menutype === 2" label="请求地址" path="Menuurl">
              <n-input placeholder="请输入请求地址" v-model:value="formParams.Menuurl" />
            </n-form-item>
            <n-form-item label="显示排序" path="Menusort">
              <n-input-number
                placeholder="请输入显示排序"
                v-model:value="formParams.Menusort"
                :min="0"
                style="width: 100%"
              />
            </n-form-item>
            <n-form-item label="菜单状态" path="Menustatus">
              <n-radio-group v-model:value="formParams.Menustatus" name="Menustatus">
                <n-space>
                  <n-radio :value="1">启用</n-radio>
                  <n-radio :value="0">禁用</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item style="margin-left: 100px">
              <n-space>
                <n-button type="primary" :loading="subLoading" @click="formSubmit">
                  保存修改
                </n-button>
                <n-button @click="handleDel">删除</n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>
      </n-gi>
    </n-grid>
    <CreateDrawer ref="createDrawerRef" :title="drawerTitle" @success="getlist" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive, onMounted, computed, nextTick } from 'vue';
  import { useDialog, useMessage } from 'naive-ui';
  import {
    DownOutlined,
    AlignLeftOutlined,
    SearchOutlined,
    FormOutlined,
  } from '@vicons/antd';
  import { getMenuList, updateMenu, deleteMenu, createMenu } from '@/api/system/menu';
  import { getTreeItem } from '@/utils';
  import CreateDrawer from './CreateDrawer.vue';
  import type { ListDate } from '@/api/system/menu';

  const rules = {
    // Menutype: {
    //   required: true,
    //   type: 'number',
    //   message: '请选择菜单类型',
    //   trigger: 'change',
    // },
    Menuname: {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur',
    },
    // Menusort: {
    //   required: true,
    //   type: 'number',
    //   message: '请输入显示排序',
    //   trigger: 'blur',
    // },
    // Menustatus: {
    //   required: true,
    //   type: 'number',
    //   message: '请选择菜单状态',
    //   trigger: 'change',
    // },
  };

  const formRef: any = ref(null);
  const createDrawerRef = ref();
  const message = useMessage();
  const dialog = useDialog();

  let treeItemKey = ref([]);

  let expandedKeys = ref([]);

  const treeData = ref<ListDate[]>([]);

  const loading = ref(true);
  const subLoading = ref(false);
  const isEditMenu = ref(false);
  const treeItemTitle = ref('');
  const pattern = ref('');
  const drawerTitle = ref('');

  const isAddSon = computed(() => {
    return !treeItemKey.value.length;
  });

  const addMenuOptions = ref([
    {
      label: '添加顶级菜单',
      key: 'home',
      disabled: false,
    },
    {
      label: '添加子菜单',
      key: 'son',
      disabled: isAddSon,
    },
  ]);

  const formParams: ListDate = reactive({
    Id: 0,
    Createtime: '',
    Modifytime: '',
    Creatorid: 0,
    Modifierid: 0,
    Parentid: 0,
    Menuname: '',
    Menuicon: '',
    Menuurl: '',
    Menutarget: '',
    Menusort: 0,
    Menutype: 1,
    Menustatus: 1,
    Authorize: '',
    Remark: '',
    ParentName: '',
    Children: [],
  });

  function selectAddMenu(key: string) {
    if (key === 'home') {
      drawerTitle.value = '添加顶级菜单';
      openCreateDrawer(0, '顶级菜单');
    } else {
      drawerTitle.value = `添加子菜单：${treeItemTitle.value}`;
      const parentId = treeItemKey.value[0] as number;
      openCreateDrawer(parentId, treeItemTitle.value);
    }
  }

  function openCreateDrawer(parentId = 0, parentName = '顶级菜单') {
    const { openDrawer } = createDrawerRef.value;
    openDrawer(parentId, parentName);
  }

  function selectedTree(keys) {
    if (keys.length) {
      const treeItem = getTreeItem(unref(treeData), keys[0]);
      nextTick(() => {
        treeItemKey.value = keys;
        treeItemTitle.value = treeItem.Menuname;
        console.log(treeItem);
        Object.assign(formParams, treeItem);
        isEditMenu.value = true;
      });
    } else {
      isEditMenu.value = false;
      treeItemKey.value = [];
      treeItemTitle.value = '';
    }
  }

  async function handleDel() {
    dialog.info({
      title: '提示',
      content: `您确定想删除此权限吗?`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await deleteMenu(formParams.Id);
        message.success('删除成功');
        getlist();
      },
      onNegativeClick: () => {
        message.error('已取消');
      },
    });
  }

  function formSubmit() {
    formRef.value.validate(async (errors: boolean) => {
      if (!errors) {
        const res = await updateMenu(formParams);
        console.log(res);
        getlist();
      } else {
        message.error('请填写完整信息');
      }
    });
  }

  function packHandle() {
    if (expandedKeys.value.length) {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = unref(treeData).map((item: any) => item.Id as string) as [];
    }
  }
  const getlist = async () => {
    loading.value = true;
    const treeMenuList = await getMenuList();
    // const keys = treeMenuList.map((item) => item.key);
    // Object.assign(formParams, keys);
    treeData.value = treeMenuList.Data;
    loading.value = false;
  };
  onMounted(async () => {
    getlist();
  });

  function onExpandedKeys(keys) {
    expandedKeys.value = keys;
  }
</script>
