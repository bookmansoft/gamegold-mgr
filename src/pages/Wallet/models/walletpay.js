import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';
import { addWalletPay } from '@/services/gamegoldapi';

export default {
  namespace: 'walletpay',

  state: {

  },

  effects: {
    *add({ payload }, { call }) {
      let ret=yield call(addWalletPay, payload);
      message.success('提交成功!');
      return ret;
    },
  },

  reducers: {

  },
};
