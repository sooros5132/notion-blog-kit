import { IErrorResponse } from 'src-server/types/response';

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
export const NOTION_API_SECRET_KEY = process.env.NOTION_API_SECRET_KEY!;

export const ERROR_NOT_FOUND_FORM: IErrorResponse = {
  status: 404,
  error: '설문지가 없습니다.',
  success: false
};
export const ERROR_NOT_FOUND_FILE: IErrorResponse = {
  status: 404,
  error: '찾으려는 파일이 없습니다.',
  success: false
};

export const ERROR_NOT_PUBLISHED_FORM: IErrorResponse = {
  status: 403,
  error: '공개되지 않은 설문조사 입니다.',
  success: false
};

export const ERROR_NOT_FOUND_HR_REPORT: IErrorResponse = {
  status: 403,
  error: '리포트가 없습니다.',
  success: false
};

export const ERROR_NOT_FOUND_COMPANY: IErrorResponse = {
  status: 403,
  error: '찾으려는 회사가 없습니다.',
  success: false
};

export const ERROR_TYPE_NANOID: IErrorResponse = {
  error: '타입 에러 "nanoid"',
  status: 403,
  success: false
};

export const ERROR_TYPE_NICKNAME: IErrorResponse = {
  error: '타입 에러 "nickname"',
  status: 403,
  success: false
};

export const ERROR_TYPE_TITLE: IErrorResponse = {
  error: '타입 에러 "title"',
  status: 403,
  success: false
};

export const ERROR_TYPE_FORM_NANOID: IErrorResponse = {
  error: '타입 에러 "formNanoid"',
  status: 403,
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
