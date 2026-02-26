import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

/** sysCode 字典 mock 数据 */
const SYS_CODE_OPTIONS = [
  { label: '系统A', value: 'sys_a' },
  { label: '系统B', value: 'sys_b' },
  { label: '系统C', value: 'sys_c' },
];

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const dictCode = Array.isArray(query.dictCode)
    ? query.dictCode[0]
    : query.dictCode;

  if (dictCode === 'sysCode') {
    return useResponseSuccess(SYS_CODE_OPTIONS);
  }

  return useResponseSuccess([]);
});
