import { getFundingView,stockRecord } from '@/services/gamegoldapi';

export default {
  namespace: 'marketview',

  state: {
    data: {
    },
    tableData: {
      list: [],
      pagination: {},
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log("getFundingView model："+payload.id);
      const response = yield call(getFundingView, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      return response;
    },

    *fetchTableData({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(stockRecord, payload);
      yield put({
        type: 'saveTableData',
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
    saveTableData(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
  },
};
