/**
 * 字典管理内存存储，供 /api/system/dict 系列接口使用
 */

export interface DictItem {
  dictItemName: string;
  dictItemCode: string;
}

/** 字典项类型 */
export type DictCode = 'COMPANY_POSITION' | 'sysCode';

/** 字典数据存储 */
const dictStore: Record<DictCode, DictItem[]> = {
  COMPANY_POSITION: [
    { dictItemName: '技术总监', dictItemCode: 'CTO' },
    { dictItemName: '产品总监', dictItemCode: 'CPO' },
    { dictItemName: '技术经理', dictItemCode: 'TECH_MANAGER' },
    { dictItemName: '产品经理', dictItemCode: 'PRODUCT_MANAGER' },
    { dictItemName: '高级工程师', dictItemCode: 'SENIOR_ENGINEER' },
    { dictItemName: '中级工程师', dictItemCode: 'MIDDLE_ENGINEER' },
    { dictItemName: '初级工程师', dictItemCode: 'JUNIOR_ENGINEER' },
    { dictItemName: '实习生', dictItemCode: 'INTERN' },
  ],
  sysCode: [
    { dictItemName: '系统A', dictItemCode: 'sys_a' },
    { dictItemName: '系统B', dictItemCode: 'sys_b' },
    { dictItemName: '系统C', dictItemCode: 'sys_c' },
  ],
};

/** 获取字典项列表 */
export function getDictList(dictCode: string): DictItem[] {
  return dictStore[dictCode as DictCode] || [];
}

/** 添加字典项 */
export function addDictItem(dictCode: DictCode, item: DictItem): void {
  if (!dictStore[dictCode]) {
    dictStore[dictCode] = [];
  }
  dictStore[dictCode].push(item);
}

/** 更新字典项 */
export function updateDictItem(
  dictCode: DictCode,
  dictItemCode: string,
  item: Partial<DictItem>,
): boolean {
  const list = dictStore[dictCode];
  if (!list) return false;
  const index = list.findIndex((i) => i.dictItemCode === dictItemCode);
  if (index === -1) return false;
  list[index] = { ...list[index], ...item };
  return true;
}

/** 删除字典项 */
export function removeDictItem(
  dictCode: DictCode,
  dictItemCode: string,
): boolean {
  const list = dictStore[dictCode];
  if (!list) return false;
  const index = list.findIndex((i) => i.dictItemCode === dictItemCode);
  if (index === -1) return false;
  list.splice(index, 1);
  return true;
}
