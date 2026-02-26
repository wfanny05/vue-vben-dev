<script lang="ts" setup>
import type { UserSearchParams } from '#/types/system/user';

import { reactive } from 'vue';

import { Search, RefreshRight } from '@vben/icons';

const emit = defineEmits<{
  search: [params: UserSearchParams];
  reset: [];
}>();

const formData = reactive<UserSearchParams>({
  userCode: '',
  userName: '',
  employmentStatus: undefined,
});

function onSearch() {
  emit('search', { ...formData });
}

function onReset() {
  formData.userCode = '';
  formData.userName = '';
  formData.employmentStatus = undefined;
  emit('reset');
}
</script>

<template>
  <ElForm inline class="search-form">
    <ElFormItem label="用户编码">
      <ElInput v-model="formData.userCode" placeholder="请输入用户编码" clearable />
    </ElFormItem>
    <ElFormItem label="用户名称">
      <ElInput v-model="formData.userName" placeholder="请输入用户名称" clearable />
    </ElFormItem>
    <ElFormItem label="在职状态">
      <ElSelect
        v-model="formData.employmentStatus"
        placeholder="请选择在职状态"
        clearable
      >
        <ElOption label="在职" value="ON_JOB" />
        <ElOption label="离职" value="OFF_JOB" />
        <ElOption label="未知" value="UNKNOWN" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem>
      <ElButton type="primary" @click="onSearch">
        <Search class="mr-1 size-4" />
        搜索
      </ElButton>
      <ElButton @click="onReset">
        <RefreshRight class="mr-1 size-4" />
        重置
      </ElButton>
    </ElFormItem>
  </ElForm>
</template>

<style scoped>
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
