<script lang="ts" setup>
import type { MenuSearchParams } from '#/types/system/menu';

import { reactive, ref } from 'vue';

import { ElButton, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus';

const emit = defineEmits<{
  search: [params: MenuSearchParams];
  reset: [];
}>();

const form = reactive<MenuSearchParams>({
  name: '',
  routePath: '',
  menuStatus: '',
});

const formRef = ref<InstanceType<typeof ElForm>>();

function onSearch() {
  emit('search', { ...form });
}

function onReset() {
  form.name = '';
  form.routePath = '';
  form.menuStatus = '';
  formRef.value?.resetFields();
  emit('reset');
  emit('search', { ...form });
}
</script>

<template>
  <ElForm ref="formRef" :model="form" class="flex flex-wrap items-end gap-4">
    <ElFormItem label="菜单名称">
      <ElInput
        v-model="form.name"
        clearable
        placeholder="请输入菜单名称"
        style="width: 200px"
        @keyup.enter="onSearch"
      />
    </ElFormItem>
    <ElFormItem label="路由地址">
      <ElInput
        v-model="form.routePath"
        clearable
        placeholder="请输入路由地址"
        style="width: 200px"
        @keyup.enter="onSearch"
      />
    </ElFormItem>
    <ElFormItem label="状态">
      <ElSelect
        v-model="form.menuStatus"
        clearable
        placeholder="全部"
        style="width: 120px"
      >
        <ElOption label="全部" value="" />
        <ElOption label="启用" :value="1" />
        <ElOption label="禁用" :value="0" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem>
      <ElButton type="primary" @click="onSearch">搜索</ElButton>
      <ElButton @click="onReset">重置</ElButton>
    </ElFormItem>
  </ElForm>
</template>
