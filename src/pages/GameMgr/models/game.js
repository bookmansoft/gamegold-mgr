import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';
import { addGameMgr,getGameFromUrl } from '@/services/gamegoldapi';

//此名称域为新增使用（已经不存在编辑的可能性了）
export default {
  namespace: 'game',

  state: {
    step: {
    },
    data: {
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response=yield call(getGameFromUrl,payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *add({ payload }, { call }) {
      //console.log(payload);
      let ret=yield call(addGameMgr, payload);
      return ret;
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
  },
};
