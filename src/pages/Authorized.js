import React from 'react';
import Redirect from 'umi/redirect';
import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '@/utils/Authorized';
import { getAuthority } from '@/utils/authority';
import RenderAuthorized from '@/components/Authorized';
import { remoteInit } from '@/services/gamegoldapi';

/**
 * 每次页面刷新时，会重新进行授权验证。在此对连接器做必要的重置工作
 */
remoteInit().then(ret=>{
  console.log('刷新重登:', JSON.stringify(ret));

  reloadAuthorized();
  if(!ret || ret.status != 'ok') {
    routerRedux.replace('/use/login');
  }
}).catch(e=>{
  console.log(e.message);

  reloadAuthorized();
  routerRedux.replace('/use/login');
});

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({ children }) => (
  <Authorized authority={children.props.route.authority} noMatch={<Redirect to="/user/login" />}>
    {children}
  </Authorized>
);
