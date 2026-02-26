import { requestClient } from '#/api/request';
import type {
  UserFormData,
  UserListResponse,
  UserSearchParams,
  UserInfo,
} from '#/types/system/user';

/**
 * 获取用户列表
 * @param params 查询参数
 */
export async function getUserListApi(params: UserSearchParams & {
  pageSize?: number;
  pageNo?: number;
}) {
  return requestClient.get<UserListResponse>('/system/users', { params });
}

/**
 * 更新用户信息
 * @param id 用户ID
 * @param data 更新数据
 */
export async function updateUserApi(id: number, data: {
  status: 'DISABLE' | 'ENABLE' | 'UNKNOWN';
  position: string;
}) {
  return requestClient.put<UserInfo>(`/system/users/${id}`, data);
}
