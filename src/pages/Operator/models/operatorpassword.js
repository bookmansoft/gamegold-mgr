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
      let ret=yield call(changeOperatorPassword, payload);
      if (ret.code==0 && ret.data!=null) {
        message.success('密码修改成功!');
        return ret;
      }
      else {
        message.error(ret.message);
        return ret;
      }
      
    },
  },

  reducers: {

  },
};
