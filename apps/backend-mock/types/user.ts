/**
 * 用户管理相关类型定义
 */

/** 角色状态 */
export type RoleStatus = 'DISABLE' | 'ENABLE' | 'UNKNOWN';

/** 角色项 */
export interface RoleItem {
  id: number;
  roleCode: string;
  roleName: string;
  appCode: string;
  sysCode: string;
  roleStatus: RoleStatus;
}

/** 用户状态 */
export type UserStatus = 'DISABLE' | 'ENABLE' | 'UNKNOWN';

/** 在职状态 */
export type EmploymentStatus = 'ON_JOB' | 'OFF_JOB' | 'UNKNOWN';

/** 性别 */
export type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';

/** 用户项 */
export interface UserItem {
  id: number;
  userUid: string;
  userCode: string;
  userName: string;
  email: string;
  employmentStatus: EmploymentStatus;
  gender: Gender;
  deptName: string;
  deptCode: string;
  parentDeptName: string;
  createTime: string;
  updateTime: string;
  userStatus: UserStatus;
  companyPosition: string;
  roles: string[];
}

/** 用户列表查询参数 */
export interface UserListParams {
  userCode?: string;
  userName?: string;
  employmentStatus?: EmploymentStatus;
  pageSize?: number;
  pageNo?: number;
}

/** 用户更新参数 */
export interface UserUpdateParams {
  status: UserStatus;
  position: string;
}
