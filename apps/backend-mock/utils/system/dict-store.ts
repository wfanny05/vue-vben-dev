/**
 * 字典管理内存存储，供 /api/system/dict 系列接口使用
 */

export interface DictItem {
  label: string;
  value: string;
}

/** 字典项类型 */
export type DictCode = 'COMPANY_POSITION' | 'sysCode';

/** 字典数据存储 */
const dictStore: Record<DictCode, DictItem[]> = {
  COMPANY_POSITION: [
    { label: '技术总监', value: 'CTO' },
    { label: '产品总监', value: 'CPO' },
    { label: '技术经理', value: 'TECH_MANAGER' },
    { label: '产品经理', value: 'PRODUCT_MANAGER' },
    { label: '高级工程师', value: 'SENIOR_ENGINEER' },
    { label: '中级工程师', value: 'MIDDLE_ENGINEER' },
    { label: '初级工程师', value: 'JUNIOR_ENGINEER' },
    { label: '实习生', value: 'INTERN' },
  ],
  sysCode: [
    { label: '系统A', value: 'sys_a' },
    { label: '系统B', value: 'sys_b' },
    { label: '系统C', value: 'sys_c' },
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
  value: string,
  item: Partial<DictItem>,
): boolean {
  const list = dictStore[dictCode];
  if (!list) return false;
  const index = list.findIndex((i) => i.value === value);
  if (index === -1) return false;
  list[index] = { ...list[index], ...item };
  return true;
}

/** 删除字典项 */
export function removeDictItem(dictCode: DictCode, value: string): boolean {
  const list = dictStore[dictCode];
  if (!list) return false;
  const index = list.findIndex((i) => i.value === value);
  if (index === -1) return false;
  list.splice(index, 1);
  return true;
}
