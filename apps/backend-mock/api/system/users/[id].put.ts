import { eventHandler, getRouterParam, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';
import { updateUser } from '~/utils/system/users-store';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const id = Number(getRouterParam(event, 'id'));
  if (Number.isNaN(id)) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody(event);
  const { status, position } = body;

  const updated = updateUser(id, {
    userStatus: status,
    companyPosition: position,
  });

  if (!updated) {
    return {
      status: -1,
      msg: '用户不存在',
    };
  }

  return useResponseSuccess(updated);
});
