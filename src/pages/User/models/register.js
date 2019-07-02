import { fakeRegister } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { getAuthCode, login2step } from '@/services/gamegoldapi';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *authcode({ payload }, { call, put }) {
      const response = yield call(getAuthCode, payload);
      yield put({
        type: 'authcodeHandle',
        payload: response,
      });
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(login2step, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    authcodeHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
