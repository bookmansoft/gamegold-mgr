import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {addOperator } from '@/services/gamegoldapi';

export default {
  namespace: 'redpacketadd',

  state: {
    data: {
    },
  },

  effects: {
    //保存整个表单的内容（到数据库及全节点）
    *add({ payload }, { call }) {
      try {
        console.log(payload);
        let ret=yield call(addOperator, payload);
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
