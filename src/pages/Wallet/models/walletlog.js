import { getWalletLog } from '@/services/gamegoldapi';

export default {
  namespace: 'walletlog',

  state: {
    data: {
        tradeTypeName: '',
        tradeGcd: 0,
        createAt: '',
        relateAccount: '',
        tradeRemark: ''
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
