import { defineEventHandler, readBody } from 'h3';
import { useResponseError, useResponseSuccess } from '~/utils/response';
import { findRoleById } from '~/utils/system/role-store';
import { findUserByCode, updateUser } from '~/utils/system/users-store';

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
      currentRoles = currentRoles.filter((id) => !delRoleIds.includes(id));
    }

    // 添加角色
    if (addRoleIds.length > 0) {
      // 验证要添加的角色是否存在
      for (const id of addRoleIds) {
        const role = findRoleById(id);
        if (!role) {
          return useResponseError(`角色 ${id} 不存在`);
        }
      }

      // 合并角色列表，去重
      currentRoles = [...new Set([...addRoleIds, ...currentRoles])];
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
