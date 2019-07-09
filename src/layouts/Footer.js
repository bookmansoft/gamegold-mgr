import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'Vallnet Bookman Gamegold 百谷王 百晓生',
          title: 'Vallnet CRM',
          href: 'http://www.vallnet.cn',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018~2020 百谷王科技
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
