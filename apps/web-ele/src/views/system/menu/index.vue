<script lang="ts" setup>
import type { MenuInfo, MenuSearchParams } from '#/types/system/menu';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { ElButton } from 'element-plus';

import MenuEditor from './components/MenuEditor.vue';
import MenuTable from './components/MenuTable.vue';
import SearchForm from './components/SearchForm.vue';

const searchParams = ref<MenuSearchParams>({});
const tableRef = ref<InstanceType<typeof MenuTable>>();
const editorVisible = ref(false);
const editorInitialData = ref<MenuInfo | null>(null);

function onSearch(params: MenuSearchParams) {
  searchParams.value = params;
  tableRef.value?.query();
}

function onReset() {
  searchParams.value = {};
  tableRef.value?.query();
}

function onAdd() {
  editorInitialData.value = null;
  editorVisible.value = true;
}

function onEdit(row: MenuInfo) {
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
    <MenuTable ref="tableRef" :search-params="searchParams" @edit="onEdit">
      <template #toolbar-extra>
        <ElButton type="primary" @click="onAdd">
          <Plus class="mr-1 size-4" />
          新增菜单
        </ElButton>
      </template>
      <template #empty-extra>
        <ElButton type="primary" @click="onAdd">新增菜单</ElButton>
      </template>
    </MenuTable>
    <MenuEditor
      v-model:visible="editorVisible"
      :initial-data="editorInitialData"
      @success="onEditorSuccess"
    />
  </Page>
</template>
