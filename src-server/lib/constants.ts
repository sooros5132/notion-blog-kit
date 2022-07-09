import { IErrorResponse } from 'src-server/types/response';

export const ERROR_NOT_FOUND_FILE: IErrorResponse = {
  status: 404,
  error: '찾으려는 파일이 없습니다.',
  success: false
};

export const ERROR_UNAUTHORIZED: IErrorResponse = {
  error: '로그인을 해주세요.',
  status: 401,
  success: false
};

export const ERROR_AUTHENTICATION_ROLE: IErrorResponse = {
  error: '권한이 없습니다.',
  status: 403,
  success: false
};
