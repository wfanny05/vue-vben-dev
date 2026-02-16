import type { MenuItem } from '~/utils/menu-store';

import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { buildMenuTree, getMenuStore } from '~/utils/menu-store';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const name = (Array.isArray(query.name) ? query.name[0] : query.name) ?? '';
  const routePath =
    (Array.isArray(query.routePath) ? query.routePath[0] : query.routePath) ??
    '';
  const menuStatusRaw = Array.isArray(query.menuStatus)
    ? query.menuStatus[0]
    : query.menuStatus;
  const menuStatus =
    menuStatusRaw === '' || menuStatusRaw === undefined
      ? undefined
      : Number(menuStatusRaw);

  const sysCode =
    (Array.isArray(query.sysCode) ? query.sysCode[0] : query.sysCode) ?? '';

  const fullList = getMenuStore();

  const matches = (item: MenuItem) => {
    if (name && !item.name.toLowerCase().includes(name.toLowerCase()))
      return false;
    if (
      routePath &&
      !item.routePath.toLowerCase().includes(routePath.toLowerCase())
    )
      return false;
    if (
      menuStatus !== undefined &&
      menuStatus !== null &&
      !Number.isNaN(menuStatus) &&
      item.menuStatus !== menuStatus
    )
      return false;
    if (sysCode && item.sysCode !== sysCode) return false;
    return true;
  };

  const noBasicFilter =
    !name &&
    !routePath &&
    (menuStatus === undefined ||
      menuStatus === null ||
      Number.isNaN(menuStatus));

  if (noBasicFilter && !sysCode) {
    const tree = buildMenuTree(fullList);
    return useResponseSuccess(tree);
  }

  const matchingIds = new Set(fullList.filter(matches).map((item) => item.id));
  const includeParentIds = new Set<string>();
  fullList.forEach((item) => {
    if (matchingIds.has(item.id) && item.parentId) {
      let pid: null | string = item.parentId;
      while (pid) {
        includeParentIds.add(pid);
        const parent = fullList.find((p) => p.id === pid);
        pid = parent?.parentId ?? null;
      }
    }
  });
  const filteredList = fullList.filter(
    (item) => matchingIds.has(item.id) || includeParentIds.has(item.id),
  );
  const tree = buildMenuTree(filteredList);
  return useResponseSuccess(tree);
});
