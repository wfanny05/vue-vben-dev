<script lang="ts" setup>
import type { RoleItem, UserInfo } from '#/types/system/user';

import { computed, ref, watch } from 'vue';

import { ElMessage } from 'element-plus';

import {
  bindUserRolesApi,
  getBindingRoleListApi,
  getUserRolesApi,
} from '#/api/system/user';

const props = defineProps<{
  modelValue: boolean;
  user: null | UserInfo;
}>();

const emit = defineEmits<{
  refresh: [];
  'update:modelValue': [value: boolean];
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const loading = ref(false);
const saving = ref(false);
const allRoles = ref<RoleItem[]>([]);
const boundRoleIds = ref<number[]>([]);
const searchQuery = ref('');

// 计算属性：未绑定的角色
const unboundRoles = computed(() => {
  return allRoles.value.filter((role) => !boundRoleIds.value.includes(role.id));
});

// 计算属性：已绑定的角色
const boundRoles = computed(() => {
  return allRoles.value.filter((role) => boundRoleIds.value.includes(role.id));
});

// 计算属性：过滤后的角色列表（用于穿梭框）
const filteredRoles = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) {
    return allRoles.value;
  }
  return allRoles.value.filter(
    (role) =>
      role.roleName.toLowerCase().includes(query) ||
      role.appCode.toLowerCase().includes(query) ||
      role.sysCode.toLowerCase().includes(query),
  );
});

// 计算属性：已选中的角色（用于穿梭框）
const selectedRoles = computed({
  get: () => boundRoleIds.value,
  set: (value) => {
    boundRoleIds.value = value;
  },
});

// 监听弹窗打开，加载数据
watch(
  () => props.modelValue,
  async (visible) => {
    console.log('visible', visible);
    if (visible && props.user) {
      await loadRoles();
    }
  },
);

// 加载角色数据
async function loadRoles() {
  if (!props.user) return;

  loading.value = true;
  try {
    // 加载所有可绑定角色
    const allRes = await getBindingRoleListApi({});
    allRoles.value = allRes.data || [];

    // 加载用户已绑定角色
    const boundRes = await getUserRolesApi(props.user.userCode);
    boundRoleIds.value = (boundRes.data || []).map((role) => role.id);
  } catch {
    ElMessage.error('加载角色数据失败');
  } finally {
    loading.value = false;
  }
}

// 保存角色绑定
async function handleSave() {
  if (!props.user) return;

  saving.value = true;
  try {
    // 计算需要添加和删除的角色
    const currentBoundIds = boundRoleIds.value;
    const originalBoundIds =
      (await getUserRolesApi(props.user.userCode)).data?.map((r) => r.id) || [];

    const addRoleIds = currentBoundIds.filter(
      (id) => !originalBoundIds.includes(id),
    );
    const delRoleIds = originalBoundIds.filter(
      (id) => !currentBoundIds.includes(id),
    );

    await bindUserRolesApi(props.user.userCode, {
      addRoleIds,
      delRoleIds,
    });

    ElMessage.success('角色绑定成功');
    emit('update:modelValue', false);
    emit('refresh');
  } catch {
    ElMessage.error('角色绑定失败');
  } finally {
    saving.value = false;
  }
}

// 取消操作
function handleCancel() {
  emit('update:modelValue', false);
}

// 关闭弹窗时重置数据
function handleClosed() {
  boundRoleIds.value = [];
  searchQuery.value = '';
}
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    title="角色管理"
    width="1000px"
    @closed="handleClosed"
  >
    <div v-loading="loading" class="role-manager">
      <!-- <ElForm :model="{ selectedRoles }" label-width="100px">
        <ElFormItem label="用户编码">
          <span>{{ user?.userCode }}</span>
        </ElFormItem>
        <ElFormItem label="用户名称">
          <span>{{ user?.userName }}</span>
        </ElFormItem>
        <ElFormItem label="角色绑定" required>

        </ElFormItem>
      </ElForm> -->

      <ElTransfer
        v-model="selectedRoles"
        :data="filteredRoles"
        :titles="['全部角色', props?.user?.userName]"
        :props="{
          key: 'id',
          label: 'roleName',
        }"
        filterable
        filter-placeholder="请输入角色名称"
        style="

--el-transfer-panel-width: 400px"
      >
        <template #default="{ option }">
          <div class="role-item">
            <div class="role-name">{{ option.roleName }}</div>
            <div class="role-tags">
              <ElTag size="small" type="info">{{ option.appCode }}</ElTag>
              <ElTag size="small" type="success">
                {{ option.sysCode }}
              </ElTag>
            </div>
          </div>
        </template>
      </ElTransfer>
    </div>
    <template #footer>
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" :loading="saving" @click="handleSave">
        确定
      </ElButton>
    </template>
  </ElDialog>
</template>

<style scoped>
.role-manager {
  padding: 20px 0;
}

.role-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.role-name {
  flex: 1;
  margin-right: 12px;
}

.role-tags {
  display: flex;
  gap: 6px;
}
</style>
