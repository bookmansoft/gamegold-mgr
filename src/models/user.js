import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { query as queryUsers } from '@/services/user';
import { RegisterAuthCode, RegisterSubmit, queryUserMgr, queryCurrentUser } from '@/services/gamegoldapi';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    status: undefined,
    users: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *authcode({ payload }, { call, put }) {
      const response = yield call(RegisterAuthCode, payload);
      yield put({
        type: 'authcodeHandle',
        payload: response,
      });
    },
    *register({ payload }, { call, put }) {
      const response = yield call(RegisterSubmit, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
    *getUsers({ payload }, { call, put }) {
      const response = yield call(queryUserMgr, payload);
      yield put({
        type: 'saveUsers',
        payload: response,
      });
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrentUser);
      yield put({
        type: 'saveCurrentUser',
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
    saveUsers(state, action) {
      return {
        ...state,
        users: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
