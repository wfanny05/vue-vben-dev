<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MenuInfo, MenuSearchParams } from '#/types/system/menu';

import { computed } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElEmpty,
  ElMessage,
  ElMessageBox,
  ElSwitch,
  ElTooltip,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
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

// 树形表格配置：parentField 与 rowField 对应后端树形结构，支持 3 级层级
const gridOptions = computed<VxeTableGridOptions<MenuInfo>['gridOptions']>(
  () => ({
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
        formatter: ({ row }) => MenuTypeEnum[row.menuType] ?? row.menuType,
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
      ajax: {
        query: async () => {
          const list = await getMenuListApi(props.searchParams);
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
  }),
);

const [Grid, gridApi] = useVbenVxeGrid<MenuInfo>({
  gridOptions,
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

function doQuery() {
  gridApi.query();
  gridApi.grid?.setAllTreeExpand(true);
}

defineExpose({ query: doQuery });
</script>

<template>
  <Page auto-content-height>
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
        <ElSwitch
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
  </Page>
</template>
