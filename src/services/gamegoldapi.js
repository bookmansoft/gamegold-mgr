import toolkit from 'gamerpc'
import crypto from 'crypto';
import router from 'umi/router';
import { checkPermissions } from '../components/Authorized/CheckPermissions';
import request from '@/utils/request';
import Cookies from 'js-cookie'
import { Select, message, Drawer, List, Switch, Divider, Icon, Button, Alert, Tooltip } from 'antd';

const salt = "038292cfb50d8361a0feb0e3697461c9";

//创建连接器对象
let remote = new toolkit.gameconn({
    "UrlHead": "http",            //协议选择: http/https
    "webserver": {
      "host": "127.0.0.1",        //开发使用本地ip：127.0.0.1 打包使用远程主机地址 114.115.167.168
      "port": 9901                //远程主机端口
    }
});
//remote.setmode(remote.CommMode.ws);

//test only
remote.watch(info => {
  console.log('收到系统下行消息', JSON.stringify(info));
}, 9999);

remote.events.on('comm', msg=>{
  if(msg.status == 'disconnect' || msg.status == 'error') {
    router.push('/use/login');
  }
});

/**
 * 使用两阶段验证模式进行用户注册的第一步：提交用户名/密码/手机号码，向服务端请求下发手机验证码
 * @param {Object} params {mail, mobile, password, confirm, prefix}
 */
export async function RegisterAuthCode(params) {
  let password = crypto.createHash("sha1").update(params.password + salt).digest("hex");
  let ret = await remote.init().login({
    domain: 'auth2step.CRM',                        //指定验证方式为两阶段认证
    openid: params.mail,                            //用户名称
    openkey: password,                              //用户密码，经过了加密转换
    addrType: 'phone',                              //指定验证方式为手机
    address: `+${params.prefix}${params.mobile}`,   //作为验证地址的手机号码
  });
  
  return { status: "waitingAuthCode" }; //如果返回 ok 则页面将跳转至注册成功页面
}

/**
 * 使用两阶段验证模式进行用户注册的第二步：上行验证码、接收服务端注册结果
 * @param {Object} params {captcha, mail, mobile, password, confirm, prefix}
 */
export async function RegisterSubmit(params) {
  let ret = new Promise(resolve => {
    remote.events.once('logined', result => {
      if(result.code == 0) {
        resolve(afterLogin(true));
      } else {
        resolve(afterLogin(false));
      }
    });
  });
  remote.events.emit('authcode', params.captcha);
  return ret;
}

/**
 * 操作员登录相关操作
 * @param {*} params 
 */
export async function accountLogin(params) {
  try {
    switch(params.type) {
      //使用用户名/密码对方式登录
      case 'account' : {
        return afterLogin(await remote.init().login({ 
          domain: 'authpwd.CRM',
          openid: params.userName,
          openkey: crypto.createHash("sha1").update(params.password + salt).digest("hex"), //将密码做加密转换
        }));
      }

      //使用两阶段验证模式进行用户登录的第一步：上行手机号码，向服务端请求下发手机验证码
      case 'captcha' : {
        //因为还要等待两阶段的第二步才能真正登录, 所以此处不返回 ok
        await remote.init().login({
          domain: 'auth2step.CRM',                        //指定验证方式为两阶段认证
          addrType: 'phone',                              //指定验证方式为手机
          address: `+${params.prefix}${params.mobile}`,   //作为验证地址的手机号码
        });
        message.success('验证码已发送');
        return { status: 'waitingResp' };
      }

      //使用两阶段验证模式进行用户登录的第二步：上行验证码，向服务端请求进行登录
      case 'mobile' : {
        let ret = new Promise(resolve => {
          remote.events.once('logined', result => {
            if(result.code == 0) {
              resolve(afterLogin(true));
            } else {
              resolve(afterLogin(false));
            }
          });
        });
        remote.events.emit('authcode', params.captcha);

        return ret;
      }

      //通过读取 cookie 设置 token 来完成登录设定
      case 'cookie' : {
        return await remoteRelogin();
      }
    }
  } catch (error) {
    console.log(error);
    return afterLogin(false);
  }
}

/***
 *  页面刷新时对连接器进行重置
 */
export async function remoteRelogin() {
  try {
    let openid = sessionStorage.getItem('username'), token = sessionStorage.getItem('token');
    if(!openid || !token) {
      openid = Cookies.get('openid');
      token = Cookies.get('token');
    }
    let ret = await remote.init().setUserInfo({domain: 'auth2step.CRM', openid: openid}).setLB(true);
    if(ret) {
      if(remote.rpcMode == remote.CommMode.ws) {
        await remote.createSocket(); //createSocket时会清除token，因此提前创建
      }
      let result = await remote.setUserInfo({domain: 'auth2step.CRM', openid: openid, token: token}).fetching({func:'login.UserLogin'});
      if(result.code == 0) {
        remote.setUserInfo({openid: result.data.openid, token: result.data.token, currentAuthority: result.data.currentAuthority});
        return afterLogin(true, true); //视为利用缓存重登
      } 
    }
    return afterLogin(false);
  } catch(e) {
    return Promise.reject(e);
  }
}

/**
 * 收到登录请求的应答后，执行后续操作，返回最终的状态值
 * @param {Boolean} result  登录请求是否被批准
 * @param {Boolean} cookie  是页面刷新/关闭重开后利用缓存进行的重登
 */
function afterLogin(result, cookie=false) {
  if (!!result) {
    console.log(`您已成功登录${JSON.stringify(remote.userInfo)}`);
    message.success(`您已成功登录`);

    sessionStorage.setItem('username', remote.userInfo.openid); //页面显示用的数据
    sessionStorage.setItem('token', remote.userInfo.token);
    sessionStorage.setItem('currentAuthority', JSON.stringify(remote.userInfo.currentAuthority || ['user']));

    if(!!sessionStorage.getItem('autoLogin')) {
      //设置 Cookie 以便后续自动登录
      Cookies.set('openid', sessionStorage.getItem('username'), {expires: 1});
      Cookies.set('token', sessionStorage.getItem('token'), {expires: 1});
    } else {
      if(!cookie) {
        //清除 Cookie
        Cookies.remove('openid');
        Cookies.remove('token');
      }
    }

    return { 
      status: "ok", 
      type: "account", 
      currentAuthority: JSON.parse(sessionStorage.getItem('currentAuthority')),
    };
  } else {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.setItem('currentAuthority', JSON.stringify(['guest']));
    //Cookies.remove('openid');
    //Cookies.remove('token');
    return { status: "error" };
  }
}

/**
 * 用户签退，清除状态缓存
 */
export async function accountLogout() {
  //清除 Cookie
  Cookies.remove('openid');
  Cookies.remove('token');
  //清除连接器状态
  remote.init().setUserInfo({domain: 'auth2step.CRM'}, remote.CommStatus.reqLb);
}

/**
 * 修改操作员密码
 * @param {*} params 
 */
export async function changeOperatorPassword(params) {
  try {
    let ret = { code: -200, data: null };
    if (params.newpassword != params.newpassword2) {
      return { code: -10, data: null, message: "两次输入的新密码不一致！" };
    }
    //加密旧密码与新密码
    let oldpassword = crypto.createHash("sha1").update(params.oldpassword + salt).digest("hex");  //加密后的值d
    let newpassword = crypto.createHash("sha1").update(params.newpassword + salt).digest("hex");  //加密后的值d

    //先调用链上的保存方法
    console.log("修改密码:" + JSON.stringify(params));
    ret = await remote.fetching({
      func: "operator.ChangePassword", 
      oldpassword: oldpassword,
      newpassword: newpassword,
    });
    //判断返回值是否正确
    console.log(ret.code, ret.data, ret.message);
    return { code: ret.code, data: ret.data, message: ret.message };
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：changeOperatorPassword" };
  }
}

/**
 * 重置密码，用户选择'忘记密码'时调用
 * @param {*} params 
 */
export async function resetPassword(params) {
  let ret = await remote.fetching({
    func: 'authpwd.resetPassword',
  });
  
  return { status: "resetPassword" };
}

//--用户
export async function queryUserMgr(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryUserMgr" };
    if (params == null) {
      params = {
        currentPage: 1,
        pageSize: 10,
        cp_type: null,
        amount: null,
        max_second: null, //90天(3600*24*90)
      };
    };
    ret = await remote.fetching({
      func: "address.Filter", 
      items: [params.cp_type, params.amount * 100000000, params.max_second * 3600 * 24, params.currentPage, params.pageSize]
    });
    console.log("操作员管理结果列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：queryUserMgr" };
  }
}

export async function queryCurrentUser(params) {
  return {
    name: 'Serati Ma',
    avatar: 'http://114.115.167.168:9701/static/headicon.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  }
}

/**
 * 修改操作员状态
 */
export async function changeOperatorState(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：changeOperatorState" };
    //先调用链上的保存方法
    ret = await remote.fetching({
      func: "operator.ChangeState", 
      id: params.id,
      state: params.state,
    });
    //判断返回值是否正确
    console.log(ret.code, ret.data, ret.message);
    return { code: ret.code, data: ret.data, message: ret.message };
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：changeOperatorState" };
  }
}

/**
 * 操作员列表
 * @param {*} params 
 */
export async function queryOperatorMgr(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryOperatorMgr" };
    if (params == null) {
      params = {
        currentPage: 1,
        pageSize: 10,
        login_name: '',
        state: '',
      };
    };
    ret = await remote.fetching({
      func: "operator.ListRecord", 
      currentPage: params.currentPage,
      pageSize: params.pageSize,
      login_name: params.login_name || '',
      state: params.state || '',
    });
    console.log("操作员管理结果列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误" };
  }
}

//--CpType，实际上没有参数，但必须保证params与前面的代码兼容
export async function ListCpType(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：ListCpType" };
    console.log("从数据库查询游戏列表cp.ListCpType");
    ret = await remote.fetching({
      func: "cp.ListCpType", 
    });
    console.log("游戏类型结果列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：ListCpType" };
  }
}

/**
 * 游戏管理
 * @param {*} params 
 */
export async function queryGameMgr(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryGameMgr" };
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
    console.log("游戏管理结果列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：queryGameMgr" };
  }
}

/**
 * 添加新游戏
 * 首先调用在链上创建的语句, 如果成功，则调用数据库的插入方法
 * 实际调试中，可以先验证插入方法的调用
 * @param {*} params 
 */
export async function addGameMgr(params) {
  try {
    //向主网发起CP注册请求
    let ret = await remote.fetching({
      func: "cp.Create", 
      items: [params.cp_name, params.cp_url, null, params.cp_type, params.invite_share]
    });
    //判断返回值是否正确
    if (ret.code != 0 || ret.data == null) {
      return { code: -1, message: "调用区块链创建游戏失败！" };
    }
    return { code: 0, message: "请求已提交" };
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：addGameMgr" };
  }
}

/**
 * 从指定URL中集采游戏信息
 * @param {*} params 
 * @param {String} params.cp_url 准备保存为cp_url的外部URL字段值
 */
export async function getGameFromUrl(params) {
  try {
    let data = await remote.fetching({ 
      func: "cp.getGameFromUrl", 
      cp_url: `${params.cp_url}/${params.cp_name}` 
    });
    //patch 更改目录层次结构
    data = data.game;
    data.cp_name = params.cp_name;
    data.cp_url = params.cp_url;
    data.invite_share = parseInt(params.use_invite_share) == 1 ? parseInt(params.invite_share) : 0;
    //patch 弥补协议字段差异
    data.cp_text = data.game_title;
    data.develop_name = data.provider;
    data.face_url = data.large_img_url;
    data.cp_desc = data.desc;
    data.cp_version = data.version;
    return data;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getGameFromUrl" };
  }

}


// 游戏详情
// params.id 查看的页面参数值。（其中params对应于model中的payload）
export async function getGameView(params) {
  try {
    let ret = await remote.fetching({ 
      func: "cp.Retrieve", 
      id: params.id 
    });
    if (ret.data === null) {
      return { code: -200, data: null, message: "react service层无返回值。方法名：getGameView" };
    }

    if (!!ret.data.picture_url) {
      try {
        let js = JSON.parse(ret.data.picture_url);
        ret.data.icon_url = js.icon_url;
        ret.data.face_url = js.face_url;
        ret.data.pic_urls = js.pic_urls;//游戏截图数组
      } catch (ex) { }
    }

    return ret.data;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getGameView" };
  }

}

/**
 * （交易）钱包收支清单
 * @param {*} params 
 */
export async function queryWalletLog(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryWalletLog" };
    console.log("获取钱包收支流水:" + JSON.stringify(params));
    if (checkPermissions('admin', sessionStorage.currentAuthority, 'ok', 'error') == 'ok') {
      ret = await remote.fetching({
        func: "tx.List", 
        items: ['default', 1000],
        currentPage: params.currentPage, pageSize: params.pageSize, daterange: params.date
      });
    }
    else {
      ret = await remote.fetching({
        func: "tx.List", 
        items: [null, 1000],
        currentPage: params.currentPage, pageSize: params.pageSize, daterange: params.date
      });
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
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：getWalletLog" };
    console.log("获取钱包收支详情:" + JSON.stringify(params));
    ret = await remote.fetching({ 
      func: "tx.GetWallet", 
      items: [params.id] 
    });
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
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：getKeyMaster" };
    console.log("获取钱包助记词信息:" + JSON.stringify(params));
    ret = await remote.fetching({ 
      func: "wallet.KeyMaster", 
      items: [] 
    });
    console.log("获取钱包助记词信息结果：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getKeyMaster" };
  }
}

/**
 * 获取收款地址
 */
export async function getAddressReceive(params) {
  try {
    let ret = await remote.fetching({ 
      func: "address.Receive", 
      account: params.account, 
    });
    console.log("获取钱包信息结果：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getAddressReceive" };
  }
}

//--钱包信息--由于该接口只能取到主钱包，因此不使用。
export async function getWalletInfo(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：getWalletInfo" };
    console.log("获取钱包信息:" + JSON.stringify(params));
    ret = await remote.fetching({ 
      func: "wallet.Info", 
      items: [] 
    });
    console.log("获取钱包信息结果：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getWalletInfo" };
  }
}

//--账户余额
export async function getBalanceAll(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：getBalanceAll" };
    ret = await remote.fetching({ 
      func: "account.BalanceAll", 
      items: ['default'] 
    });
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getBalanceAll" };
  }
}

//--钱包：转出
export async function addWalletPay(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：addWalletPay" };
    console.log("钱包转出:");
    ret = await remote.fetching({ 
      func: "tx.Send", 
      items: [params.address, parseInt(params.value * 100000), 'default'] 
    });
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
  let result = {};
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
    func: "prop.LocalList", 
    currentPage: params.currentPage,
    pageSize: params.pageSize,
    id: typeof (params.id) == "undefined" ? '' : params.id,
    props_name: typeof (params.props_name) == "undefined" ? '' : params.props_name,
    cid: typeof (params.cid) == "undefined" ? '' : params.cid,
  });
  return result;
}
/**
 *
 * 本地创建游戏道具
 * @export
 * @param {*} params
 * @returns
 */
export async function CreatePropLocal(params) {
  let res = await remote.fetching({
    func: "prop.CreateLocal", 
    props_id: params.props_id,
    props_name: params.props_name,
    props_type: params.props_type,
    cid: params.cid,
    props_desc: params.props_desc,
    icon_url: params.icon_url,
    icon_preview: params.icon_preview,
    oid: params.oid,
    status: params.status,
    props_price: params.props_price,
    props_rank: params.props_rank,
    propsAt: params.propsAt,
  });
  if (remote.isSuccess(res)) {
    return res;
  } else if (res.code == 3) {
    return { code: 3, msg: '道具已经存在' };
  }
  else {
    return { code: 1, msg: res.msg ? res.msg : '创建失败' };
  }
}
/**
 *
 * 本地游戏道具刷新更新
 * @export
 * @param {*} params
 * @returns
 */
export async function EditPropLocal(params) {
  let res = await remote.fetching({
    func: "prop.EditProp", 
    id: params.id,
    props_id: params.props_id,
    status: params.status,
    props_name: params.props_name,
    props_type: params.props_type,
    props_desc: params.props_desc,
    icon_url: params.icon_url,
    icon_preview: params.icon_preview,
    propsAt: params.propsAt,
  });
  if (remote.isSuccess(res)) {
    return { code: 0 };
  } else {
    return { code: 1 };
  }
}

/**
 *
 * 游戏道具上链批量
 * @export
 * @param {*} params
 * @returns
 */
export async function PropCreateListRemote(params) {
  let res = await remote.fetching({
    func: "prop.CreatePropListRemote", 
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

/**
 *
 * 本地库获取游戏道具的详情
 * @export
 * @param {*} params
 * @returns
 */

export async function getGamePropsDetail(params) {
  //本地库直接读取详情
  let res = await remote.fetching({ 
    func: "prop.LocalDetail", 
    id: params.id 
  });
  if (remote.isSuccess(res)) {
    return res;
  } else {
    return [];
  }
}

/**
 * 游戏接口获取道具详情
 * @export
 * @param {*} params
 * @returns
 */
export async function getCpPropsDetail(params) {
  let ret = await remote.fetching({
    func: "prop.getCpPropsDetail", 
    pid: params.pid,
    cp_url: params.cp_url,
    //cp_url: 'http://localhost:9701/mock/cp122907',
  });
  return ret;
}

/**
 * 根据道具id 从游戏接口获取道具详情
 * @export
 * @param {*} params
 * @returns
 */
export async function getGamePropsDetailById(params) {
  let ret = await remote.fetching({
    func: "prop.LocalDetail", 
    id: params.id,
  });
  if (ret.code == 0) {
    ret = await remote.fetching({
      func: "prop.getCpPropsDetail", 
      cp_url: ret.data.cp_url,
      pid: ret.data.props_id,
      //cp_url: 'http://localhost:9701/mock/cp122907',
    });
    return ret;
  }
  return ret;
}

/**
 *
 * 游戏厂商获取所有游戏道具
 * @export
 * @param {*} params
 * @returns
 */
export async function getPropsByGame(params) {
  let ret = await remote.fetching({
    func: "prop.getPropsByGame", 
    cp_url: params.cp_url,
    //cp_url: 'http://localhost:9701/mock/cp122907',
  });
  return ret;
}


/**
 *
 * 本地库获取游戏所有列表
 * @export
 * @returns
 */
export async function getAllGameList() {
  let ret = [];
  let res = await remote.fetching({ 
    func: "prop.ListAllCpRecord", 
  });
  if (remote.isSuccess(res)) {
    for (let i in res['data']) {
      ret.push(res['data'][i]); //属性
    }
  }
  return ret;
}
/**
 *
 * 本地库获取道具根据游戏和状态
 * @export
 * @param {*} params
 * @returns
 */
export async function getAllPropsByParams(params) {
  let ret = [];
  let res = await remote.fetching({
    func: "prop.getAllPropsByParams", 
    cid: typeof (params.cid) == "undefined" ? '' : params.cid
  });
  if (remote.isSuccess(res)) {
    for (let i in res['data']) {
      ret.push(res['data'][i]); //属性
    }
  }
  return ret;
}
/**
 * 道具赠送
 * @export
 * @param {*} params
 * @returns
 */
export async function sendListRemote(params) {
  let res = await remote.fetching({
    func: "prop.PropSendListRemote", 
    id: params.id,
    addr: params.addr
  });
  console.log(res);
  if (remote.isSuccess(res)) {
    return { code: 1 };
  } else {
    return { code: 0, msg: res.msg || "道具赠送失败" };
  }
}

//-------------------------------------------------------

//--新增红包活动
export async function addRedpacket(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：addRedpacket" };

    //先调用链上的保存方法
    console.log("添加红包:" + JSON.stringify(params));
    ret = await remote.fetching({
      func: "redpacket.CreateRecord", 
      act_name: params.act_name,
      act_sequence: params.act_sequence,
      total_gamegold: params.total_gamegold,
      each_gamegold: params.each_gamegold,
      total_num: params.total_num,
      each_num: params.each_num,
      act_desc: params.act_desc,
      act_start_at: new Date(params.act_start_at).getTime() / 1000,
      act_end_at: new Date(params.act_end_at).getTime() / 1000,
    });
    //判断返回值是否正确
    console.log(ret);
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误" };
  }
}

//--修改红包活动
export async function changeRedpacket(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：changeRedpacket" };

    //先调用链上的保存方法
    console.log("修改红包活动:" + JSON.stringify(params));
    ret = await remote.fetching({
      func: "redpacket.UpdateRecord", 
      id: params.id,
      act_name: params.act_name,
      act_sequence: params.act_sequence,
      total_gamegold: params.total_gamegold,
      each_gamegold: params.each_gamegold,
      total_num: params.total_num,
      each_num: params.each_num,
      act_desc: params.act_desc,
      act_start_at: new Date(params.act_start_at).getTime() / 1000,
      act_end_at: new Date(params.act_end_at).getTime() / 1000,
    });
    //判断返回值是否正确
    console.log(ret.code, ret.data, ret.message);
    return { code: ret.code, data: ret.data, message: ret.message };
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：changeOperatorState" };
  }
}
//-- 红包活动详情
export async function getRedpacket(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：getWalletLog" };
    console.log("获取钱包收支详情:" + JSON.stringify(params));
    ret = await remote.fetching({
      func: "redpacket.Retrieve", 
      id: params.id,
    });
    console.log("获取钱包收支详情结果：" + JSON.stringify(ret));
    if (ret.data != null) {
      return ret.data;
    }
    else {
      return ret;
    }
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getRedpacket" };
  }

}

//--红包活动列表
export async function queryRedpacket(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryRedpacket" };
    if (params == null) {
      params = {
        currentPage: 1,
        pageSize: 10,
        login_name: '',
        state: '',
      };
    };
    ret = await remote.fetching({
      func: "redpacket.ListRecord", 
      currentPage: params.currentPage,
      pageSize: params.pageSize,
      login_name: typeof (params.login_name) == "undefined" ? '' : params.login_name,
      state: typeof (params.state) == "undefined" ? '' : params.state,
    });
    console.log("操作员管理结果列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：queryRedpacket" };
  }

}

//--获奖奖品列表
export async function queryPrize(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryPrize" };
    if (params == null) {
      params = {
        currentPage: 1,
        pageSize: 10,
        login_name: '',
        state: '',
      };
    };
    ret = await remote.fetching({
      func: "prize.ListRecord", 
      currentPage: params.currentPage,
      pageSize: params.pageSize,
    });
    console.log("操作员管理结果列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：queryPrize" };
  }
}

/**
 * 查询一级市场待售列表
 * @param {*} params 
 */
export async function queryStockList(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名 queryStockList" };
    if (params == null) {
      params = {
        currentPage: 1,
        pageSize: 10,
      };
    };
    ret = await remote.fetching({
      func: "cpfunding.StockList", 
      currentPage: params.currentPage,
      pageSize: params.pageSize,
    });
    console.log("一级市场待售列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名 queryStockList" };
  }
}

/**
 * 购买凭证
 * @param {*} params 
 */
export async function stockPurchase(params) {
  try {
    let ret = await remote.fetching({
      func: "cpfunding.StockPurchase",
      cid: params.cid,
      num: params.num, 
    });
    console.log("一级市场待售列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名 stockPurchase" };
  }
}

//--众筹查询（各种条件）
export async function queryFunding(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：queryFunding" };
    if (params == null) {
      params = {
        currentPage: 1,
        pageSize: 10,
      };
    };
    ret = await remote.fetching({
      func: "cpfunding.ListRecord", 
      ...params
    });
    console.log("众筹管理结果列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：queryFunding" };
  }
}

//--众筹页面调用的ListCp方法
export async function ListCp(params) {
  try {
    let ret = { code: -200, data: null, message: "react service层无返回值。方法名：ListCp" };
    console.log("从数据库查询游戏列表cpfunding.ListCp");
    ret = await remote.fetching({
      func: "cpfunding.ListCp", 
    });
    console.log("游戏结果列表：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：ListCp" };
  }
}
//增加众筹信息
export async function addFunding(params) {
  try {
    console.log("调用保存记录的方法:" + JSON.stringify(params));
    let retSave = await remote.fetching({
      func: "cpfunding.CreateRecord", 
      cpid: params.data.id,
      stock_num: params.state.stock_num,
      stock_amount: params.state.stock_amount,
      total_amount: params.state.stock_num * params.state.stock_amount,
      stock_rmb: params.state.stock_amount / 100000,//人民币值初始为1000分
      audit_state_id: 1,
      audit_text: '',
      modify_date: new Date().getTime() / 1000,
      cp_name: params.data.cp_name,
      cp_text: params.data.cp_text,
      cp_type: params.data.cp_type,
      cp_url: params.data.cp_url,
      develop_name: params.data.develop_name,
      develop_text: params.state.develop_text,
      cid: params.data.cp_id,
    });
    console.log("增加众筹信息结果：" + JSON.stringify(retSave));
    return retSave;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：addFunding" };
  }
}

/**
 * 查询众筹详情
 * @param {Number} params.id 查看的众筹项目的编号
 */
export async function getFundingView(params) {
  try {
    //接下来好好查询并返回这个页面的数据
    let ret = await remote.fetching({ 
      func: "cpfunding.Retrieve", 
      id: params.id 
    });
    if (!ret.data) {
      return { code: -200, data: null, message: "react service层无返回值。方法名：getFundingView" };
    }

    //调用链，获取剩余数量
    let retCp = await remote.fetching({ 
      func: "cp.ById", 
      items: [ret.data.cid] 
    });
    console.log("cp信息", retCp);
    if (!!retCp.data.stock) {
      ret.data.reside_num = retCp.data.stock.sum;
    }
    else {
      ret.data.residue = 0;//暂时设置为0
    }
    console.log("最后的结果：", ret.data);
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：getFundingView" };
  }
}

/**
 * 查询凭证交易明细
 * 1. 查询节点上存储的凭证交易流水 流水类型 厂商编码: stock.record type (cid height conditions)
 * eg: stock.record 1 e1297470-5d09-11e9-b07a-2d9ee061d761 300 "[['txid','a656db273e4850c6113de4b7fd7c619798db90363d7e25d179183b4720db4292']]"
 * 
 * 2. 查询钱包上存储的凭证交易流水 流水类型 厂商编码: stock.record.wallet type (cid height conditions)
 *    如果要查询特定用户的流水，可以在 conditions 中添加 addr 查询参数
 * eg: stock.record.wallet 1 e1297470-5d09-11e9-b07a-2d9ee061d761 300 "[['txid','a656db273e4850c6113de4b7fd7c619798db90363d7e25d179183b4720db4292']]"
 * 交易记录枚举类型
   const $RecordType = {
      Offer: 1,           //发行凭证
      Purchase: 2,        //购买发行的凭证
      Send: 3,            //无偿转让凭证
      Bonus: 4,           //凭证分成
      Ads: 5,             //媒体分成
      Bid: 6,             //有偿转让凭证
      Auction: 7,         //购买有偿转让的凭证
   }
 * @param {*} params 
 */
export async function stockRecord(params) {
  try {
    console.log("查询凭证交易明细参数:" + JSON.stringify(params));
    let ret = await remote.fetching({
      func: "cpfunding.StockRecord", 
      items: [params.type, params.cid, 0, ""],
    });
    console.log("查询凭证交易明细结果：" + JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：stockList" };
  }
}

/**
 * 众筹信息审核
 */
export async function auditFunding(params) {
  try {
    console.log("调用更新记录的方法:" + JSON.stringify(params));

    let ret = await remote.fetching({
      func: "cpfunding.UpdateRecord", 

      id: params.id,
      stock_rmb: params.stock_rmb,//人民币值初始为1000分
      audit_state_id: params.audit_state_id,
      audit_text: params.audit_text,
    });

    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：addGameMgr" };
  }
}

/**
 * 向指定地址发送凭证
 */
export async function sendStock(params) {
  try {
    await remote.fetching({
      func: "cpstockbase.sendStock", 
      params: {
        address: params.address,
        num: params.num,
        cid: params.cid,
        srcAddr: params.srcAddr,
      }
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 拍卖凭证
 */
export async function bidStock(params) {
  try {
    await remote.fetching({
      func: "cpstockbase.bidStock", 
      params: {
        price: params.price,
        num: params.num,
        cid: params.cid,
        srcAddr: params.srcAddr,
      }
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 竞拍凭证
 */
export async function auctionStock(params) {
  try {
    await remote.fetching({
      func: "cpstockbase.auctionStock", 
      params: {
        cid: params.cid,
        srcAddr: params.srcAddr,
        num: params.num,
        price: params.price,
      }
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 查询我持有的凭证
 */
export async function queryMyStock(params) {
  try {
    if (!params) {
      params = {
        currentPage: 1,
        pageSize: 10,
      };
    };

    let ret = await remote.fetching({
      func: "cpstockbase.MyStock", 
      currentPage: params.currentPage,
      pageSize: params.pageSize,
    });

    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：queryStockBase" };
  }
}

/**
 * 二级市场查询
 * @param {*} params 
 */
export async function queryStockBase(params) {
  try {
    if (!params) {
      params = {
        currentPage: 1,
        pageSize: 10,
      };
    };

    let ret = await remote.fetching({
      func: "cpstockbase.BidList", 
      currentPage: params.currentPage,
      pageSize: params.pageSize,
    });

    return ret;
  } catch (error) {
    console.log(error);
    return { code: -100, data: null, message: "react service层错误。方法名：queryStockBase" };
  }
}

/**
 * 生成订单
 */
export async function payOrder(params) {
  try {
    await remote.fetching({
      func: "cp.payOrder", 
      params: {
        cid: params.cid,
        amount: params.amount,
      }
    });
  } catch (error) {
    console.log(error);
  }
}

