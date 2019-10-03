import { queryPrize,getRedpacket } from '@/services/gamegoldapi';
import { message } from 'antd';
export default {
  namespace: 'prizelist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    prize: {
      
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPrize, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *get({ payload }, { call,put }) {
      const response = yield call(getRedpacket, payload);
      yield put({
        type: 'savePrize',
        payload: response,
      });
      return response;
      
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },

    savePrize(state, action) {
      return {
        ...state,
        prize: action.payload,
      };
    },
  },
};
