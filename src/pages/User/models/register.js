import { fakeRegister } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { RegisterAuthCode, RegisterSubmit } from '@/services/gamegoldapi';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *authcode({ payload }, { call, put }) {
      const response = yield call(RegisterAuthCode, payload);
      yield put({
        type: 'authcodeHandle',
        payload: response,
      });
    },
    *submit({ payload }, { call, put }) {
      const response = yield call(RegisterSubmit, payload);
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
      setAuthority(payload.currentAuthority);
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
