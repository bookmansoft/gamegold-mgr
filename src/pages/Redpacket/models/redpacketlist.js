import { queryRedpacket,changeRedpacket } from '@/services/gamegoldapi';
import { message } from 'antd';
export default {
  namespace: 'redpacketlist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRedpacket, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *change({ payload }, { call }) {
      let ret=yield call(changeRedpacket, payload);
      if (ret.code==0) {
        message.success('修改成功!');
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
