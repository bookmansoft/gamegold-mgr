import { getGameView,getStockView } from '@/services/gamegoldapi';

export default {
  namespace: 'stockview',

  state: {
    data: {
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log("stockview model："+payload.id);
      const response = yield call(getStockView, payload);
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
