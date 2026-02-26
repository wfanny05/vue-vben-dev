import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { hasChildren, removeMenu } from '~/utils/system/menu-store';
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

  if (hasChildren(id)) {
    setResponseStatus(event, 400);
    return useResponseError('存在子菜单，无法删除', null);
  }

  const removed = removeMenu(id);
  if (!removed) {
    setResponseStatus(event, 404);
    return useResponseError('菜单不存在', id);
  }

  return useResponseSuccess(null);
});
