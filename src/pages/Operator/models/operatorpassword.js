import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';
import { changeOperatorPassword } from '@/services/gamegoldapi';

export default {
  namespace: 'operatorpassword',

  state: {

  },

  effects: {
    *change({ payload }, { call }) {
      console.log("line 15");
      let ret=yield call(changeOperatorPassword, payload);
      message.success('提交成功!');
      if (ret.code==0 && ret.data!=null && ret.data.hash!=null) {
        return ret.data;
      }
      else {
        return null;
      }
      
    },
  },

  reducers: {

  },
};
