import type {
  UserInfo,
  UserListResponse,
  UserSearchParams,
} from '#/types/system/user';

import { requestClient } from '#/api/request';

/**
 * 获取用户列表
 * @param params 查询参数
 */
export async function getUserListApi(
  params: UserSearchParams & {
    pageNo?: number;
    pageSize?: number;
  },
) {
  return requestClient.get<UserListResponse>('/web-ele/users', { params });
}

/**
 * 更新用户信息
 * @param id 用户ID
 * @param data 更新数据
 */
export async function updateUserApi(
  id: number,
  data: {
    position: string;
    status: 'DISABLE' | 'ENABLE' | 'UNKNOWN';
  },
) {
  return requestClient.put<UserInfo>(`/system/users/${id}`, data);
}

/**
 * 获取可绑定角色列表
 * @param params 查询参数
 */
export async function getBindingRoleListApi(params: {
  roleName?: string;
  appCode?: string;
  sysCode?: string;
}) {
  return requestClient.get<RoleItem[]>('/web-ele/users/binding-role/list', { params });
}

/**
 * 获取用户已绑定角色列表
 * @param userCode 用户编码
 */
export async function getUserRolesApi(userCode: string) {
  return requestClient.get<RoleItem[]>(`/web-ele/users/${userCode}/roles`);
}

/**
 * 绑定用户角色
 * @param userCode 用户编码
 * @param data 绑定数据
 */
export async function bindUserRolesApi(userCode: string, data: {
  addRoleIds: string[];
  delRoleIds: string[];
}) {
  return requestClient.post(`/web-ele/users/${userCode}/roles`, data);
}
