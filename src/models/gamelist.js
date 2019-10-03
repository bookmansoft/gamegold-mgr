import { 
  getPropsByGame, 
  getAllGameList, 
  PropCreateListRemote,
  getBalanceAll,
  sendListRemote,
  getGuiderAddress, 
  changeGame, 
  addGameMgr, 
  getGameView, 
  getGameFromUrl, 
  payOrder, 
  queryGameMgr, 
  ListCpType 
} from '@/services/gamegoldapi';

export default {
  namespace: 'gamelist',

  state: {
    //从游戏厂商获取的集采信息
    record: {},         
    //从中台查询而得的CP对象
    gameRecord: {},
    //从中台查询而得的CP列表
    data: {
      list: [],
      pagination: {},
    },
    gameList: [],
    gamePropsList: [],
  },

  effects: {
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
    //从游戏厂商获取集采信息
    *fetchGame({ payload }, { call, put }) {
      const response = yield call(getGameFromUrl, payload);
      yield put({
        type: 'saveGame',   //reducer 的名称，注意不要和 effect 同名，会因混淆而造成死循环
        payload: response,
      });
    },
    *addGame({ payload }, { call }) {
      let ret=yield call(addGameMgr, payload);
      return ret;
    },
    *setstatus({ payload }, { call }) {
      yield call(changeGame, payload);
    },
    *guiderAddr({ payload }, { call }) {
      return yield call(getGuiderAddress, payload);
    },
    *getGameRecord({ payload }, { call, put }) {
      const response = yield call(getGameView, payload);
      yield put({
        type: 'saveGameRecord',
        payload: response,
      });
      return response;
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
    saveGame(state, action) {
      return {
        ...state,
        record: action.payload,
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
