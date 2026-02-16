import { requestClient } from '#/api/request';

/** 字典项（用于 Select 等） */
export interface DictItem {
  label: string;
  value: string;
}

/**
 * 根据字典编码获取字典项列表
 * @param params.code 字典编码，如 'sysCode'
 */
export async function getDictListApi(params: { code: string }) {
  return requestClient.get<DictItem[]>('/system/dict', { params });
}
