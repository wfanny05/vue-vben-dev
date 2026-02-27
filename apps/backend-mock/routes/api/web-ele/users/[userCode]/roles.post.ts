import { defineEventHandler, readBody } from 'h3';

import { findUserByCode, updateUser } from '~/utils/system/users-store';
import { findRoleByCode } from '~/utils/system/role-store';
import { useResponseSuccess, useResponseError } from '~/utils/response';

export default defineEventHandler(async (event) => {
  try {
    const userCode = event.context.params?.userCode;

    if (!userCode) {
      return useResponseError('用户编码不能为空');
    }

    const body = await readBody(event);
    const { addRoleIds = [], delRoleIds = [] } = body;

    const user = findUserByCode(userCode);
    if (!user) {
      return useResponseError('用户不存在');
    }

    // 获取当前用户的角色列表
    let currentRoles = [...user.roles];

    // 删除角色
    if (delRoleIds.length > 0) {
      currentRoles = currentRoles.filter(roleCode => 
        !delRoleIds.includes(roleCode)
      );
    }

    // 添加角色
    if (addRoleIds.length > 0) {
      // 验证要添加的角色是否存在
      for (const roleCode of addRoleIds) {
        const role = findRoleByCode(roleCode);
        if (!role) {
          return useResponseError(`角色 ${roleCode} 不存在`);
        }
      }

      // 合并角色列表，去重
      currentRoles = [...new Set([...currentRoles, ...addRoleIds])];
    }

    // 更新用户角色
    const updatedUser = updateUser(user.id, {
      roles: currentRoles,
    });

    if (!updatedUser) {
      return useResponseError('更新用户角色失败');
    }

    return useResponseSuccess(updatedUser);
  } catch (error) {
    return useResponseError(
      error instanceof Error ? error.message : '绑定角色失败',
      error,
    );
  }
});
