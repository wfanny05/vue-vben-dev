/**
 * 系统菜单相关类型定义
 */

/** 菜单类型：目录、菜单、按钮 */
export const MenuTypeEnum = {
  catalog: '目录',
  menu: '菜单',
  button: '按钮',
} as const;

export type MenuType = keyof typeof MenuTypeEnum;

/** 菜单状态：1 启用，0 禁用 */
export type MenuStatus = 0 | 1;

/** 菜单项（树形节点） */
export interface MenuInfo {
  id: string;
  parentId: null | string;
  name: string;
  menuType: MenuType;
  routePath: string;
  menuIcon: string;
  menuSort: number;
  menuStatus: MenuStatus;
  sysCode?: string;
  children?: MenuInfo[];
}

/** 菜单表单数据（新增/编辑） */
export interface MenuFormData {
  parentId: null | string;
  name: string;
  menuType: MenuType;
  routePath: string;
  menuIcon: string;
  menuSort: number;
  menuStatus: MenuStatus;
  sysCode: string;
}

/** 搜索参数 */
export interface MenuSearchParams {
  name?: string;
  routePath?: string;
  /** 全部 / 1 启用 / 0 禁用 */
  menuStatus?: '' | MenuStatus;
  /** 系统编码，用于按 sysCode 过滤菜单 */
  sysCode?: string;
}
