import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const onDetail=() => {
  router.push('/wallet/walletlog'+window.location.search)
}
const onPrev = () => {
  router.push('/wallet/walletmgr');
};
const actions = (
  <Fragment>
    <Button type="primary" onClick={onPrev}>
      返回钱包
    </Button>
    <Button onClick={onDetail}>
      查看详情
    </Button>
  </Fragment>
);

export default () => (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <Result
        type="success"
        title="发送成功"
        description=""
        extra=""
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderWrapper>
);
