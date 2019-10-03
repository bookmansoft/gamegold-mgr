import { changeOperatorPassword, queryOperatorMgr,changeOperatorState } from '@/services/gamegoldapi';
import { message } from 'antd';

export default {
  namespace: 'operatorlist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *changepwd({ payload }, { call }) {
      let ret=yield call(changeOperatorPassword, payload);
      if (ret.code==0 && !!ret.data) {
        message.success('密码修改成功!');
        return ret;
      }
      else {
        message.error(ret.message);
        return ret;
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryOperatorMgr, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *change({ payload }, { call }) {
      let ret=yield call(changeOperatorState, payload);
      if (ret.code==0) {
        message.success('状态修改成功!');
        return ret;
      }
      else {
        message.error(ret.message);
        return ret;
      }
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
