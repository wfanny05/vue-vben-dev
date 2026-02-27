<script lang="ts" setup>
import type { DictItem } from '#/api/system/dict';
import type { UserInfo } from '#/types/system/user';

import { computed, reactive, ref, watch } from 'vue';

import { ElMessage } from 'element-plus';

import { getDictListApi } from '#/api/system/dict';
import { updateUserApi } from '#/api/system/user';

const props = defineProps<{
  initialData: null | UserInfo;
  visible: boolean;
}>();

const emit = defineEmits<{
  success: [];
  'update:visible': [value: boolean];
}>();

const formData = reactive({
  userCode: '',
  userName: '',
  gender: 'MALE' as 'FEMALE' | 'MALE' | 'UNKNOWN',
  employmentStatus: 'ON_JOB' as 'OFF_JOB' | 'ON_JOB' | 'UNKNOWN',
  email: '',
  userStatus: 'ENABLE' as 'DISABLE' | 'ENABLE' | 'UNKNOWN',
  companyPosition: '',
});

const companyPositionOptions = ref<DictItem[]>([]);

const formRules = {
  userStatus: [
    { required: true, message: '请选择用户状态', trigger: 'change' },
  ],
  companyPosition: [
    { required: true, message: '请选择职位', trigger: 'change' },
  ],
};

const formRef = ref<InstanceType<typeof ElForm>>();

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});

async function loadCompanyPositionOptions() {
  const res = await getDictListApi({ dictCode: 'COMPANY_POSITION' });
  companyPositionOptions.value = res.data ?? [];
}

watch(
  () => props.initialData,
  (data) => {
    if (data) {
      formData.userCode = data.userCode;
      formData.userName = data.userName;
      formData.gender = data.gender;
      formData.employmentStatus = data.employmentStatus;
      formData.email = data.email;
      formData.userStatus = data.userStatus;
      formData.companyPosition = data.companyPosition;
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

function resetForm() {
  formData.userCode = '';
  formData.userName = '';
  formData.gender = 'MALE';
  formData.employmentStatus = 'ON_JOB';
  formData.email = '';
  formData.userStatus = 'ENABLE';
  formData.companyPosition = '';
  formRef.value?.clearValidate();
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    if (!props.initialData) return;

    await updateUserApi(props.initialData.id, {
      status: formData.userStatus,
      position: formData.companyPosition,
    });

    ElMessage.success('更新成功');
    dialogVisible.value = false;
    emit('success');
  } catch (error) {
    if (error !== false) {
      ElMessage.error((error as Error)?.message ?? '更新失败');
    }
  }
}

function handleCancel() {
  dialogVisible.value = false;
}

watch(dialogVisible, (val) => {
  if (val) {
    loadCompanyPositionOptions();
  }
});
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    title="编辑用户"
    width="600px"
    :close-on-click-modal="false"
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <ElFormItem label="用户编码" prop="userCode">
        <ElInput v-model="formData.userCode" disabled />
      </ElFormItem>
      <ElFormItem label="用户名称" prop="userName">
        <ElInput v-model="formData.userName" disabled />
      </ElFormItem>
      <ElFormItem label="性别" prop="gender">
        <ElRadioGroup v-model="formData.gender" disabled>
          <ElRadio label="MALE">男</ElRadio>
          <ElRadio label="FEMALE">女</ElRadio>
          <!-- <ElRadio label="UNKNOWN">未知</ElRadio> -->
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="在职状态" prop="employmentStatus">
        <ElRadioGroup v-model="formData.employmentStatus" disabled>
          <ElRadio value="ON_JOB">在职</ElRadio>
          <ElRadio value="OFF_JOB">离职</ElRadio>
          <!-- <ElRadio label="UNKNOWN">未知</ElRadio> -->
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="邮箱" prop="email">
        <ElInput v-model="formData.email" disabled />
      </ElFormItem>
      <ElFormItem label="用户状态" prop="userStatus">
        <ElSelect v-model="formData.userStatus" placeholder="请选择用户状态">
          <ElOption label="启用" value="ENABLE" />
          <ElOption label="禁用" value="DISABLE" />
          <!-- <ElOption label="未知" value="UNKNOWN" /> -->
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="职位" prop="companyPosition">
        <ElSelect v-model="formData.companyPosition" placeholder="请选择职位">
          <ElOption
            v-for="opt in companyPositionOptions"
            :key="opt.dictItemCode"
            :label="opt.dictItemName"
            :value="opt.dictItemCode"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" @click="handleSubmit">确定</ElButton>
    </template>
  </ElDialog>
</template>
