import { stockRecord, queryStockList, stockPurchase, ListCpType } from '@/services/gamegoldapi';

export default {
  namespace: 'marketlist',

  state: {
    stockMap: {},
    data: {
      list: [],
      pagination: {},
    },

    tableData: {
      list: [],
      pagination: {},
    }
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

    *fetchTableData({ payload }, { call, put }) {
      const response = yield call(stockRecord, payload);
      if(response.code == 0) {
        yield put({
          type: 'saveTableData',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      //生成反向索引表，以便详情页面直接引用
      action.payload.list.map(item => {
        state.stockMap[item.cpid] = item;
      });
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
    saveTableData(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
  },
};
