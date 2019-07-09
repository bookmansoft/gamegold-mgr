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
      if(response.code == 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
        return response.data;
      } else {
        return null;
      }
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
