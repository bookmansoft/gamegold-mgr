import { getGamePropsList, getGamePropsDetail,getPropsOid,getCpPropsDetail,getGamePropsDetailById, getPropsByGame , getAllGameList , queryUserMgr ,CreatePropLocal,EditPropLocal,
  PropCreateListRemote,getAllPropsByParams,getWalletInfo,sendListRemote} from '@/services/gamegoldapi';

export default {
  namespace: 'gameprops',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    propsDetail: [],
    gameList: [],
    gamePropsList: [],
    userAllList: {
      list: [],
      pagination: {},
    },
    propByParams:[],
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
    *propsOid({ payload }, { call }) {
      const res = yield call(getPropsOid, payload);
      return res;
    },
    *cpPropsDetail({ payload }, { call, put }) {

      const res = yield call(getCpPropsDetail, payload);
      return res;
    },
    *cpPropsDetailById({ payload }, { call }) {
      const response = yield call(getGamePropsDetailById, payload);
      return response;
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
    *getAllPropsByParamsReturn({ payload }, { call }) {
      const response = yield call(getAllPropsByParams, payload);
      return response;
    },
    *getAllUser({ payload }, { call, put }) {
      const response = yield call(queryUserMgr, payload);
      yield put({
        type: 'gameUserAll',
        userAll: response,
      });
    },
    *createproplocal({ payload }, { call }) {
      const res = yield call(CreatePropLocal, payload);
      return res;
    },
    *editproplocal({ payload }, { call }) {
      const res = yield call(EditPropLocal, payload);
      return res;
    },
    *propcreatelistremote({ payload }, { call }) {
      const res = yield call(PropCreateListRemote, payload);
      return res;
    },
    *getwalletinfo({ payload }, { call}) {
      const res = yield call(getWalletInfo, payload);
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
    gamePropsDetail(state, { detail }) {
      return {
        ...state,
        propsDetail: detail
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
    }
  },
};
