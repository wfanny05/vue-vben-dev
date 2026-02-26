/**
 * 用户管理相关类型定义
 */

/** 角色项 */
export interface RoleItem {
  id: number;
  roleCode: string;
  roleName: string;
  appCode: string;
  sysCode: string;
}

/** 用户状态 */
export type UserStatus = 'DISABLE' | 'ENABLE' | 'UNKNOWN';

/** 在职状态 */
export type EmploymentStatus = 'ON_JOB' | 'OFF_JOB' | 'UNKNOWN';

/** 性别 */
export type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';

/** 用户项 */
export interface UserInfo {
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
export interface UserSearchParams {
  userCode?: string;
  userName?: string;
  employmentStatus?: EmploymentStatus;
}

/** 用户表单数据（编辑） */
export interface UserFormData {
  userCode: string;
  userName: string;
  gender: Gender;
  employmentStatus: EmploymentStatus;
  email: string;
  userStatus: UserStatus;
  companyPosition: string;
}

/** 用户列表响应 */
export interface UserListResponse {
  items: UserInfo[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPage: number;
}
