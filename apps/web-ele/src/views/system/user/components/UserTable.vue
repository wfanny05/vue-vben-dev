<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DictItem } from '#/api/system/dict';
import type { UserInfo, UserSearchParams } from '#/types/system/user';

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
  const res = await getDictListApi({ dictCode: 'COMPANY_POSITION' });
  companyPositionOptions.value = res?.data ?? [];
}

const formOptions: VbenFormProps = {
  // 表单配置
  schema: [
    {
      component: 'Input',
      fieldName: 'userCode',
      label: '用户编码',
      componentProps: {
        placeholder: '请输入用户编码',
      },
    },
    {
      component: 'Input',
      fieldName: 'userName',
      label: '用户名称',
      componentProps: {
        placeholder: '请输入用户名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'deptName',
      label: '部门名称',
      componentProps: {
        placeholder: '请输入部门名称',
      },
    },
    {
      component: 'Select',
      fieldName: 'employmentStatus',
      label: '状态',
      defaultValue: 'ON_JOB',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '全部', value: 'UNKOWN' },
          { label: '在职', value: 'ON_JOB' },
          { label: '离职', value: 'OFF_JOB' },
        ],
      },
    },
  ],
  // 表单布局配置
  wrapperClass: 'grid-cols-1 md:grid-cols-4 gap-4',
  // 表单按钮配置
  showDefaultActions: true,
  submitButtonOptions: {
    content: '查询',
  },
  // 表单折叠按钮配置
  collapsed: false,
  showCollapseButton: false,
  // 是否在字段改变时提交表单
  submitOnChange: false,
  // 回车键提交配置
  submitOnEnter: true,
};

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
      title: '公司职位',
      minWidth: 120,
      slots: { default: 'companyPosition' },
    },
    {
      field: 'employmentStatus',
      title: '工作状态',
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
      width: 240,
      fixed: 'right',
      slots: { default: 'operation' },
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: true,
    pageSize: 15,
    pageSizes: [10, 15, 30, 40, 50, 100],
  },
  proxyConfig: {
    autoLoad: true,
    form: true,
    response: {
      result: 'data',
      total: 'total',
    },
    ajax: {
      query: async ({ page }, formData) => {
        const params: UserSearchParams & {
          pageNo?: number;
          pageSize?: number;
        } = {
          ...formData,
          pageSize: page.pageSize,
          pageNo: page.currentPage,
        };
        const result = await getUserListApi(params);
        return {
          data: result.data,
          total: result.total,
        };
      },
    },
  },
  rowConfig: { keyField: 'id' },
  toolbarConfig: {
    custom: true,
    refresh: true,
    zoom: true,
    export: true,
  },
  exportConfig: {},
}));

const [Grid, gridApi] = useVbenVxeGrid<UserInfo>({
  formOptions,
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
        <ElTag v-if="row.userStatus === 'ENABLE'" type="success"> 启用 </ElTag>
        <ElTag v-else-if="row.userStatus === 'DISABLE'" type="danger">
          禁用
        </ElTag>
        <ElTag v-else type="info">未知</ElTag>
      </template>
      <template #operation="{ row }">
        <TypeButton type="primary" size="small" @click="onEdit(row)">
          编辑
        </TypeButton>
        <TypeButton
          :type="row.userStatus === 'ENABLE' ? 'danger' : 'success'"
          size="small"
          @click="onToggleStatus(row)"
        >
          {{ row.userStatus === 'ENABLE' ? '禁用' : '启用' }}
        </TypeButton>
        <TypeButton type="assist" size="small" @click="onEdit(row)">
          角色管理
        </TypeButton>
      </template>
      <template #empty>
        <ElEmpty description="暂无用户数据">
          <slot name="empty-extra"></slot>
        </ElEmpty>
      </template>
    </Grid>
  </div>
</template>
