import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { addFunding, getGameView,ListCp } from '@/services/gamegoldapi';

//此名称域为新增使用（已经不存在编辑的可能性了）
export default {
  namespace: 'fundingapply',

  state: {
    step: {
    },
    data: {
    },
    cp_list: [],
  },

  effects: {
    //从url中获取信息
    *fetch({ payload }, { call, put }) {
      const response = yield call(getGameView, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCp({ payload }, { call, put }) {
      console.log(30);
      const response = yield call(ListCp, payload);
      yield put({
        type: 'saveCp',
        payload: response,
      });
    },
    //保存整个表单的内容（到数据库及全节点）
    *add({ payload }, { call }) {
      console.log(37,payload);
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
