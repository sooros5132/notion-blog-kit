import axios from 'axios';
import { IResponseSuccess } from 'lib/types/response';

export const fetcher = async <T>(url: string) => {
  return await axios.get<IResponseSuccess<T>>(url).then((res) => {
    if (!res.data.success) {
      throw 'fail';
    }
    return res.data.result;
  });
};
