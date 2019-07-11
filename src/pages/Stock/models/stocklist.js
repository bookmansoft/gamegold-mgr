import { queryStockBase, ListCpType } from '@/services/gamegoldapi';

export default {
  namespace: 'stocklist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: {},
  },

  effects: {
    *detail({ payload }, { call, put }) {
      console.log("stockview model："+payload.id);
      const response = yield call(getStockView, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
    },

    *fetch({ payload }, { call, put }) {
      const response = yield call(queryStockBase, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
  },
};
