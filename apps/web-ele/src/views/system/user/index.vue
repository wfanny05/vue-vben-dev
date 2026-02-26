<script lang="ts" setup>
import type { UserSearchParams, UserInfo } from '#/types/system/user';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import UserEditor from './components/UserEditor.vue';
import UserTable from './components/UserTable.vue';
import SearchForm from './components/SearchForm.vue';

const searchParams = ref<UserSearchParams>({});
const tableRef = ref<InstanceType<typeof UserTable>>();
const editorVisible = ref(false);
const editorInitialData = ref<UserInfo | null>(null);

function onSearch(params: UserSearchParams) {
  searchParams.value = params;
  tableRef.value?.query();
}

function onReset() {
  searchParams.value = {};
  tableRef.value?.query();
}

function onEdit(row: UserInfo) {
  editorInitialData.value = row;
  editorVisible.value = true;
}

function onEditorSuccess() {
  tableRef.value?.query();
}
</script>

<template>
  <Page auto-content-height content-class="flex flex-col gap-4">
    <SearchForm @reset="onReset" @search="onSearch" />
    <UserTable ref="tableRef" :search-params="searchParams" @edit="onEdit">
      <template #toolbar-extra>
        <ElButton type="primary" class="bg-[--table-cell-button-bg-1]">
          <Plus class="mr-1 size-4" />
          新增用户
        </ElButton>
      </template>
      <template #empty-extra>
        <ElButton type="primary"> 新增用户 </ElButton>
      </template>
    </UserTable>
    <UserEditor
      v-model:visible="editorVisible"
      :initial-data="editorInitialData"
      @success="onEditorSuccess"
    />
  </Page>
</template>

<style scoped></style>
