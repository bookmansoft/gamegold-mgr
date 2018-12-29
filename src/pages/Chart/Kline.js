import React from 'react';
import Link from 'umi/link';
import { formatMessage } from "umi/locale";
import { Card } from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
export default () => (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <iframe src="http://localhost:9101/client/echart/kline/index.html" frameborder="0" width="100%" height="600px" scrolling="no" />
    </Card>
  </PageHeaderWrapper>
);



