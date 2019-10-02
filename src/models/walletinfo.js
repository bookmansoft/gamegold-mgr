import { getKeyMaster, queryWalletLog, getBalanceAll, addWalletPay, getWalletLog, getWalletInfo, getAddressReceive} from '@/services/gamegoldapi';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { fakeSubmitForm } from '@/services/api';

export default {
  namespace: 'walletinfo',

  state: {
    data: {
    },
    logData: {
    },
    pay: {address: '',},
    items: {
      list: [],
      pagination: {},
    },
    info: {
    },
    //这是模型参数的一部分，在查看交易详情时候传入交易地址。以下是一个有效的测试地址
    address: 'b8b6681ca6ee4614321c8d34a5b3edf8c5a9fb49b44375024e55d84eea57840d',
    rememberWord: '',
    checkRememberWord:'',
    steps: {},
  },

  effects: {
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/wallet/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      let ret=yield call(fakeSubmitForm, payload);
      message.success('提交成功');
      return ret;
    },
    //初始页面使用
    *fetchSteps({ payload }, { call,put }) {
      try {
        console.log('walletstep fetch');
        const response = yield call(getKeyMaster, payload);
        console.log(response);
        if (!!response.data && !!response.data.mnemonic) {
          //符合条件时才传递
          let orignRememberWord=response.data.mnemonic.phrase;
          // console.log("43:初始化文本");
          // console.log(orignRememberWord);
          //转化为去掉空格的格式
          let rememberWordArray=orignRememberWord.split(" ");
          let rememberWord=rememberWordArray[0]+rememberWordArray[1]+rememberWordArray[2]
            +rememberWordArray[3]+rememberWordArray[4]+rememberWordArray[5]
            +rememberWordArray[6]+rememberWordArray[7]+rememberWordArray[8]
            +rememberWordArray[9]+rememberWordArray[10]+rememberWordArray[11];
          yield put({
            type: 'saveSteps',
            payload: {
              rememberWord:rememberWord,
              checkRememberWord: '',
            },
          });
        }
      }
      catch (ex) {
        console.log(ex);
      }
    },
    //分两部分，先修改data再修改info
    *fetchMgr({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(queryWalletLog, payload);
      yield put({
        type: 'saveItems',
        payload: response,
      });
    },
    *fetchBalanceAll({ payload }, { call, put }) {
      const response = yield call(getBalanceAll, payload);
      yield put({
        type: 'saveInfo',
        payload: response,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAddressReceive, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchLog({ payload }, { call, put }) {
      const response = yield call(getWalletLog, payload);
      yield put({
        type: 'saveLog',
        payload: response,
      });
    },
    *getaddress({ payload }, { call, put }) {
      const response = yield call(getAddressReceive, payload);
      if(response.code == 0) {
        yield put({
          type: 'saveaddress',
          payload: response.data,
        });
      }
    },

    *add({ payload }, { call }) {
      let ret = yield call(addWalletPay, payload);
      message.success('提交成功!');
      if (ret.code==0 && !!ret.data && !!ret.data.hash) {
        return ret.data;
      }
      else {
        return null;
      }
    },
  },

  reducers: {
    saveSteps(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    appendText(state, { payload }) {
      console.log(payload.theText);
      
      state.checkRememberWord=state.checkRememberWord+payload.theText;
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    saveItems(state, action) {
      return {
        ...state,
        items: action.payload,
      };
    },
    saveInfo(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveLog(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveaddress(state, action) {
      return {
        ...state,
        data: {address: action.payload},
      };
    },
  },
};
