import type { MenuItem } from '~/utils/system/menu-store';

import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { addMenu, isRoutePathExists } from '~/utils/system/menu-store';
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

  const body = await readBody<Omit<MenuItem, 'id'>>(event);
  const validTypes: MenuItem['menuType'][] = ['catalog', 'menu', 'button'];
  if (!body?.name || body.routePath === undefined) {
    setResponseStatus(event, 400);
    return useResponseError('参数错误', '菜单名称和路由地址为必填');
  }
  if (!body?.sysCode) {
    setResponseStatus(event, 400);
    return useResponseError('参数错误', '系统为必填');
  }
  if (!body?.menuType || !validTypes.includes(body.menuType)) {
    setResponseStatus(event, 400);
    return useResponseError(
      '参数错误',
      '菜单类型为必填，且只能为 catalog / menu / button',
    );
  }

  if (isRoutePathExists(body.routePath)) {
    setResponseStatus(event, 400);
    return useResponseError('路由地址已存在', body.routePath);
  }

  const item = addMenu({
    parentId: body.parentId ?? null,
    name: body.name,
    menuType: body.menuType,
    routePath: body.routePath,
    menuIcon: body.menuIcon ?? '',
    menuSort: typeof body.menuSort === 'number' ? body.menuSort : 0,
    menuStatus: body.menuStatus === 0 ? 0 : 1,
    sysCode: body.sysCode ?? '',
  });

  return useResponseSuccess(item);
});
