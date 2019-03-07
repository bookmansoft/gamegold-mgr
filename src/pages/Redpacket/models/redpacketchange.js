import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {changeRedpacket,getRedpacket } from '@/services/gamegoldapi';

export default {
  namespace: 'redpacketchange',

  state: {
    data: {
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      console.log("redpacketchange model："+payload.id);
      const response = yield call(getRedpacket, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      return response;
    },

    //保存整个表单的内容（到数据库及全节点）
    *change({ payload }, { call }) {
      try {
        console.log(payload);
        let ret=yield call(changeRedpacket, payload);
        // console.log(ret);
        return ret;
      }
      catch(ex) {
        console.log(ex);
        return {code:-2}
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
