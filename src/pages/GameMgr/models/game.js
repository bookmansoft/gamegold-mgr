import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';
import { addGameMgr } from '@/services/gamegoldapi';

//此名称域为新增和编辑共用
export default {
  namespace: 'game',

  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
  },

  effects: {
    *add({ payload }, { call }) {
      console.log(payload);
      let ret=yield call(addGameMgr, payload);
      return ret;
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
  },
};
