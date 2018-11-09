import { getGamePropsList, getGamePropsDetail, getPropsByGame , getAllGameList , getUserAll } from '@/services/api';

export default {
  namespace: 'gameprops',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: [],
    gameList: [],
    gamePropsList: [],
    userAllList: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *propsList({ payload }, { call, put }) {
      const response = yield call(getGamePropsList, payload);
      yield put({
        type: 'allList',
        allListData: response,
      });
    },
    *propsDetail({ payload }, { call, put }) {
      const response = yield call(getGamePropsDetail, payload);
      yield put({
        type: 'gamePropsDetail',
        detail: response,
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
    *getAllUser({ payload }, { call, put }) {
      const response = yield call(getUserAll, payload);
      yield put({
        type: 'gameUserAll',
        userAll: response,
      });
    },
  },

  reducers: {
    allList(state, { allListData }) {
      return {
        ...state,
        data: allListData,
      };
    },
    gamePropsDetail(state, { detail }) {
      return {
        ...state,
        detail: detail
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
    gameUserAll(state, {userAll} ) {
      return {
        ...state,
        userAllList: userAll,
      };
    },
  },
};
