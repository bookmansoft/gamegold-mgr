import { stringify } from 'qs';
import request from '@/utils/request';
import {gameconn} from 'gamegoldtoolkit';

const theOpenId="18681223392";
  //创建连接器对象
  let remote = new gameconn(
    gameconn.CommMode.get,              //使用短连接 get / post
    {
        "UrlHead": "http",              //协议选择: http/https
        "webserver": {
            "host": "127.0.0.1",        //远程主机地址
            "port": 9901                //远程主机端口
        },
        "auth": {
            "openid": theOpenId,        //用户标识
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
  let msg = await remote.login({openid: theOpenId});
  let ret={};
  if(remote.isSuccess(msg)) {
      console.log("游戏管理:");
      ret=await remote.fetching({func: "cp.List"});
  }
  console.log("游戏管理结果列表："+JSON.stringify(ret));
  if (ret.code==0) {
    return ret.data;
  }
  else {
    return {};
  }
  //return request(`/gamemgr/query?${stringify(params)}`);

}
//--添加新游戏
export async function addGameMgr(params) {
  let msg = await remote.login({openid: theOpenId});
  let ret={};
  if(remote.isSuccess(msg)) {
      console.log("添加新游戏:"+JSON.stringify(params));
      ret=await remote.fetching({func: "cp.Create",items:[params.gameName,params.gameUrl]});
  }
  console.log("添加新游戏结果："+JSON.stringify(ret));
  return ret;
  // return request('/gamemgr/add', {
  //   method: 'POST',
  //   body: {
  //     ...params,
  //     method: 'post',
  //   },
  // });
}

// 游戏详情
// params.id 查看的页面参数值。（其中params对应于model中的payload）
export async function getGameView(params) {
  console.log(params.id);
  //接下来好好查询并返回这个页面的数据
  let msg = await remote.login({openid: theOpenId});
  let ret={};
  if(remote.isSuccess(msg)) {
      console.log("查看新游戏:"+JSON.stringify(params));
      ret=await remote.fetching({func: "cp.ById",items:[params.id]});
  }
  console.log("查看新游戏结果："+JSON.stringify(ret));
  if (ret.data===null) {
    return {};
  }
  else {
    return ret.data;
  }
  //return request(`/gamemgr/view?${stringify(params)}`);
}

//--钱包流水清单
export async function queryWalletLog(params) {
  let list=request(`/wallet/queryLog?${stringify(params)}`);
  return list;
}

//--钱包流水详情
export async function getWalletLog(params) {
  return request(`/wallet/getLog?${stringify(params)}`);
}


//--钱包信息
export async function getWalletInfo(params) {
  //todo：在此实现获取钱包信息方法
  return request(`/wallet/getInfo?${stringify(params)}`);
}

//--钱包：转出
export async function addWalletPay(params) {
  let msg = await remote.login({openid: theOpenId});
  if(remote.isSuccess(msg)) {
      console.log("同步调用:");
      console.log(await remote.fetching({func: "test.Retrieve", id: 2}));
      console.log(await remote.fetching({func: "cp.List"}));
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

export async function getGamePropsList(params) {
  return request(`/api/gamepropslist?${stringify(params)}`);
}

export async function getGamePropsDetail(params) {
  return request(`/api/gamepropsdetail?${stringify(params)}`);
}

export async function getPropsByGame(params) {
  return request(`/api/gameprops?${stringify(params)}`);
}

export async function getAllGameList(params) {
  return request(`/api/allgame?${stringify(params)}`);
}
export async function getUserAll(params) {
  return request(`/api/userall?${stringify(params)}`);
}

