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

//--登录以后的用户信息，可修改
let userinfo = { id: -1 };
const salt = "038292cfb50d8361a0feb0e3697461c9";




//--用户
export async function queryUserMgr(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryUserMgr" };
    if (remote.isSuccess(msg)) {
      console.log("从数据库查询用户地址列表address.Filter:" + stringify(params));
      if (params == null) {
        params = {
          currentPage: 1,
          pageSize: 10,
          cp_type: null,
          amount: null,
          max_second: null, //90天(3600*24*90)
        };
      };
      // console.log(45);
      // console.log(JSON.parse(localStorage.userinfo));
      ret = await remote.fetching({
        func: "address.Filter", userinfo: JSON.parse(localStorage.userinfo),
        items: [params.cp_type, params.amount * 100000000, params.max_second * 3600 * 24, params.currentPage, params.pageSize]
      });
    }
    console.log("操作员管理结果列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：queryUserMgr" };
  }
  // return request(`/usermgr/query?${stringify(params)}`);
}


//--操作员登录鉴权
export async function accountLogin(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：accountLogin" };
    //加密
    const crypto = require('crypto');
    var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(params.password + salt);
    let password = sha1.digest("hex");  //加密后的值d
    console.log(password);

    // 调用保存记录的方法
    if (remote.isSuccess(msg)) {
      //先调用链上的保存方法
      console.log("添加操作员:" + JSON.stringify(params));
      let ret = await remote.fetching({
        func: "operator.Login",
        userName: params.userName,
        password: password,
        type: params.type,
      });
      //判断返回值是否正确--增加一个返回值项 userinfo:{id:5} ;其中id为实际的userid
      console.log(ret);
      if (ret.status == "ok") {
        //服务端返回正确结果，例如：{ status: "ok", type: "account", currentAuthority: "admin", userinfo:{ id: 1 } }
        userinfo = ret.userinfo;
        localStorage.userinfo = JSON.stringify(userinfo);//每次提交给服务端的数据
        localStorage.username = params.userName;//页面显示用的数据
        localStorage.currentAuthority=ret.currentAuthority;
      }
      return ret;
    }
    console.log("登录结果：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：accountLogin" };
  }

}


//--新增操作员
export async function addOperator(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：addOperator" };
    //加密
    const crypto = require('crypto');
    var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(params.password + salt);
    let password = sha1.digest("hex");  //加密后的值d
    // 调用保存记录的方法
    if (remote.isSuccess(msg)) {
      //先调用链上的保存方法
      console.log("添加操作员:" + JSON.stringify(params));
      let ret = await remote.fetching({
        func: "operator.CreateRecord", userinfo: JSON.parse(localStorage.userinfo),
        login_name: params.login_name,
        password: password,
        remark: params.remark,
        state: 1,
      });
      //判断返回值是否正确
      console.log(ret);
      return ret;
    }
    console.log("添加操作员结果：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：addOperator" };
  }

}
//--操作员列表
export async function queryOperatorMgr(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryOperatorMgr" };
    if (remote.isSuccess(msg)) {
      console.log("从数据库查询操作员列表operator.ListRecord:" + stringify(params));
      if (params == null) {
        params = {
          currentPage: 1,
          pageSize: 10,
          login_name: '',
          state: '',
        };
      };
      ret = await remote.fetching({
        func: "operator.ListRecord", userinfo: JSON.parse(localStorage.userinfo),
        currentPage: params.currentPage,
        pageSize: params.pageSize,
        login_name: typeof (params.login_name) == "undefined" ? '' : params.login_name,
        state: typeof (params.state) == "undefined" ? '' : params.state,
      });
    }
    console.log("操作员管理结果列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：addOperator" };
  }

}

//--游戏管理
export async function queryGameMgr(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryGameMgr" };
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
        func: "cp.ListRecord", userinfo: JSON.parse(localStorage.userinfo),
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
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：queryGameMgr" };
  }
  //return request(`/gamemgr/query?${stringify(params)}`);
}
//--添加新游戏
// 步骤：
// 首先调用在链上创建的语句
// 如果成功，则调用数据库的插入方法
// 实际调试中，可以先验证插入方法的调用
export async function addGameMgr(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：addGameMgr" };

    // 调用保存记录的方法
    if (remote.isSuccess(msg)) {
      //先调用链上的保存方法
      console.log("添加新游戏:" + JSON.stringify(params));
      ret = await remote.fetching({ func: "cp.Create", userinfo: JSON.parse(localStorage.userinfo), items: [params.cp_name, params.cp_url, params.wallet_addr, params.cp_type] });
      //判断返回值是否正确
      console.log(ret);
      if (ret.code != 0 || ret.data == null) {
        return { code: -1, message: "调用区块链创建游戏失败！" };
      }
      let cp_id = ret.data.cid;//返回的cpid值
      console.log("调用保存记录的方法:" + JSON.stringify(params));
      let retSave = await remote.fetching({
        func: "cp.CreateRecord", userinfo: JSON.parse(localStorage.userinfo),
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
    console.log("添加新游戏结果：" + JSON.stringify(ret));
    return retSave;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：addGameMgr" };
  }

}

//从指定URL中获取游戏内容（已测试通过）
//params.cp_url 准备保存为cp_url的外部URL字段值
export async function getGameFromUrl(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    if (remote.isSuccess(msg)) {
      let data = await remote.fetching({ func: "cp.getGameFromUrl", userinfo: JSON.parse(localStorage.userinfo), cp_url: params.cp_url });
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
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getGameFromUrl" };
  }

}


// 游戏详情
// params.id 查看的页面参数值。（其中params对应于model中的payload）
export async function getGameView(params) {
  try {
    console.log(params.id);
    //接下来好好查询并返回这个页面的数据
    let msg = await remote.login({ openid: theOpenId });
    if (remote.isSuccess(msg)) {
      let ret = await remote.fetching({ func: "cp.Retrieve", userinfo: JSON.parse(localStorage.userinfo), id: params.id });
      if (ret.data === null) {
        return { code: -200, data: null, message: "react service层无返回值。方法名：getGameView" };
      }
      //有数据
      console.log(ret.data);
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
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getGameView" };
  }

}

//--（交易）钱包收支清单
export async function queryWalletLog(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryWalletLog" };
    if (remote.isSuccess(msg)) {
      console.log("获取钱包收支流水:" + JSON.stringify(params));
      ret = await remote.fetching({ func: "tx.List", userinfo: JSON.parse(localStorage.userinfo), items: [],daterange:params.date });
    }
    console.log("获取钱包收支流水结果：" + JSON.stringify(ret));
    let theResult = { list: ret.data, pagination: { current: 1, pageSize: 10 } };

    console.log("实际输出格式");
    console.log(theResult);
    return theResult;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：queryWalletLog" };
  }

}

//--钱包流水详情
export async function getWalletLog(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：getWalletLog" };
    if (remote.isSuccess(msg)) {
      console.log("获取钱包收支详情:" + JSON.stringify(params));
      ret = await remote.fetching({ func: "tx.GetWallet", userinfo: JSON.parse(localStorage.userinfo), items: [params.id] });
    }
    console.log("获取钱包收支详情结果：" + JSON.stringify(ret));
    if (ret.data != null) {
      return ret.data;
    }
    else {
      return ret;
    }
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getWalletLog" };
  }

}



//--获取钱包助记词
export async function getKeyMaster(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：getKeyMaster" };
    if (remote.isSuccess(msg)) {
      console.log("获取钱包助记词信息:" + JSON.stringify(params));
      ret = await remote.fetching({ func: "wallet.KeyMaster", userinfo: JSON.parse(localStorage.userinfo), items: [] });
    }
    console.log("获取钱包助记词信息结果：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getKeyMaster" };
  }

}


//--钱包信息的获取收款地址
export async function getAddressReceive(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：getAddressReceive" };
    if (remote.isSuccess(msg)) {
      console.log("获取钱包信息:" + JSON.stringify(params));
      ret = await remote.fetching({ func: "address.Receive", userinfo: JSON.parse(localStorage.userinfo), items: [] });
    }
    console.log("获取钱包信息结果：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getAddressReceive" };
  }

  //return request(`/wallet/getInfo?${stringify(params)}`);
}

//--钱包信息--由于该接口只能取到主钱包，因此不使用。
export async function getWalletInfo(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：getWalletInfo" };
    if (remote.isSuccess(msg)) {
      console.log("获取钱包信息:" + JSON.stringify(params));
      ret = await remote.fetching({ func: "wallet.Info", userinfo: JSON.parse(localStorage.userinfo), items: [] });
    }
    console.log("获取钱包信息结果：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getWalletInfo" };
  }

  //return request(`/wallet/getInfo?${stringify(params)}`);
}

//--账户余额
export async function getBalanceAll(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：getBalanceAll" };
    if (remote.isSuccess(msg)) {
      console.log("获取余额参数:" + JSON.stringify(params));
      ret = await remote.fetching({ func: "account.BalanceAll", userinfo: JSON.parse(localStorage.userinfo), items: [] });
    }
    console.log("获取余额结果：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getBalanceAll" };
  }
  //return request(`/wallet/getInfo?${stringify(params)}`);
}

//--钱包：转出
export async function addWalletPay(params) {
  try {
    let msg = await remote.login({ openid: theOpenId });
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：addWalletPay" };
    if (remote.isSuccess(msg)) {
      console.log("钱包转出:");
      ret = await remote.fetching({ func: "tx.Send", userinfo: JSON.parse(localStorage.userinfo), items: [params.address, params.value * 100000000] });
    }
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：addWalletPay" };
  }

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
        pid: '',
        props_name: '',
        cid: '',
      };
    };
    result = await remote.fetching({
      func: "prop.LocalList", userinfo: JSON.parse(localStorage.userinfo),
      currentPage: params.currentPage,
      pageSize: params.pageSize,
      id: typeof (params.id) == "undefined" ? '' : params.id,
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
  let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
  if (remote.isSuccess(msg)) {
    let res = await remote.fetching({
      func: "prop.CreateLocal", userinfo: JSON.parse(localStorage.userinfo),
      props_name: params.props_name,
      props_type: params.props_type,
      cid: params.cid,
      props_desc: params.props_desc,
      icon_url: params.icon_url,
      icon_preview: params.icon_preview,
      oid: params.oid,
      status: params.status,
      stock: params.stock,
      pro_num: params.pro_num,
      create_res: params.create_res,
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
 * 游戏道具上链批量
 * @export
 * @param {*} params
 * @returns
 */
export async function PropCreateListRemote(params) {
  let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
  if (remote.isSuccess(msg)) {
    let res = await remote.fetching({
      func: "prop.CreatePropListRemote", userinfo: JSON.parse(localStorage.userinfo),
      id: params.id,
      cid: params.cid,
      oid: params.oid,
      gold: params.gold,
      num: params.num
    });
    if (remote.isSuccess(res)) {
      return { code: 1 };
    } else {
      return { code: 0, msg: res.msg || "生产失败" };
    }
  }
  return { code: 0, msg: "用户登录失败" };
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
    let res = await remote.fetching({ func: "prop.LocalDetail", userinfo: JSON.parse(localStorage.userinfo), id: params.id });
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
 *
 * 本地库获取游戏道具的Oid
 * @export
 * @param {*} params
 * @returns
 */

export async function getPropsOid(params) {
  //本地库直接读取详情
  let msg = await remote.login({ openid: `${Math.random() * 1000000000 | 0}` });
  if (remote.isSuccess(msg)) {
    let res = await remote.fetching({ func: "prop.LocalDetail", userinfo: JSON.parse(localStorage.userinfo), id: params.id });
    if (remote.isSuccess(res)) {
      return res.data.oid || '';
    } else {
      return '';
    }
  }
  return '';
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
 * @returns
 */
export async function getAllGameList() {
  let msg = await remote.login({ openid: theOpenId });
  let ret = [];
  if (remote.isSuccess(msg)) {
    let res = await remote.fetching({ func: "cp.ListAllRecord", userinfo: JSON.parse(localStorage.userinfo) });
    if (remote.isSuccess(res)) {
      for (let i in res['data']) {
        ret.push(res['data'][i]); //属性
      }
    }
  }
  return ret;
  //return request(`/api/allgame?${stringify(params)}`);
}
/**
 *
 * 本地库获取道具根据游戏和状态
 * @export
 * @param {*} params
 * @returns
 */
export async function getAllPropsByParams(params) {
  let msg = await remote.login({ openid: theOpenId });
  let ret = [];
  if (remote.isSuccess(msg)) {
    let res = await remote.fetching({
      func: "prop.getAllPropsByParams", userinfo: JSON.parse(localStorage.userinfo),
      cid: typeof (params.cid) == "undefined" ? '' : params.cid,
      status: typeof (params.status) == "undefined" ? '' : params.status
    });
    if (remote.isSuccess(res)) {
      for (let i in res['data']) {
        ret.push(res['data'][i]); //属性
      }
    }
  }
  return ret;
  //return request(`/api/allgame?${stringify(params)}`);
}
export async function getUserAll(params) {
  return request(`/api/userall?${stringify(params)}`);
}

