<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DictItem } from '#/api/system/dict';
import type { UserSearchParams, UserInfo } from '#/types/system/user';

import { computed, onMounted, ref } from 'vue';

import { ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDictListApi } from '#/api/system/dict';
import { getUserListApi, updateUserApi } from '#/api/system/user';

const props = defineProps<{
  searchParams: UserSearchParams;
}>();

const emit = defineEmits<{
  edit: [row: UserInfo];
  refresh: [];
}>();

/** 公司职位字典选项 */
const companyPositionOptions = ref<DictItem[]>([]);

async function loadCompanyPositionOptions() {
  const list = await getDictListApi({ code: 'COMPANY_POSITION' });
  companyPositionOptions.value = list ?? [];
}

// 表格配置
const gridOptions = computed<VxeTableGridOptions<UserInfo>>(() => ({
  columns: [
    { type: 'checkbox', width: 50 },
    { field: 'id', title: 'ID', width: 80 },
    { field: 'userCode', title: '用户编码', minWidth: 120 },
    { field: 'userName', title: '用户名称', minWidth: 120 },
    {
      field: 'gender',
      title: '性别',
      width: 80,
      slots: { default: 'gender' },
    },
    {
      field: 'companyPosition',
      title: '职位',
      minWidth: 120,
      slots: { default: 'companyPosition' },
    },
    {
      field: 'employmentStatus',
      title: '在职状态',
      width: 100,
      slots: { default: 'employmentStatus' },
    },
    { field: 'roles', title: '角色', minWidth: 150 },
    {
      field: 'userStatus',
      title: '用户状态',
      width: 100,
      slots: { default: 'userStatus' },
    },
    { field: 'email', title: '邮箱', minWidth: 180 },
    { field: 'deptName', title: '部门', minWidth: 120 },
    { field: 'parentDeptName', title: '上级部门', minWidth: 120 },
    { field: 'createTime', title: '创建时间', minWidth: 160 },
    { field: 'updateTime', title: '更新时间', minWidth: 160 },
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
  pagerConfig: {
    enabled: true,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100],
  },
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ page }) => {
        const params: UserSearchParams & {
          pageSize?: number;
          pageNo?: number;
        } = {
          ...props.searchParams,
          pageSize: page.pageSize,
          pageNo: page.currentPage,
        };
        const result = await getUserListApi(params);
        return {
          result: result.items,
          page: {
            total: result.total,
          },
        };
      },
    },
  },
  rowConfig: { keyField: 'id' },
  toolbarConfig: {
    custom: true,
    refresh: true,
    zoom: true,
  },
}));

const [Grid, gridApi] = useVbenVxeGrid<UserInfo>({
  gridOptions: gridOptions as unknown as VxeTableGridOptions<UserInfo>,
});

function onEdit(row: UserInfo) {
  emit('edit', row);
}

async function onToggleStatus(row: UserInfo) {
  const newStatus = row.userStatus === 'ENABLE' ? 'DISABLE' : 'ENABLE';
  const actionText = newStatus === 'ENABLE' ? '启用' : '禁用';
  try {
    await ElMessageBox.confirm(
      `确定${actionText}用户「${row.userName}」吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );
    await updateUserApi(row.id, {
      status: newStatus,
      position: row.companyPosition,
    });
    ElMessage.success(`${actionText}成功`);
    gridApi.query();
    emit('refresh');
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error((error as Error)?.message ?? `${actionText}失败`);
    }
  }
}

async function doQuery() {
  await gridApi.query();
}

onMounted(async () => {
  await loadCompanyPositionOptions();
});

defineExpose({ query: doQuery });
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <Grid>
      <template #toolbar-tools>
        <slot name="toolbar-extra"></slot>
      </template>
      <template #gender="{ row }">
        <ElTag v-if="row.gender === 'MALE'" type="primary">男</ElTag>
        <ElTag v-else-if="row.gender === 'FEMALE'" type="danger">女</ElTag>
        <ElTag v-else type="info">未知</ElTag>
      </template>
      <template #companyPosition="{ row }">
        <span>{{
          companyPositionOptions.find(
            (opt) => opt.value === row.companyPosition,
          )?.label || row.companyPosition
        }}</span>
      </template>
      <template #employmentStatus="{ row }">
        <ElTag v-if="row.employmentStatus === 'ON_JOB'" type="success">
          在职
        </ElTag>
        <ElTag v-else-if="row.employmentStatus === 'OFF_JOB'" type="danger">
          离职
        </ElTag>
        <ElTag v-else type="info">未知</ElTag>
      </template>
      <template #userStatus="{ row }">
        <ElTag v-if="row.userStatus === 'ENABLE'" type="success">
          启用
        </ElTag>
        <ElTag v-else-if="row.userStatus === 'DISABLE'" type="danger">
          禁用
        </ElTag>
        <ElTag v-else type="info">未知</ElTag>
      </template>
      <template #operation="{ row }">
        <ElButton link type="primary" size="small" @click="onEdit(row)">
          编辑
        </ElButton>
        <ElButton
          link
          :type="row.userStatus === 'ENABLE' ? 'danger' : 'success'"
          size="small"
          @click="onToggleStatus(row)"
        >
          {{ row.userStatus === 'ENABLE' ? '禁用' : '启用' }}
        </ElButton>
      </template>
      <template #empty>
        <ElEmpty description="暂无用户数据">
          <slot name="empty-extra"></slot>
        </ElEmpty>
      </template>
    </Grid>
  </div>
</template>
