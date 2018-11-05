import { getAllMessage } from '@/services/api';

export default {
  namespace: 'message',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *allmessageFetch({ payload }, { call, put }) {
      const response = yield call(getAllMessage, payload);
      yield put({
        type: 'allmessage',
        payload: response,
      });
    },
  },
  reducers: {
    allmessage(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
