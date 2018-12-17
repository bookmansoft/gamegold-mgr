import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


export default () => (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <Result
        type="success"
        title="密码修改成功"
        description="请注销后使用新密码重新登录"
        extra=""
        actions=""
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderWrapper>
);
