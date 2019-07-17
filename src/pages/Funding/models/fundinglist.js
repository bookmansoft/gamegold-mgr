import { addFunding, ListCp, queryFunding } from '@/services/gamegoldapi';

export default {
  namespace: 'fundinglist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    cp_list: [],
  },

  effects: {
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
