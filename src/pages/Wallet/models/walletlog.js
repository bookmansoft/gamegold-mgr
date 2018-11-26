import { getWalletLog } from '@/services/gamegoldapi';

export default {
  namespace: 'walletlog',

  state: {
    data: {
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getWalletLog, payload);
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
