import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryUserMgr(params) {
  return request(`/usermgr/query?${stringify(params)}`);
}

export async function queryGameMgr(params) {
  return request(`/gamemgr/query?${stringify(params)}`);
}
