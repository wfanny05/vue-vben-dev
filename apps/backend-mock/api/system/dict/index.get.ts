import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { getDictList } from '~/utils/system/dict-store';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const dictCode = Array.isArray(query.dictCode)
    ? query.dictCode[0]
    : query.dictCode;

  const list = getDictList(dictCode);
  return useResponseSuccess(list);
});
