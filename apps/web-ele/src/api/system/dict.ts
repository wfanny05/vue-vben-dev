import { requestClient } from '#/api/request';

/** 字典项（用于 Select 等） */
export interface DictItem {
  dictItemName: string;
  dictItemCode: string;
}

/**
 * 根据字典编码获取字典项列表
 * @param params.dictCode 字典编码，如 'sysCode'
 */
export async function getDictListApi(params: { dictCode: string }) {
  return requestClient.get<{ data: DictItem[] }>('/system/dict', { params });
}
