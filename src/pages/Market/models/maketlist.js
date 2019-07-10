import { queryStockList, stockPurchase, ListCpType } from '@/services/gamegoldapi';

export default {
  namespace: 'marketlist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStockList, payload);
      if(!!response && response.code == 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },

    *purchase({ payload }, { call, put }) {
      return yield call(stockPurchase, payload);
    },

    *fetchCpType({ payload }, { call, put }) {
      const response = yield call(ListCpType, payload);
      yield put({
        type: 'saveCpType',
        payload: response,
      });
    },
  },

  reducers: {
    //注意这里的data
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    //修改另外一部分
    saveCpType(state, action) {
      return {
        ...state,
        cp_type_list: action.payload,
      };
    },
  },
};
