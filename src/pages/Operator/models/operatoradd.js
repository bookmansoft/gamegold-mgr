import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';
import { addGameMgr,getGameFromUrl } from '@/services/gamegoldapi';

export default {
  namespace: 'operatoradd',

  state: {
    data: {
    },
  },

  effects: {
    //保存整个表单的内容（到数据库及全节点）
    *add({ payload }, { call }) {
      let ret=yield call(addOperator, payload);
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
