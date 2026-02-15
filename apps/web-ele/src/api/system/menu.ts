import type { MenuFormData, MenuInfo, MenuSearchParams, MenuStatus } from '#/types/system/menu';

import { requestClient } from '#/api/request';

const BASE = '/system/menu';

/**
 * 获取菜单列表（支持搜索参数，返回树形数据）
 */
export async function getMenuListApi(params?: MenuSearchParams) {
  return requestClient.get<MenuInfo[]>(BASE, { params });
}

/**
 * 新增菜单
 */
export async function createMenuApi(data: MenuFormData) {
  return requestClient.post<MenuInfo>(BASE, data);
}

/**
 * 编辑菜单
 */
export async function updateMenuApi(id: string, data: MenuFormData) {
  return requestClient.put<MenuInfo>(`${BASE}/${id}`, data);
}

/**
 * 删除菜单
 */
export async function deleteMenuApi(id: string) {
  return requestClient.delete<void>(`${BASE}/${id}`);
}

/**
 * 切换菜单状态（通过 instance.patch 走同一套响应拦截器，返回 data）
 */
export async function updateMenuStatusApi(id: string, menuStatus: MenuStatus) {
  return requestClient.instance.patch(`${BASE}/${id}/status`, {
    menuStatus,
  }) as Promise<MenuInfo>;
}
