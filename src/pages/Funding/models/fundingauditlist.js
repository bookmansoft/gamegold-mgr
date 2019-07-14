import { queryFunding } from '@/services/gamegoldapi';

export default {
  namespace: 'fundingauditlist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFunding, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    //注意这里的data
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
