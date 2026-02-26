<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DictItem } from '#/api/system/dict';
import type { MenuInfo, MenuSearchParams } from '#/types/system/menu';

import { computed, onMounted, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDictListApi } from '#/api/system/dict';
import {
  deleteMenuApi,
  getMenuListApi,
  updateMenuStatusApi,
} from '#/api/system/menu';
import { MenuTypeEnum } from '#/types/system/menu';

const props = defineProps<{
  searchParams: MenuSearchParams;
}>();

const emit = defineEmits<{
  edit: [row: MenuInfo];
  refresh: [];
}>();

/** 系统字典选项 */
const sysCodeOptions = ref<DictItem[]>([]);
/** 当前激活的系统编码（tab） */
const activeSysCode = ref<string>('');

async function loadSysCodeOptions() {
  const list = await getDictListApi({ code: 'sysCode' });
  sysCodeOptions.value = list ?? [];
  if (!activeSysCode.value && sysCodeOptions.value.length > 0) {
    const first = sysCodeOptions.value[0];
    if (first) {
      activeSysCode.value = first.value;
    }
  }
}

// 树形表格配置：parentField 与 rowField 对应后端树形结构，支持 3 级层级
const gridOptions = computed<VxeTableGridOptions<MenuInfo>>(() => ({
  columns: [
    { field: 'id', title: 'ID', width: 0, visible: false },
    {
      field: 'name',
      title: '菜单名称',
      minWidth: 200,
      treeNode: true,
      slots: { default: 'name' },
    },
    {
      field: 'menuType',
      title: '菜单类型',
      width: 100,
      align: 'center',
      formatter: ({ row }: { row: MenuInfo }) =>
        MenuTypeEnum[row.menuType] ?? row.menuType,
    },
    { field: 'routePath', title: '路由地址', minWidth: 180 },
    {
      field: 'menuIcon',
      title: '图标',
      width: 100,
      align: 'center',
      slots: { default: 'icon' },
    },
    { field: 'menuSort', title: '排序', width: 90, align: 'center' },
    {
      field: 'menuStatus',
      title: '状态',
      width: 90,
      align: 'center',
      slots: { default: 'status' },
    },
    {
      field: 'operation',
      title: '操作',
      width: 160,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: { enabled: false },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async () => {
        const params: MenuSearchParams = {
          ...props.searchParams,
          // 选中了具体系统时，按 sysCode 过滤
          ...(activeSysCode.value ? { sysCode: activeSysCode.value } : {}),
        };
        const list = await getMenuListApi(params);
        return list ?? [];
      },
    },
  },
  rowConfig: { keyField: 'id' },
  toolbarConfig: {
    custom: true,
    refresh: true,
    zoom: true,
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'id',
    transform: false,
    expandAll: true,
  },
}));

const [Grid, gridApi] = useVbenVxeGrid<MenuInfo>({
  // 类型推断在这里偶尔不稳定，显式断言以避免 ts 插件报错
  gridOptions: gridOptions as unknown as VxeTableGridOptions<MenuInfo>,
});

function onEdit(row: MenuInfo) {
  emit('edit', row);
}

async function onDelete(row: MenuInfo) {
  try {
    await ElMessageBox.confirm(`确定删除菜单「${row.name}」吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await deleteMenuApi(row.id);
    ElMessage.success('删除成功');
    gridApi.query();
    emit('refresh');
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error((error as Error)?.message ?? '删除失败');
    }
  }
}

async function onStatusChange(row: MenuInfo, value: 0 | 1) {
  try {
    await updateMenuStatusApi(row.id, value);
    ElMessage.success('状态已更新');
    gridApi.query();
  } catch {
    ElMessage.error('状态更新失败');
  }
}

function hasChildren(row: MenuInfo): boolean {
  return !!(row.children && row.children.length > 0);
}

async function doQuery() {
  await gridApi.query();
  gridApi.grid?.setAllTreeExpand(true);
}

watch(
  () => activeSysCode.value,
  () => {
    doQuery();
  },
);

onMounted(async () => {
  await loadSysCodeOptions();
});

function getSysCode() {
  return activeSysCode.value;
}

defineExpose({ query: doQuery, getSysCode });
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <ElTabs v-model="activeSysCode">
      <ElTabPane
        v-for="opt in sysCodeOptions"
        :key="opt.value"
        :label="opt.label"
        :name="opt.value"
      />
    </ElTabs>

    <Grid>
      <template #toolbar-tools>
        <slot name="toolbar-extra"></slot>
      </template>
      <template #name="{ row }">
        <span>{{ row.name }}</span>
      </template>
      <template #icon="{ row }">
        <IconifyIcon
          v-if="row.menuIcon"
          :icon="row.menuIcon"
          class="inline-block size-5"
        />
        <span v-else class="text-gray-400">-</span>
      </template>
      <template #status="{ row }">
        <elSwitch
          :model-value="row.menuStatus === 1"
          @update:model-value="
            (v: string | number | boolean) => onStatusChange(row, v ? 1 : 0)
          "
        />
      </template>
      <template #operation="{ row }">
        <ElButton link type="primary" size="small" @click="onEdit(row)">
          编辑
        </ElButton>
        <ElTooltip
          v-if="hasChildren(row)"
          content="存在子菜单，无法删除"
          placement="top"
        >
          <span>
            <ElButton link type="danger" size="small" disabled> 删除 </ElButton>
          </span>
        </ElTooltip>
        <ElButton v-else link type="danger" size="small" @click="onDelete(row)">
          删除
        </ElButton>
      </template>
      <template #empty>
        <ElEmpty description="暂无菜单数据">
          <slot name="empty-extra"></slot>
        </ElEmpty>
      </template>
    </Grid>
  </div>
</template>
