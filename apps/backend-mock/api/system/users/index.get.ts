import { eventHandler, getQuery } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { queryUsers } from '~/utils/system/users-store';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const query = getQuery(event);
  const userCode = Array.isArray(query.userCode)
    ? query.userCode[0]
    : query.userCode;
  const userName = Array.isArray(query.userName)
    ? query.userName[0]
    : query.userName;
  const employmentStatus = Array.isArray(query.employmentStatus)
    ? query.employmentStatus[0]
    : query.employmentStatus;
  const pageSize = Number(
    Array.isArray(query.pageSize) ? query.pageSize[0] : query.pageSize,
  );
  const pageNo = Number(
    Array.isArray(query.pageNo) ? query.pageNo[0] : query.pageNo,
  );

  const result = queryUsers({
    userCode: userCode || '',
    userName: userName || '',
    employmentStatus: employmentStatus as any,
    pageSize: Number.isNaN(pageSize) ? 10 : pageSize,
    pageNo: Number.isNaN(pageNo) ? 1 : pageNo,
  });

  return useResponseSuccess(result);
});
