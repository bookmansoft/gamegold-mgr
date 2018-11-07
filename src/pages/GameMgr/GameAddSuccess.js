import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const onPrev = () => {
  router.push('/gamemgr/gamelist');
};
const actions = (
  <Fragment>
    <Button type="primary" onClick={onPrev}>
      返回列表
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
        type="success"
        title="提交成功"
        description="请耐心等待审核，审核通过后游戏将直接上架。"
        extra=""
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderWrapper>
);
