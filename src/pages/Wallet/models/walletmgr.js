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
    //这是模型参数的一部分，在查看交易详情时候传入交易地址。以下是一个有效的测试地址
    address: 'b8b6681ca6ee4614321c8d34a5b3edf8c5a9fb49b44375024e55d84eea57840d',
  },

  effects: {
    //分两部分，先修改data再修改info
    *fetch({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(queryWalletLog, payload);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },

      //修改info
    *fetchBalanceAll({ payload }, { call, put }) {
      console.log(payload);
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
