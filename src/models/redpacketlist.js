import { addRedpacket, getRedpacket, queryRedpacket, changeRedpacket } from '@/services/gamegoldapi';
import { message } from 'antd';

export default {
  namespace: 'redpacketlist',

  state: {
    view: {
    },
    record: {
    },
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *add({ payload }, { call }) {
      try {
        let ret = yield call(addRedpacket, payload);
        yield put({
          type: 'saveRec',
          payload: ret.result,
        });
        return ret;
      }
      catch(ex) {
        return {code:-2}
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRedpacket, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *getView({ payload }, { call, put }) {
      const response = yield call(getRedpacket, payload);
      yield put({
        type: 'saveView',
        payload: response,
      });
      return response;
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
    saveView(state, action) {
      return {
        ...state,
        view: action.payload,
      };
    },
    saveRec(state, action) {
      return {
        ...state,
        record: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
