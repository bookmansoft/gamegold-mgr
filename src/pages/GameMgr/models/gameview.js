import { getGameView } from '@/services/gamegoldapi';

export default {
  namespace: 'gameview',

  state: {
    data: {
      gameName: '',
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
        console.log("gameview 14");
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
