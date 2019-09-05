import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const onPrev = () => {
  router.push('/funding/fundingapply');
};
const actions = (
  <Fragment>
    <Button type="primary" onClick={onPrev}>
      返回重新提交
    </Button>
    <Button>
      查看详情
    </Button>
  </Fragment>
);

export default () => (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <Result
        type="error"
        title="提交失败"
        description="错误信息：您提交的信息不符合规范，请核实后重新提交！"
        extra=""
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderWrapper>
);
