import { defineEventHandler, getQuery } from 'h3';
import { useResponseError, useResponseSuccess } from '~/utils/response';
import { queryRoles } from '~/utils/system/role-store';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { roleName, appCode, sysCode } = query;

    const roles = queryRoles({
      roleName: roleName as string,
      appCode: appCode as string,
      sysCode: sysCode as string,
    });

    return useResponseSuccess(roles);
  } catch (error) {
    return useResponseError(
      error instanceof Error ? error.message : '获取角色列表失败',
      error,
    );
  }
});
