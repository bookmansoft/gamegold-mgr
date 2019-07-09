import { getFundingView } from '@/services/gamegoldapi';

export default {
  namespace: 'fundingview',

  state: {
    data: {
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
      }
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
