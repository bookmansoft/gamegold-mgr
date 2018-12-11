import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '游戏金链 百谷王',
          title: '游戏金链',
          href: 'http://www.gamegold.xin',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 百谷王 游戏金链
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
