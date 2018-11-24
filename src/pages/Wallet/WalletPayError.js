import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const onPrev = () => {
  router.push('/wallet/walletmgr');
};
const actions = (
  <Fragment>
    <Button type="primary" onClick={onPrev}>
      返回钱包
    </Button>
  </Fragment>
);

export default () => (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <Result
        type="error"
        title="发送失败"
        description=""
        extra=""
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderWrapper>
);
