import { defineEventHandler } from 'h3';

import { findUserByCode } from '~/utils/system/users-store';
import { queryRoles } from '~/utils/system/role-store';
import { useResponseSuccess, useResponseError } from '~/utils/response';

export default defineEventHandler(async (event) => {
  try {
    const userCode = event.context.params?.userCode;

    if (!userCode) {
      return useResponseError('用户编码不能为空');
    }

    const user = findUserByCode(userCode);
    if (!user) {
      return useResponseError('用户不存在');
    }

    // 获取所有角色
    const allRoles = queryRoles({});

    // 筛选出用户已绑定的角色
    const boundRoles = allRoles.filter(role => 
      user.roles.includes(role.roleCode)
    );

    return useResponseSuccess(boundRoles);
  } catch (error) {
    return useResponseError(
      error instanceof Error ? error.message : '获取用户角色失败',
      error,
    );
  }
});
