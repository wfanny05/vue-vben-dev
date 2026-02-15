import type { MenuItem } from '~/utils/menu-store';

import {
  defineEventHandler,
  getRouterParam,
  readBody,
  setResponseStatus,
} from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  findMenuById,
  isRoutePathExists,
  updateMenu,
} from '~/utils/menu-store';
import {
  unAuthorizedResponse,
  useResponseError,
  useResponseSuccess,
} from '~/utils/response';

export default defineEventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const id = getRouterParam(event, 'id');
  if (!id) {
    setResponseStatus(event, 400);
    return useResponseError('缺少菜单 id', null);
  }

  const existing = findMenuById(id);
  if (!existing) {
    setResponseStatus(event, 404);
    return useResponseError('菜单不存在', id);
  }

  const body = await readBody<Partial<Omit<MenuItem, 'id'>>>(event);
  if (body?.routePath !== undefined && isRoutePathExists(body.routePath, id)) {
    setResponseStatus(event, 400);
    return useResponseError('路由地址已存在', body.routePath);
  }

  const validTypes: MenuItem['menuType'][] = ['catalog', 'menu', 'button'];
  if (body?.menuType !== undefined && !validTypes.includes(body.menuType)) {
    setResponseStatus(event, 400);
    return useResponseError(
      '参数错误',
      '菜单类型只能为 catalog / menu / button',
    );
  }

  const updated = updateMenu(id, {
    ...(body?.parentId !== undefined && { parentId: body.parentId }),
    ...(body?.name !== undefined && { name: body.name }),
    ...(body?.menuType !== undefined && { menuType: body.menuType }),
    ...(body?.routePath !== undefined && { routePath: body.routePath }),
    ...(body?.menuIcon !== undefined && { menuIcon: body.menuIcon }),
    ...(body?.menuSort !== undefined && { menuSort: body.menuSort }),
    ...(body?.menuStatus !== undefined && { menuStatus: body.menuStatus }),
  });

  return useResponseSuccess(updated);
});
