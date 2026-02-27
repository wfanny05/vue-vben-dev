/**
 * 角色管理内存存储，供 /api/system/role 系列接口使用
 */

import type { RoleItem, RoleStatus } from '~/types/user';

let roleStore: RoleItem[] = [];
let idCounter = 1;

function nextId(): number {
  return idCounter++;
}

/** 初始数据 */
function getInitialData(): RoleItem[] {
  return [
    {
      id: nextId(),
      roleCode: 'admin',
      roleName: '系统管理员',
      appCode: 'system',
      sysCode: 'sys_a',
      roleStatus: 'ENABLE',
    },
    {
      id: nextId(),
      roleCode: 'developer',
      roleName: '开发人员',
      appCode: 'system',
      sysCode: 'sys_a',
      roleStatus: 'ENABLE',
    },
    {
      id: nextId(),
      roleCode: 'product_manager',
      roleName: '产品经理',
      appCode: 'system',
      sysCode: 'sys_a',
      roleStatus: 'ENABLE',
    },
    {
      id: nextId(),
      roleCode: 'tester',
      roleName: '测试人员',
      appCode: 'system',
      sysCode: 'sys_a',
      roleStatus: 'ENABLE',
    },
    {
      id: nextId(),
      roleCode: 'operator',
      roleName: '运维人员',
      appCode: 'system',
      sysCode: 'sys_a',
      roleStatus: 'DISABLE',
    },
  ];
}

export function initRoleStore() {
  roleStore = getInitialData().map((item) => ({ ...item }));
  idCounter = roleStore.length + 1;
}

export function getRoleStore(): RoleItem[] {
  if (roleStore.length === 0) {
    initRoleStore();
  }
  return roleStore;
}

export function setRoleStore(data: RoleItem[]) {
  roleStore = data;
}

/** 根据 id 查找角色 */
export function findRoleById(id: number): undefined | RoleItem {
  return getRoleStore().find((item) => item.id === id);
}

/** 根据 roleCode 查找角色 */
export function findRoleByCode(roleCode: string): undefined | RoleItem {
  return getRoleStore().find((item) => item.roleCode === roleCode);
}

/** 添加角色 */
export function addRole(item: Omit<RoleItem, 'id'>): RoleItem {
  const newItem: RoleItem = {
    ...item,
    id: nextId(),
  };
  getRoleStore().push(newItem);
  return newItem;
}

/** 更新角色 */
export function updateRole(
  id: number,
  data: Partial<Omit<RoleItem, 'id'>>,
): null | RoleItem {
  const index = getRoleStore().findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...getRoleStore()[index], ...data };
  getRoleStore().splice(index, 1, updated);
  return updated;
}

/** 删除角色 */
export function removeRole(id: number): boolean {
  const index = getRoleStore().findIndex((item) => item.id === id);
  if (index === -1) return false;
  getRoleStore().splice(index, 1);
  return true;
}

/** 查询角色列表（支持过滤） */
export function queryRoles(params: {
  roleName?: string;
  appCode?: string;
  sysCode?: string;
}): RoleItem[] {
  const { roleName = '', appCode = '', sysCode = '' } = params;

  let filteredList = getRoleStore();
  if (roleName) {
    filteredList = filteredList.filter((item) =>
      item.roleName.toLowerCase().includes(roleName.toLowerCase()),
    );
  }
  if (appCode) {
    filteredList = filteredList.filter((item) =>
      item.appCode.toLowerCase().includes(appCode.toLowerCase()),
    );
  }
  if (sysCode) {
    filteredList = filteredList.filter((item) =>
      item.sysCode.toLowerCase().includes(sysCode.toLowerCase()),
    );
  }

  return filteredList;
}
