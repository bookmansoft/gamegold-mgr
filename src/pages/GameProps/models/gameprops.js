import { getGamePropsList, getGamePropsDetail, getPropsByGame , getAllGameList } from '@/services/api';

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
    *getPropsByGame({ payload }, { call, put }) {
      const response = yield call(getPropsByGame, payload);
      yield put({
        type: 'gamePropsByGame',
        propsList: response,
      });
    },
    *getAllGameList({ payload }, { call, put }) {
      const response = yield call(getAllGameList, payload);
      yield put({
        type: 'gameAllGameList',
        gameList: response,
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
    gamePropsByGame(state, { propsList }) {
      return {
        ...state,
        gamePropsList: propsList
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
