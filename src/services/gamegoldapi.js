import { stringify } from 'qs';
import request from '@/utils/request';
import { gameconn } from 'gamegoldtoolkit';

const theOpenId = "18681223392";
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
  let msg = await remote.login({ openid: theOpenId });
  let ret = {};
  if (remote.isSuccess(msg)) {
    console.log("从数据库查询游戏列表cp.ListRecord:" + stringify(params));//currentPage=2&pageSize=10
    if (params == null) {
      params = {
        currentPage: 1,
        pageSize: 10,
        cp_id: '',
        cp_text: '',
        cp_type: '',
        cp_state: '',
      };
    };
    ret = await remote.fetching({
      func: "cp.ListRecord",
      currentPage: params.currentPage,
      pageSize: params.pageSize,
      cp_id: typeof (params.cp_id) == "undefined" ? '' : params.cp_id,
      cp_text: typeof (params.cp_text) == "undefined" ? '' : params.cp_text,
      cp_type: typeof (params.cp_type) == "undefined" ? '' : params.cp_type,
      cp_state: typeof (params.cp_state) == "undefined" ? '' : params.cp_state,
    });
  }
  console.log("游戏管理结果列表：" + JSON.stringify(ret));
  return ret;
  //return request(`/gamemgr/query?${stringify(params)}`);

}
//--添加新游戏
// 步骤：
// 首先调用在链上创建的语句
// 如果成功，则调用数据库的插入方法
// 实际调试中，可以先验证插入方法的调用
export async function addGameMgr(params) {
  let msg = await remote.login({ openid: theOpenId });
  let ret = {};

  // 调用保存记录的方法
  if (remote.isSuccess(msg)) {
    //先调用链上的保存方法
    console.log("添加新游戏:" + JSON.stringify(params));
    ret = await remote.fetching({ func: "cp.Create", items: [params.cp_name, params.cp_url] });
    //判断返回值是否正确
    console.log(ret);
    if (ret.code!=0 || ret.data==null) {
      return {code:-1,msg:"调用区块链创建游戏失败！"};
    }
    let cp_id=ret.data.cid;//返回的cpid值
    console.log("调用保存记录的方法:" + JSON.stringify(params));
    let msg = await remote.fetching({
      func: "cp.CreateRecord",
      cp_id: cp_id,
      cp_name: params.cp_name,
      cp_text: params.cp_text,
      cp_url: params.cp_url,
      wallet_addr: params.wallet_addr,
      cp_type: params.cp_type,
      develop_name: params.develop_name,
      cp_desc: params.cp_desc,
      cp_version: params.cp_version,
      picture_url: params.picture_url,
      cp_state: 1,
      publish_time: params.publish_time,
      audit_time: params.audit_time,
      online_time: params.online_time,
      offline_time: params.offline_time,
    });
  }
  console.log("ok 92!");




  console.log("添加新游戏结果：" + JSON.stringify(ret));
  return ret;
  // return request('/gamemgr/add', {
  //   method: 'POST',
  //   body: {
  //     ...params,
  //     method: 'post',
  //   },
  // });
}

//从指定URL中获取游戏内容（已测试通过）
//params.cp_url 准备保存为cp_url的外部URL字段值
export async function getGameFromUrl(params) {
  let msg = await remote.login({ openid: theOpenId });
  if (remote.isSuccess(msg)) {
    let data = await remote.fetching({ func: "cp.getGameFromUrl", cp_url: params.cp_url });
    console.log(data);
    //有数据
    data.wallet_addr = params.wallet_addr;
    data.cp_url = params.cp_url;
    if (data.picture_url != null) {
      try {
        data.icon_url = JSON.parse(data.picture_url).icon_url;
        data.face_url = JSON.parse(data.picture_url).face_url;
        data.pic_urls = JSON.parse(data.picture_url).pic_urls;//游戏截图数组
      }
      catch (ex) {
        //忽略
      }
    }
    return data;
  }
}


// 游戏详情
// params.id 查看的页面参数值。（其中params对应于model中的payload）
export async function getGameView(params) {
  console.log(params.id);
  //接下来好好查询并返回这个页面的数据
  let msg = await remote.login({ openid: theOpenId });
  if (remote.isSuccess(msg)) {
    let ret = await remote.fetching({ func: "cp.Retrieve", id: params.id });
    if (ret.data === null) {
      return {};
    }
    else {
      console.log(ret.data);
      //有数据
      if (ret.data.picture_url != null) {
        try {
          ret.data.icon_url = JSON.parse(ret.data.picture_url).icon_url;
          ret.data.face_url = JSON.parse(ret.data.picture_url).face_url;
          ret.data.pic_urls = JSON.parse(ret.data.picture_url).pic_urls;//游戏截图数组
        }
        catch (ex) {
          //忽略
        }
      }
      return ret.data;
    }
  }
}

//--（交易）钱包收支清单
export async function queryWalletLog(params) {
  let msg = await remote.login({ openid: theOpenId });
  let ret = {};
  if (remote.isSuccess(msg)) {
    console.log("获取钱包收支流水:" + JSON.stringify(params));
    ret = await remote.fetching({ func: "tx.List", items: [] });
  }
  console.log("获取钱包收支流水结果：" + JSON.stringify(ret));
  let theResult = { list: ret.data, pagination: { current: 1, pageSize: 10 } };
  // let theResult= request(`/wallet/getLog?${stringify(params)}`);
  console.log("实际输出格式");
  console.log(theResult);
  return theResult;
  // let list=request(`/wallet/queryLog?${stringify(params)}`);
  // return list;
}

//--钱包流水详情
export async function getWalletLog(params) {
  let msg = await remote.login({ openid: theOpenId });
  let ret = {};
  if (remote.isSuccess(msg)) {
    console.log("获取钱包收支详情:" + JSON.stringify(params));
    ret = await remote.fetching({ func: "tx.GetWallet", items: [params.id] });
  }
  console.log("获取钱包收支详情结果：" + JSON.stringify(ret));
  if (ret.data != null) {
    return ret.data;
  }
  else {
    return ret;
  }
}


//--钱包信息
export async function getWalletInfo(params) {
  let msg = await remote.login({ openid: theOpenId });
  let ret = {};
  if (remote.isSuccess(msg)) {
    console.log("获取钱包信息:" + JSON.stringify(params));
    ret = await remote.fetching({ func: "wallet.Info", items: [] });
  }
  console.log("获取钱包信息结果：" + JSON.stringify(ret));
  return ret;
  //return request(`/wallet/getInfo?${stringify(params)}`);
}

//--账户余额
export async function getBalanceAll(params) {
  let msg = await remote.login({ openid: theOpenId });
  let ret = {};
  if (remote.isSuccess(msg)) {
    console.log("获取余额参数:" + JSON.stringify(params));
    ret = await remote.fetching({ func: "account.BalanceAll", items: [] });
  }
  console.log("获取余额结果：" + JSON.stringify(ret));
  return ret;
  //return request(`/wallet/getInfo?${stringify(params)}`);
}

//--钱包：转出
export async function addWalletPay(params) {
  let msg = await remote.login({ openid: theOpenId });
  let ret = {};
  if (remote.isSuccess(msg)) {
    console.log("钱包转出:");
    // ret=await remote.fetching({func: "tx.Send",items:["tb1qlsnuxc5d5rufuavwgsrw9v96r65rmlwcdkexel",999]});
    ret = await remote.fetching({ func: "tx.Send", items: [params.address, params.value] });
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

/**
 *
 * 从本地获取游戏道具列表
 * @export
 * @param {*} params
 * @returns
 */
export async function getGamePropsList(params) {
  let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
  let result = {};
  if (remote.isSuccess(msg)) {

    if (params == null) {
      params = {
        currentPage: 1,
        pageSize: 10,
        props_id: '',
        props_name: '',
        cid: '',
      };
    };

    result = await remote.fetching({
      func: "prop.LocalList",
      currentPage: params.currentPage,
      pageSize: params.pageSize,
      props_id: typeof (params.props_id) == "undefined" ? '' : params.props_id,
      props_name: typeof (params.props_name) == "undefined" ? '' : params.props_name,
      cid: typeof (params.cid) == "undefined" ? '' : params.cid,
    });
  }
  return result;
  //return request(`/api/gamepropslist?${stringify(params)}`);
}
/**
 *
 * 本地创建游戏道具
 * @export
 * @param {*} params
 * @returns
 */
export async function CreatePropLocal(params) {
  console.log('道具本地创建请求开始');
  console.log(params);
  console.log('道具本地创建请求结束');
  let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
  if (remote.isSuccess(msg)) {
    let res = await remote.fetching({
      func: "prop.CreateLocal",

      props_name: params.props_name,
      props_type: params.props_type,
      cid: params.cid,
      props_desc: params.props_desc,
      icon_url: params.icon_url,
      icon_preview: params.icon_preview,
      pid: params.pid,
      oid: params.oid,
      oper: params.oper,
      prev: params.prev,
      current: params.current,
      gold: params.gold,
      status: params.status,
      cp: params.cp,
      stock: params.stock,
      pro_num: params.pro_num,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt
    });
    if (remote.isSuccess(res)) {
      return res;
    } else {
      return {};
    }
  }
  return {};
  //return request(`/api/gamepropsdetail?${stringify(params)}`);
}

/**
 *
 * 游戏道具上链
 * @export
 * @param {*} params
 * @returns
 */
export async function CreatePropRemote(params) {
  console.log('道具上链请求开始');
  console.log(params);
  console.log('道具上链请求结束');
  let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
  if (remote.isSuccess(msg)) {
    let res = await remote.fetching({ func: "prop.CreateProp", items: [params.pid, params.cid, params.gold] });
    if (remote.isSuccess(res)) {
      return res;
    } else {
      return {};
    }
  }
  return {};
  //return request(`/api/gamepropsdetail?${stringify(params)}`);
}

/**
 *
 * 本地库获取游戏道具的详情
 * @export
 * @param {*} params
 * @returns
 */

export async function getGamePropsDetail(params) {
  //本地库直接读取详情
  let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
  if (remote.isSuccess(msg)) {
    let res = await remote.fetching({ func: "prop.LocalDetail", id: params.id });
    if (remote.isSuccess(res)) {
      return res;
    } else {
      return [];
    }
  }
  return [];
  //return request(`/api/gamepropsdetail?${stringify(params)}`);
}

/**
 * 游戏接口获取道具详情
 * @export
 * @param {*} params
 * @returns
 */
export async function getCpPropsDetail(params) {
  return request(`/api/getcppropsdetail?${stringify(params)}`);
}


/**
 *
 * 游戏厂商获取所有游戏道具
 * @export
 * @param {*} params
 * @returns
 */

export async function getPropsByGame(params) {
  return request(`/api/gameprops?${stringify(params)}`);
}


/**
 *
 * 本地库获取游戏所有列表
 * @export
 * @param {*} params
 * @returns
 */
export async function getAllGameList(params) {
  let msg = await remote.login({ openid: theOpenId });
  let ret = [];
  if (remote.isSuccess(msg)) {
    let res = await remote.fetching({ func: "cp.ListAllRecord" });
    console.log(res);
    if (remote.isSuccess(res)) {
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

