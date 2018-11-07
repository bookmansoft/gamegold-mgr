import { stringify } from 'qs';
import request from '@/utils/request';
//--用户
export async function queryUserMgr(params) {
  return request(`/usermgr/query?${stringify(params)}`);
}


//--游戏管理
export async function queryGameMgr(params) {
  return request(`/gamemgr/query?${stringify(params)}`);
}
export async function addGameMgr(params) {
  return request(`/gamemgr/add?${stringify(params)}`);
}

//--钱包流水清单
export async function queryWallet(params) {
  return request(`/wallet/queryLog?${stringify(params)}`);
}

//--钱包流水详情
export async function getWalletLog(params) {
  return request(`/wallet/getLog?${stringify(params)}`);
}


//--钱包信息
export async function getWalletInfo(params) {
  return request(`/wallet/getInfo?${stringify(params)}`);
}

