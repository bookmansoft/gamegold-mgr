import { auditFunding, getFundingView, addFunding, ListCp, queryFunding } from '@/services/gamegoldapi';

export default {
  namespace: 'fundinglist',

  state: {
    auditvlew: {
    },
    record: {
    },
    audit: {
      list: [],
      pagination: {},
    },
    data: {
      list: [],
      pagination: {},
    },
    cp_list: [],
  },

  effects: {
    *auditview({ payload }, { call, put }) {
      const response = yield call(getFundingView, payload);
      if(response.code == 0) {
        yield put({
          type: 'saveAuditview',
          payload: response.data,
        });
      }
    },
    *audit({ payload }, { call }) {
      let ret = yield call(auditFunding, payload.state);
      return ret;
    },
    *record({ payload }, { call, put }) {
      const response = yield call(getFundingView, payload);
      console.log('getFundingView return:', response);
      if(response.code == 0) {
        yield put({
          type: 'saveRec',
          payload: response.data,
        });
      }
    },
    *fetchAudit({ payload }, { call, put }) {
      const response = yield call(queryFunding, payload);
      yield put({
        type: 'saveAudit',
        payload: response,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFunding, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCp({ payload }, { call, put }) {
      const response = yield call(ListCp, payload);
      yield put({
        type: 'saveCp',
        payload: response,
      });
    },
    //保存整个表单的内容（到数据库）
    *newFunding({ payload }, { call }) {
      let ret = yield call(addFunding, payload);
      return ret;
    },
  },

  reducers: {
    saveAuditview(state, action) {
      return {
        ...state,
        auditvlew: action.payload,
      };
    },
    saveRec(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
    saveAudit(state, action) {
      return {
        ...state,
        audit: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCp(state, action) {
      return {
        ...state,
        cp_list: action.payload,
      };
    },
  },
};
