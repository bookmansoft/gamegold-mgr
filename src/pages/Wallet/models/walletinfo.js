import { getWalletInfo } from '@/services/gamegoldapi';

export default {
  namespace: 'walletinfo',

  state: {
    data: {
        walletAccount: '',
        createAt: '',
        walletSecure: '',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getWalletInfo, payload);
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
