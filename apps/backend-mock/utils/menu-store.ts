/**
 * 菜单管理内存存储，供 /api/system/menu 系列接口使用
 */

/** 菜单类型：目录、菜单、按钮 */
export type MenuType = 'button' | 'catalog' | 'menu';

export interface MenuItem {
  id: string;
  parentId: null | string;
  name: string;
  menuType: MenuType;
  routePath: string;
  menuIcon: string;
  menuSort: number;
  menuStatus: 0 | 1;
  sysCode?: string;
}

let menuStore: MenuItem[] = [];
let idCounter = 1;

function nextId() {
  idCounter = menuStore.length;
  return `menu_${idCounter++}`;
}

/** 初始数据：一级菜单 + 若干二级 */
function getInitialData(): MenuItem[] {
  return [
    {
      id: 'menu_1',
      parentId: null,
      name: '系统管理',
      menuType: 'catalog',
      routePath: '/system',
      menuIcon: 'lucide:settings',
      menuSort: 100,
      menuStatus: 1,
      sysCode: 'sys_a',
    },
    {
      id: 'menu_2',
      parentId: 'menu_1',
      name: '菜单管理',
      menuType: 'menu',
      routePath: '/system/menu',
      menuIcon: 'lucide:menu',
      menuSort: 1,
      menuStatus: 1,
      sysCode: 'sys_a',
    },
    {
      id: 'menu_2_1',
      parentId: 'menu_2',
      name: '菜单管理-child-1',
      menuType: 'menu',
      routePath: '/system/menu/a',
      menuIcon: 'lucide:menu',
      menuSort: 1,
      menuStatus: 1,
      sysCode: 'sys_a',
    },
    {
      id: 'menu_2_2',
      parentId: 'menu_2',
      name: '菜单管理-child-2',
      menuType: 'menu',
      routePath: '/system/menu/b',
      menuIcon: 'lucide:menu',
      menuSort: 1,
      menuStatus: 1,
      sysCode: 'sys_a',
    },
    {
      id: 'menu_3',
      parentId: 'menu_1',
      name: '角色管理',
      menuType: 'menu',
      routePath: '/system/role',
      menuIcon: 'lucide:users',
      menuSort: 2,
      menuStatus: 1,
      sysCode: 'sys_a',
    },
  ];
}

export function initMenuStore() {
  menuStore = getInitialData().map((item) => ({ ...item }));
}

export function getMenuStore(): MenuItem[] {
  if (menuStore.length === 0) {
    initMenuStore();
  }
  return menuStore;
}

export function setMenuStore(data: MenuItem[]) {
  menuStore = data;
}

/** 扁平列表转树形（保留 children，用于返回给前端） */
export function buildMenuTree(
  list: MenuItem[],
  parentId: null | string = null,
): MenuItem[] {
  return list
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.menuSort - b.menuSort)
    .map((item) => ({
      ...item,
      children: buildMenuTree(list, item.id),
    }));
}

/** 是否有子节点 */
export function hasChildren(id: string): boolean {
  return getMenuStore().some((item) => item.parentId === id);
}

/** 根据 id 查找 */
export function findMenuById(id: string): MenuItem | undefined {
  return getMenuStore().find((item) => item.id === id);
}

/** 检查 routePath 是否已存在（排除指定 id） */
export function isRoutePathExists(
  routePath: string,
  excludeId?: string,
): boolean {
  return getMenuStore().some(
    (item) => item.routePath === routePath && item.id !== excludeId,
  );
}

export function addMenu(item: Omit<MenuItem, 'id'>): MenuItem {
  const newItem: MenuItem = {
    ...item,
    id: nextId(),
  };
  getMenuStore().push(newItem);
  return newItem;
}

export function updateMenu(
  id: string,
  data: Partial<Omit<MenuItem, 'id'>>,
): MenuItem | null {
  const index = getMenuStore().findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...getMenuStore()[index], ...data };
  getMenuStore().splice(index, 1, updated);
  return updated;
}

export function removeMenu(id: string): boolean {
  const index = getMenuStore().findIndex((item) => item.id === id);
  if (index === -1) return false;
  getMenuStore().splice(index, 1);
  return true;
}
