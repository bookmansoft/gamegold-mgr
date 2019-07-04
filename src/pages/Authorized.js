import React from 'react';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';
import { remoteInit } from '@/services/gamegoldapi';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

/**
 * 每次页面刷新时，会重新进行授权验证。在此对连接器做必要的重置工作
 */
remoteInit();

export default ({ children }) => (
  <Authorized authority={children.props.route.authority} noMatch={<Redirect to="/user/login" />}>
    {children}
  </Authorized>
);
