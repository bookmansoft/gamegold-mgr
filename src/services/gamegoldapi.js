import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryUserMgr(params) {
  return request(`/usermgr/query?${stringify(params)}`);
}
