import { queryPrize,getRedpacket } from '@/services/gamegoldapi';
import { message } from 'antd';
export default {
  namespace: 'prizelist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
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
      console.log("redpacketchange model："+payload.id);
      const response = yield call(getRedpacket, payload);
      yield put({
        type: 'save',
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
  },
};
