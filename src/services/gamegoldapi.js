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
      console.log("从数据库查询游戏列表cp.ListRecord:"+stringify(params));//currentPage=2&pageSize=10
      if (params==null) {
        params={
          currentPage:1,
          pageSize:10,
          cp_id:'',
          cp_name:'',
          cp_type:'',
          cp_state:'',
        };
      };
      ret=await remote.fetching({func: "cp.ListRecord",
        currentPage:params.currentPage,
        pageSize:params.pageSize,
        cp_id:typeof(params.cp_id)=="undefined"?'':params.cp_id,
        cp_name:typeof(params.cp_name)=="undefined"?'':params.cp_name,
        cp_type:typeof(params.cp_type)=="undefined"?'':params.cp_type,
        cp_state:typeof(params.cp_state)=="undefined"?'':params.cp_state,
      });
  }
  console.log("游戏管理结果列表："+JSON.stringify(ret));
  return ret;
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
  // let msg = await remote.login({openid: theOpenId});
  // let ret={};
  // if(remote.isSuccess(msg)) {
  //     console.log("查看新游戏:"+JSON.stringify(params));
  //     ret=await remote.fetching({func: "cp.ById",items:[params.id]});
  // }
  // console.log("查看新游戏结果："+JSON.stringify(ret));
  // if (ret.data===null) {
  //   return {};
  // }
  // else {
  //   return ret.data;
  // }
  let msg = await remote.login({openid: theOpenId});
  if(remote.isSuccess(msg)) {
      let ret=await remote.fetching({func: "cp.Retrieve", id: params.id});
      if (ret.data===null) {
        return {};
      }
      else {
        //有数据
        if (ret.data.cp_url!=null) {
          try {
            ret.data.icon_url=JSON.parse(ret.data.cp_url).icon_url;
            ret.data.face_url=JSON.parse(ret.data.cp_url).face_url;
            ret.data.pic_urls=JSON.parse(ret.data.cp_url).pic_urls;//游戏截图数组
          }
          catch (ex) {
            //忽略
          }
        }
        return ret.data;
      }
  }
  //return request(`/gamemgr/view?${stringify(params)}`);
}

//--（交易）钱包收支清单
export async function queryWalletLog(params) {
  let msg = await remote.login({openid: theOpenId});
  let ret={};
  if(remote.isSuccess(msg)) {
      console.log("获取钱包收支流水:"+JSON.stringify(params));
      ret=await remote.fetching({func: "tx.List",items:[]});
  }
  console.log("获取钱包收支流水结果："+JSON.stringify(ret));
  let theResult= {list:ret.data,pagination:{current:1,pageSize:10}};
  // let theResult= request(`/wallet/getLog?${stringify(params)}`);
  console.log("实际输出格式");
  console.log(theResult);
  return theResult;
  // let list=request(`/wallet/queryLog?${stringify(params)}`);
  // return list;
}

//--钱包流水详情
export async function getWalletLog(params) {
  let msg = await remote.login({openid: theOpenId});
  let ret={};
  if(remote.isSuccess(msg)) {
      console.log("获取钱包收支详情:"+JSON.stringify(params));
      ret=await remote.fetching({func: "tx.GetWallet",items:[params.id]});
  }
  console.log("获取钱包收支详情结果："+JSON.stringify(ret));
  if (ret.data!=null) {
    return ret.data;
  }
  else {
    return ret;
  }
}


//--钱包信息
export async function getWalletInfo(params) {
  let msg = await remote.login({openid: theOpenId});
  let ret={};
  if(remote.isSuccess(msg)) {
      console.log("获取钱包信息:"+JSON.stringify(params));
      ret=await remote.fetching({func: "wallet.Info",items:[]});
  }
  console.log("获取钱包信息结果："+JSON.stringify(ret));
  return ret;
  //return request(`/wallet/getInfo?${stringify(params)}`);
}

//--账户余额
export async function getBalanceAll(params) {
  let msg = await remote.login({openid: theOpenId});
  let ret={};
  if(remote.isSuccess(msg)) {
      console.log("获取余额参数:"+JSON.stringify(params));
      ret=await remote.fetching({func: "account.BalanceAll",items:[]});
  }
  console.log("获取余额结果："+JSON.stringify(ret));
  return ret;
  //return request(`/wallet/getInfo?${stringify(params)}`);
}

//--钱包：转出
export async function addWalletPay(params) {
  let msg = await remote.login({openid: theOpenId});
  let ret={};
  if(remote.isSuccess(msg)) {
      console.log("钱包转出:");
      // ret=await remote.fetching({func: "tx.Send",items:["tb1qlsnuxc5d5rufuavwgsrw9v96r65rmlwcdkexel",999]});
      ret=await remote.fetching({func: "tx.Send",items:[params.address,params.value]});
  }
  console.log("看起来本地比较迟的消息");

  return ret;

  // return request('/wallet/addPay', {
  //   method: 'POST',
  //   body: {
  //     ...params,
  //     method: 'post',
  //   },
  // });

}

export async function getGamePropsList(params) {

  let msg = await remote.login({openid: `${Math.random()*1000000000 | 0}`});
  let result = {};
  let pageSize = 10;
  if(remote.isSuccess(msg)) {
    let page=  params.currentPage;
  //所有的控制器都拥有echo方法
      msg = await remote.fetching({func: "prop.List",items:[page]});
      console.log(msg);
      if(remote.isSuccess(msg)){
        result = {
          list: msg.data,
          pagination: {
            total: 1000,
            pageSize,
            current: page,
          },
        };
        console.log(result);
      }
  }
  return result;

  //return request(`/api/gamepropslist?${stringify(params)}`);
}

export async function getGamePropsDetail(params) {
  return request(`/api/gamepropsdetail?${stringify(params)}`);
}

export async function getPropsByGame(params) {
  //游戏厂商获取所有游戏道具
  return request(`/api/gameprops?${stringify(params)}`);
}

export async function getAllGameList(params) {
  let msg = await remote.login({openid: theOpenId});
  let ret= [];
  if(remote.isSuccess(msg)) {
      let res =await remote.fetching({func: "cp.ListAllRecord"});
      console.log(res);
      if(remote.isSuccess(res)) {
          for (let i in res['data']) {
            ret.push(res['data'][i]); //属性
          }
      }
  }
  console.log(JSON.stringify(ret));
  return ret;
  //return request(`/api/allgame?${stringify(params)}`);
}
export async function getUserAll(params) {
  return request(`/api/userall?${stringify(params)}`);
}

