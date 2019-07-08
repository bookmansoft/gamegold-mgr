import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';
import { getAddressReceive, addWalletPay } from '@/services/gamegoldapi';

export default {
  namespace: 'walletpay',

  state: {
    data: {address: '',}
  },

  effects: {
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
      if (ret.code==0 && ret.data!=null && ret.data.hash!=null) {
        return ret.data;
      }
      else {
        return null;
      }
    },
  },

  reducers: {
    saveaddress(state, action) {
      return {
        ...state,
        data: {address: action.payload},
      };
    },
  },
};
