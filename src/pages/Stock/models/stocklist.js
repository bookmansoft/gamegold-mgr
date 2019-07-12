import { sendStock, queryMyStock, queryStockBase, ListCpType } from '@/services/gamegoldapi';

export default {
  namespace: 'stocklist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: {},
    myStock: {},
  },

  effects: {
    *detail({ payload }, { call, put }) {
      console.log("stockview model：" + payload.id);
      const response = yield call(getStockView, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
    },

    *mystock({ payload }, { call, put }) {
      const response = yield call(queryMyStock, payload);
      if(response.code == 0) {
        yield put({
          type: 'saveMyStock',
          payload: response.data,
        });
      }
    },

    *sendstock({ payload }, { call, put }) {
      yield call(sendStock, payload);
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
    saveMyStock(state, action) {
      return {
        ...state,
        myStock: action.payload,
      }
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
  },
};
