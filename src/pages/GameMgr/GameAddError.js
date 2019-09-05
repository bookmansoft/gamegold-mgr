import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import {
  Steps,
  Form,
  Button,
  Card,
  Row,
  Col,
  Divider,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import styles from './style.less';

const onPrev = () => {
  router.push('/gamemgr/gameadd');
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

class GameAddError extends PureComponent {
  render() {
    let msg = this.props.location.query.message;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Result
            type="error"
            title="提交失败"
            description={msg}
            extra=""
            actions={actions}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default GameAddError;
