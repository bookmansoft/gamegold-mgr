import { queryWalletLog,getWalletInfo,getBalanceAll } from '@/services/gamegoldapi';

export default {
  namespace: 'walletmgr',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    info: {

    },
  },

  effects: {
    //分两部分，先修改data再修改info
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryWalletLog, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },

      //修改info
    *fetchBalanceAll({ payload }, { call, put }) {
      const response = yield call(getBalanceAll, payload);
      yield put({
        type: 'saveInfo',
        payload: response,
        // payload: {balanceAll:999},
      });
    },
  },

  reducers: {
    saveData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveInfo(state, action) {
      return {
        ...state,
        info: action.payload,
      };
    },
  },
};
