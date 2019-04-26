import { getFundingView } from '@/services/gamegoldapi';

export default {
  namespace: 'fundingauditview',

  state: {
    data: {
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
