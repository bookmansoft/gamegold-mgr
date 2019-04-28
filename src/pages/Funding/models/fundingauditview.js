import { getFundingView,auditFunding } from '@/services/gamegoldapi';

export default {
  namespace: 'fundingauditview',

  state: {
    data: {
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log("getFundingView model："+payload.id);
      const response = yield call(getFundingView, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    //审核更新整个表单的内容（到数据库及全节点）
    *audit({ payload }, { call }) {
      let ret = yield call(auditFunding, payload.state);
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
  },
};
