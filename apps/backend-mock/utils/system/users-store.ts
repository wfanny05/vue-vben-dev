/**
 * 用户管理内存存储，供 /api/system/users 系列接口使用
 */

import type { EmploymentStatus, UserItem } from '~/types/user';

let userStore: UserItem[] = [];
let idCounter = 1;

function nextId(): number {
  return idCounter++;
}

/** 初始数据 */
function getInitialData(): UserItem[] {
  return [
    {
      id: nextId(),
      userUid: 'u_001',
      userCode: 'USER001',
      userName: '张三',
      email: 'zhangsan@example.com',
      employmentStatus: 'ON_JOB',
      gender: 'MALE',
      deptName: '技术部',
      deptCode: 'DEPT001',
      parentDeptName: '研发中心',
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-02-01 10:00:00',
      userStatus: 'ENABLE',
      companyPosition: 'SENIOR_ENGINEER',
      roles: ['admin', 'developer'],
    },
    {
      id: nextId(),
      userUid: 'u_002',
      userCode: 'USER002',
      userName: '李四',
      email: 'lisi@example.com',
      employmentStatus: 'ON_JOB',
      gender: 'FEMALE',
      deptName: '产品部',
      deptCode: 'DEPT002',
      parentDeptName: '产品中心',
      createTime: '2024-01-02 10:00:00',
      updateTime: '2024-02-02 10:00:00',
      userStatus: 'ENABLE',
      companyPosition: 'PRODUCT_MANAGER',
      roles: ['product_manager'],
    },
    {
      id: nextId(),
      userUid: 'u_003',
      userCode: 'USER003',
      userName: '王五',
      email: 'wangwu@example.com',
      employmentStatus: 'OFF_JOB',
      gender: 'MALE',
      deptName: '技术部',
      deptCode: 'DEPT001',
      parentDeptName: '研发中心',
      createTime: '2024-01-03 10:00:00',
      updateTime: '2024-02-03 10:00:00',
      userStatus: 'DISABLE',
      companyPosition: 'MIDDLE_ENGINEER',
      roles: ['developer'],
    },
  ];
}

export function initUserStore() {
  userStore = getInitialData().map((item) => ({ ...item }));
  idCounter = userStore.length + 1;
}

export function getUserStore(): UserItem[] {
  if (userStore.length === 0) {
    initUserStore();
  }
  return userStore;
}

export function setUserStore(data: UserItem[]) {
  userStore = data;
}

/** 根据 id 查找用户 */
export function findUserById(id: number): undefined | UserItem {
  return getUserStore().find((item) => item.id === id);
}

/** 根据 userCode 查找用户 */
export function findUserByCode(userCode: string): undefined | UserItem {
  return getUserStore().find((item) => item.userCode === userCode);
}

/** 添加用户 */
export function addUser(item: Omit<UserItem, 'id'>): UserItem {
  const newItem: UserItem = {
    ...item,
    id: nextId(),
  };
  getUserStore().push(newItem);
  return newItem;
}

/** 更新用户 */
export function updateUser(
  id: number,
  data: Partial<Omit<UserItem, 'id'>>,
): null | UserItem {
  const index = getUserStore().findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...getUserStore()[index], ...data };
  getUserStore().splice(index, 1, updated);
  return updated;
}

/** 删除用户 */
export function removeUser(id: number): boolean {
  const index = getUserStore().findIndex((item) => item.id === id);
  if (index === -1) return false;
  getUserStore().splice(index, 1);
  return true;
}

/** 查询用户列表（支持分页和过滤） */
export function queryUsers(params: {
  employmentStatus?: EmploymentStatus;
  pageNo?: number;
  pageSize?: number;
  userCode?: string;
  userName?: string;
}): {
  currentPage: number;
  data: UserItem[];
  pageSize: number;
  total: number;
  totalPage: number;
} {
  const {
    userCode = '',
    userName = '',
    employmentStatus,
    pageSize = 10,
    pageNo = 1,
  } = params;

  // 过滤
  let filteredList = getUserStore();
  if (userCode) {
    filteredList = filteredList.filter((item) =>
      item.userCode.toLowerCase().includes(userCode.toLowerCase()),
    );
  }
  if (userName) {
    filteredList = filteredList.filter((item) =>
      item.userName.toLowerCase().includes(userName.toLowerCase()),
    );
  }
  if (employmentStatus && employmentStatus !== 'UNKNOWN') {
    filteredList = filteredList.filter(
      (item) => item.employmentStatus === employmentStatus,
    );
  }

  const total = filteredList.length;
  const totalPage = Math.ceil(total / pageSize);
  const currentPage = pageNo > totalPage ? Math.max(1, totalPage) : pageNo;

  // 分页
  const offset = (currentPage - 1) * pageSize;
  const data =
    offset + pageSize >= total
      ? filteredList.slice(offset)
      : filteredList.slice(offset, offset + pageSize);

  return {
    data,
    total,
    currentPage,
    pageSize,
    totalPage,
  };
}
