import { getGameView,getGameFromUrl } from '@/services/gamegoldapi';

export default {
  namespace: 'fundingauditview',

  state: {
    data: {
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log("fundingauditview model："+payload.id);
      const response = yield call(getGameView, payload);
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
