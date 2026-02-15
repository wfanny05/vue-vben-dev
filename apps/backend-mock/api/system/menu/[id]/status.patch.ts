import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { findMenuById, updateMenu } from '~/utils/menu-store';
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

  const body = await readBody<{ menuStatus?: 0 | 1 }>(event);
  const menuStatus = body?.menuStatus;
  if (menuStatus !== 0 && menuStatus !== 1) {
    setResponseStatus(event, 400);
    return useResponseError('menuStatus 必须为 0 或 1', null);
  }

  const updated = updateMenu(id, { menuStatus });
  return useResponseSuccess(updated);
});
