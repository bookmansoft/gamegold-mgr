import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';
import { getKeyMaster} from '@/services/gamegoldapi';

export default {
  namespace: 'walletstep',

  state: {
      rememberWord: '',
      checkRememberWord:'',
      data: {},
  },

  effects: {
    // *submitRegularForm({ payload }, { call }) {
    //   let ret=yield call(fakeSubmitForm, payload);
    //   message.success('提交成功');
    //   return ret;
    // },
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


    //初始页面使用
    *fetch({ payload }, { call,put }) {
      try {
        console.log('walletstep fetch');
        const response = yield call(getKeyMaster, payload);
        console.log(response);
        if (response.data!=null && response.data.mnemonic!=null) {
          //符合条件时才传递
          let orignRememberWord=response.data.mnemonic.phrase;
          // console.log("43:初始化文本");
          // console.log(orignRememberWord);
          //转化为去掉空格的格式
          let rememberWordArray=orignRememberWord.split(" ");
          let rememberWord=rememberWordArray[0]+rememberWordArray[1]+rememberWordArray[2]
            +rememberWordArray[3]+rememberWordArray[4]+rememberWordArray[5]
            +rememberWordArray[6]+rememberWordArray[7]+rememberWordArray[8]
            +rememberWordArray[9]+rememberWordArray[10]+rememberWordArray[11];
          yield put({
            type: 'save',
            payload: {
              rememberWord:rememberWord,
              checkRememberWord: '',
            },
          });
        }
      }
      catch (ex) {
        console.log(ex);
      }
    }
  },

  reducers: {
    // fetch对应的代码，只在step1（即info）显示使用。
    save(state, { payload }) {
      // console.log(payload);
      return {
        ...state,
        ...payload,
      };
    },

    appendText(state, { payload }) {
      console.log(payload.theText);
      
      state.checkRememberWord=state.checkRememberWord+payload.theText;
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
