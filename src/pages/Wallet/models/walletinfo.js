import { getWalletInfo,getAddressReceive } from '@/services/gamegoldapi';

export default {
  namespace: 'walletinfo',

  state: {
    data: {
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getAddressReceive, payload);
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
