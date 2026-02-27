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

const loading = ref(false);
const saving = ref(false);
const allRoles = ref<RoleItem[]>([]);
const boundRoleCodes = ref<string[]>([]);
const searchQuery = ref('');

// 计算属性：未绑定的角色
const unboundRoles = computed(() => {
  return allRoles.value.filter(
    (role) => !boundRoleCodes.value.includes(role.roleCode),
  );
});

// 计算属性：已绑定的角色
const boundRoles = computed(() => {
  return allRoles.value.filter((role) =>
    boundRoleCodes.value.includes(role.roleCode),
  );
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
  get: () => boundRoleCodes.value,
  set: (value) => {
    boundRoleCodes.value = value;
  },
});

// 监听弹窗打开，加载数据
watch(
  () => props.modelValue,
  async (visible) => {
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
    boundRoleCodes.value = (boundRes.data || []).map((role) => role.roleCode);
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
    const currentBoundCodes = boundRoleCodes.value;
    const originalBoundCodes =
      (await getUserRolesApi(props.user.userCode)).data?.map(
        (r) => r.roleCode,
      ) || [];

    const addRoleIds = currentBoundCodes.filter(
      (code) => !originalBoundCodes.includes(code),
    );
    const delRoleIds = originalBoundCodes.filter(
      (code) => !currentBoundCodes.includes(code),
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
  boundRoleCodes.value = [];
  searchQuery.value = '';
}
</script>

<template>
  <ElDialog
    :model-value="modelValue"
    title="角色管理"
    width="800px"
    @closed="handleClosed"
  >
    <div v-loading="loading" class="role-manager">
      <ElForm :model="{ selectedRoles }" label-width="100px">
        <ElFormItem label="用户编码">
          <span>{{ user?.userCode }}</span>
        </ElFormItem>
        <ElFormItem label="用户名称">
          <span>{{ user?.userName }}</span>
        </ElFormItem>
        <ElFormItem label="角色绑定" required>
          <ElTransfer
            v-model="selectedRoles"
            :data="filteredRoles"
            :titles="['未绑定', '已绑定']"
            :props="{
              key: 'roleCode',
              label: 'roleName',
            }"
            filterable
            :filter-method="
              (query, item) => {
                const lowerQuery = query.toLowerCase();
                return (
                  item.roleName.toLowerCase().includes(lowerQuery) ||
                  item.appCode.toLowerCase().includes(lowerQuery) ||
                  item.sysCode.toLowerCase().includes(lowerQuery)
                );
              }
            "
            filter-placeholder="请输入角色名称、应用编码或系统编码"
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
        </ElFormItem>
      </ElForm>
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
