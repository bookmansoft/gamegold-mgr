import { stringify } from 'qs';
import request from '@/utils/request';
import {gameconn} from 'gamegoldtoolkit';

  //创建连接器对象
  let remote = new gameconn(
    gameconn.CommMode.get,             //使用短连接 get / post
    {
        "UrlHead": "http",              //协议选择: http/https
        "webserver": {
            "host": "127.0.0.1",        //远程主机地址
            "port": 9901                //远程主机端口
        },
        "auth": {
            "openid": "18681223392",    //用户标识
            "openkey": "18681223392",   //和用户标识关联的用户令牌
            "domain": "tx.IOS",         //用户所在的域，tx是提供登录验证服务的厂商类别，IOS是该厂商下的服务器组别
        }
    }
  )



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

/** 已作废
  remote.NotifyType = gameconn.NotifyType;//不知道干嘛的

  remote.auth({openid: `${Math.random()*1000000000 | 0}`}, msg => {
    remote.isSuccess(msg); //使用断言，对返回值进行合理性判定，如判定失败则抛出异常，下面的 done 就不会被执行
    remote.fetching({func: "test.Retrieve", id: 5}, msg => {
        //remote.log(msg);
        remote.log("勇敢尝试新生事物的结果："+JSON.stringify(msg))
    });
  });
 */
  let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
  if(remote.isSuccess(msg)) {
      console.log("同步调用:");
      console.log(await remote.fetching({func: "test.Retrieve", id: 2}));
  }
  console.log("看起来本地比较迟的消息");



  return request('/wallet/addPay', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });

}

