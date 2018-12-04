import { getGamePropsList, getGamePropsDetail,getCpPropsDetail, getPropsByGame , getAllGameList , getUserAll ,CreatePropLocal,CreatePropRemote,getAllPropsByParams} from '@/services/gamegoldapi';

export default {
  namespace: 'gameprops',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    propsDetail: [],
    cpPropsDetail: [],
    gameList: [],
    gamePropsList: [],
    userAllList: {
      list: [],
      pagination: {},
    },
    propByParams:[]
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
    *cpPropsDetail({ payload }, { call, put }) {
      const response = yield call(getCpPropsDetail, payload);
      yield put({
        type: 'getCpPropsDetail',
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
    *getAllPropsByParams({ payload }, { call, put }) {
      const response = yield call(getAllPropsByParams, payload);
      yield put({
        type: 'propsByParams',
        propByParams: response,
      });
    },
    *getAllUser({ payload }, { call, put }) {
      const response = yield call(getUserAll, payload);
      yield put({
        type: 'gameUserAll',
        userAll: response,
      });
    },
    *createproplocal({ payload }, { call }) {
      const res = yield call(CreatePropLocal, payload);
      return res;
    },
    *createpropremote({ payload }, { call }) {
      const res = yield call(CreatePropRemote, payload);
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
    gamePropsDetail(state, { detail }) {
      return {
        ...state,
        propsDetail: detail
      };
    },
    getCpPropsDetail(state, { detail }) {
      return {
        ...state,
        cpPropsDetail: detail
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
    propsByParams(state, { propByParams }) {
      return {
        ...state,
        propByParams: propByParams
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
