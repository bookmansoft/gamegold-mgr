import { getGameView } from '@/services/gamegoldapi';

export default {
  namespace: 'gameview',

  state: {
    data: {
      gameName: 'a',
    }
  },

  effects: {
    *fetch(_, { call, put }) {
      console.log("fetch thomas");
      const response = yield call(getGameView);
      console.log(JSON.stringify(response));
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
