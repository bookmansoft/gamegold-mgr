import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { addFunding, ListCp } from '@/services/gamegoldapi';

export default {
  namespace: 'fundingapply',

  state: {
    step: {
    },
    cp_list: [],
  },

  effects: {
    *fetchCp({ payload }, { call, put }) {
      console.log(30);
      const response = yield call(ListCp, payload);
      yield put({
        type: 'saveCp',
        payload: response,
      });
    },
    //保存整个表单的内容（到数据库）
    *add({ payload }, { call }) {
      let ret = yield call(addFunding, payload);
      return ret;
    },

  },

  reducers: {
    saveCp(state, action) {
      return {
        ...state,
        cp_list: action.payload,
      };
    },
    updateInfo_stock_amount(state,action) {
      return {
        ...state,
        stock_amount:parseInt(action.payload),
      };
    },
    updateInfo_stock_num(state,action) {
      return {
        ...state,
        stock_num:parseInt(action.payload),
      };
    },

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
