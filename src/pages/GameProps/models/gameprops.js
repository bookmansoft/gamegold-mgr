import { getGamePropsList, getGamePropsDetail } from '@/services/api';

export default {
  namespace: 'gameprops',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: {},
  },

  effects: {
    *propsList({ payload }, { call, put }) {
      const response = yield call(getGamePropsList, payload);
      yield put({
        type: 'gamePropsList',
        payload: response,
      });
    },
    *propsDetail({ payload }, { call, put }) {
      const response = yield call(getGamePropsDetail, payload);
      yield put({
        type: 'gamePropsDetail',
        detail: response,
      });
    },
  },

  reducers: {
    gamePropsList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    gamePropsDetail(state, { detail }) {
      return {
        ...state,
        detail: detail
      };
    },
  },
};
