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
//--添加新游戏
export async function addGameMgr(params) {
  return request('/gamemgr/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
  //return request(`/gamemgr/add?${stringify(params)}`);
}

//--游戏详情
export async function getGameView() {
  return request('/gamemgr/view');
}

//--钱包流水清单
export async function queryWalletLog(params) {
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

//--钱包：转出
export async function addWalletPay(params) {
  return request('/wallet/addPay', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });

}

