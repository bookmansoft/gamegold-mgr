import { 
  getPropsByGame, getAllGameList, PropCreateListRemote,getBalanceAll,sendListRemote
} from '@/services/gamegoldapi';

export default {
  namespace: 'gameprops',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    gameList: [],
    gamePropsList: [],
  },

  effects: {
    *propsList({ payload }, { call, put }) {
      const response = yield call(getGamePropsList, payload);
      yield put({
        type: 'allList',
        allListData: response,
      });
    },
    *getPropsByGame({ payload }, { call, put }) {
      const response = yield call(getPropsByGame, payload);
      yield put({
        type: 'gamePropsByGame',
        gamePropsList: response,
      });
    },
    *getAllGameList({ payload }, { call, put }) {
      const response = yield call(getAllGameList, payload);
      yield put({
        type: 'gameAllGameList',
        gameList: response,
      });
    },
    *propcreatelistremote({ payload }, { call }) {
      const res = yield call(PropCreateListRemote, payload);
      return res;
    },
    *getBalanceAll({ payload }, { call}) {
      const res = yield call(getBalanceAll, payload);
      return res;
    },
    *sendlistremote({ payload }, { call }) {
      const res = yield call(sendListRemote, payload);
      return res;
    },
  },

  reducers: {
    allList(state, { allListData }) {
      return {
        ...state,
        data: allListData,
      };
    },
    gamePropsByGame(state, { gamePropsList }) {
      return {
        ...state,
        gamePropsList: gamePropsList
      };
    },
    gameAllGameList(state, { gameList }) {
      return {
        ...state,
        gameList: gameList
      };
    },
  },
};
