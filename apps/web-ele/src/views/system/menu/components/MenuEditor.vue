<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import type { DictItem } from '#/api/system/dict';
import type { MenuFormData, MenuInfo } from '#/types/system/menu';

import { computed, ref, watch } from 'vue';

import { globalShareState } from '@vben/common-ui';

import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  ElTreeSelect,
} from 'element-plus';

import { getDictListApi } from '#/api/system/dict';
import {
  createMenuApi,
  getMenuListApi,
  updateMenuApi,
} from '#/api/system/menu';
import { MenuTypeEnum } from '#/types/system/menu';

const props = withDefaults(
  defineProps<{
    /** 编辑时的初始数据；为空表示新增 */
    initialData?: MenuInfo | null;
    visible: boolean;
  }>(),
  { initialData: null },
);

const emit = defineEmits<{
  success: [];
  'update:visible': [v: boolean];
}>();

const IconPicker = globalShareState.getComponents().IconPicker;

const isEdit = computed(() => !!props.initialData?.id);

const dialogTitle = computed(() => (isEdit.value ? '编辑菜单' : '新增菜单'));

const menuTypeOptions = Object.entries(MenuTypeEnum).map(([value, label]) => ({
  value: value as MenuFormData['menuType'],
  label,
}));

const formRef = ref<FormInstance>();
const form = ref<MenuFormData>({
  parentId: null,
  name: '',
  menuType: 'menu',
  routePath: '',
  menuIcon: '',
  menuSort: 0,
  menuStatus: 1,
  sysCode: '',
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  routePath: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
  sysCode: [{ required: true, message: '请选择系统', trigger: 'change' }],
};

/** 系统字典选项（从字典接口 code=sysCode 获取） */
const sysCodeList = ref<DictItem[]>([]);

/** 树节点：用于 el-tree-select */
interface TreeNode {
  name: string;
  id: null | string;
  children?: TreeNode[];
}

/** 父菜单树：一级菜单（根） + 已有菜单树 */
const parentTreeOptions = ref<TreeNode[]>([]);

// function menuToTreeNode(item: MenuInfo): TreeNode {
//   return {
//     label: item.name,
//     value: item.id,
//     children: item.children?.length
//       ? item.children.map((child) => menuToTreeNode(child))
//       : undefined,
//   };
// }

async function loadParentOptions() {
  const list = await getMenuListApi();
  // const tree: TreeNode[] = [
  //   { label: '一级菜单', value: '' },
  //   ...(list ?? []).map((item) => menuToTreeNode(item)),
  // ];
  const tree: TreeNode[] = [{ name: '一级菜单', id: '' }, ...(list ?? [])];
  parentTreeOptions.value = tree;
}

async function loadSysCodeList() {
  const list = await getDictListApi({ code: 'sysCode' });
  sysCodeList.value = list ?? [];
}

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      await Promise.all([loadParentOptions(), loadSysCodeList()]);
      form.value = props.initialData
        ? {
            parentId: props.initialData.parentId ?? null,
            name: props.initialData.name,
            menuType: props.initialData.menuType ?? 'menu',
            routePath: props.initialData.routePath,
            menuIcon: props.initialData.menuIcon ?? '',
            menuSort: props.initialData.menuSort ?? 0,
            menuStatus: props.initialData.menuStatus ?? 1,
            sysCode: props.initialData.sysCode ?? '',
          }
        : {
            parentId: null,
            name: '',
            menuType: 'menu',
            routePath: '',
            menuIcon: '',
            menuSort: 0,
            menuStatus: 1,
            sysCode: '',
          };
    }
  },
);

function close() {
  emit('update:visible', false);
}

async function onSubmit() {
  await formRef.value?.validate();
  await (isEdit.value && props.initialData?.id
    ? updateMenuApi(props.initialData.id, form.value)
    : createMenuApi(form.value));
  close();
  emit('success');
}
</script>

<template>
  <ElDialog
    :model-value="visible"
    :title="dialogTitle"
    width="520px"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="90px">
      <ElFormItem label="父菜单" prop="parentId">
        <ElTreeSelect
          v-model="form.parentId"
          :data="parentTreeOptions"
          placeholder="请选择父菜单"
          clearable
          class="w-full"
          node-key="id"
          :props="{ label: 'name' }"
          check-strictly
          default-expand-all
        />
      </ElFormItem>
      <ElFormItem label="菜单类型" prop="menuType">
        <ElSelect
          v-model="form.menuType"
          placeholder="请选择菜单类型"
          class="w-full"
        >
          <ElOption
            v-for="opt in menuTypeOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="系统" prop="sysCode">
        <ElSelect
          v-model="form.sysCode"
          placeholder="请选择系统"
          class="w-full"
          clearable
        >
          <ElOption
            v-for="opt in sysCodeList"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="菜单名称" prop="name">
        <ElInput v-model="form.name" placeholder="请输入菜单名称" />
      </ElFormItem>
      <ElFormItem
        v-if="form.menuType !== 'button'"
        label="路由地址"
        prop="routePath"
      >
        <ElInput v-model="form.routePath" placeholder="请输入路由地址" />
      </ElFormItem>
      <ElFormItem label="图标" prop="menuIcon">
        <div class="w-full">
          <div id="menu-editor__icon-picker-container"></div>
          <IconPicker
            v-model="form.menuIcon"
            placeholder="请选择图标"
            class="w-full"
            append-to="#menu-editor__icon-picker-container"
            prefix="ep"
          />
        </div>
      </ElFormItem>
      <ElFormItem label="排序值" prop="menuSort">
        <ElInputNumber
          v-model="form.menuSort"
          :min="0"
          :step="1"
          controls-position="right"
          class="w-full"
        />
      </ElFormItem>
      <ElFormItem label="状态" prop="menuStatus">
        <ElRadioGroup v-model="form.menuStatus">
          <ElRadio :value="1">启用</ElRadio>
          <ElRadio :value="0">禁用</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="close">取消</ElButton>
      <ElButton type="primary" @click="onSubmit">确定</ElButton>
    </template>
  </ElDialog>
</template>
