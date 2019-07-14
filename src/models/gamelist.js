import { addGameMgr, getGameView, getGameFromUrl, payOrder, queryGameMgr, ListCpType } from '@/services/gamegoldapi';

export default {
  namespace: 'gamelist',

  state: {
    record: {},
    gameRecord: {},
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //从url中获取信息
    *fetchGame({ payload }, { call, put }) {
      const response = yield call(getGameFromUrl, payload);
      yield put({
        type: 'fetchGame',
        payload: response,
      });
    },
    *addGame({ payload }, { call }) {
      let ret=yield call(addGameMgr, payload);
      return ret;
    },
    *getGameRecord({ payload }, { call, put }) {
      const response = yield call(getGameView, payload);
      yield put({
        type: 'saveGameRecord',
        payload: response,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryGameMgr, payload);
      if(response.code == 0) {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },

    *payOrder({ payload }, { call, put }) {
      yield call(payOrder, payload);
    },

    *fetchCpType({ payload }, { call, put }) {
      const response = yield call(ListCpType, payload);
      yield put({
        type: 'saveCpType',
        payload: response,
      });
    },
  },

  reducers: {
    fetchGame(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveGameRecord(state, action) {
      return {
        ...state,
        gameRecord: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCpType(state, action) {
      return {
        ...state,
        cp_type_list: action.payload,
      };
    },
  },
};
