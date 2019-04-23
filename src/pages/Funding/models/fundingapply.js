import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { addGameMgr, getGameFromUrl } from '@/services/gamegoldapi';

//此名称域为新增使用（已经不存在编辑的可能性了）
export default {
  namespace: 'fundingapply',

  state: {
    step: {
    },
    data: {
    },
    stock_num:1,
    stock_amount:1,
    cplist: [],
  },

  effects: {
    //从url中获取信息
    *fetch({ payload }, { call, put }) {
      const response = yield call(getGameFromUrl, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    //保存整个表单的内容（到数据库及全节点）
    *add({ payload }, { call }) {
      let ret = yield call(addGameMgr, payload);
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
