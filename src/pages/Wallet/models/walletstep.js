import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';

export default {
  namespace: 'walletstep',

  state: {
      remenberWord: '东南西北中发梅兰竹菊葱蒜',
      checkRemenberWord:'x',
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      let ret=yield call(fakeSubmitForm, payload);
      message.success('提交成功');
      return ret;
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/wallet/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      let ret=yield call(fakeSubmitForm, payload);
      message.success('提交成功');
      return ret;
    },
  },

  reducers: {
    appendText(state, { payload }) {
      //payload.theText
      payload.checkRemenberWord="xxx";//payload.step.checkRemenberWord+payload.step.appendText;
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
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
