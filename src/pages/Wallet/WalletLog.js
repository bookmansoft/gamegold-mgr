import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './WalletLog.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ walletlog, loading }) => ({
  walletlog,
  loading: loading.models.walletlog,
}))
@Form.create()
class WalletLog extends PureComponent {



  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'walletlog/fetch',
    });
  }







  render() {
    const {
      walletlog: { data },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper title="流水详情">
          <Card bordered={false}>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                <b>交易详情：</b>
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={8} xs={12}>
                交易类型：{data.tradeTypeName}
              </Col>
              <Col sm={8} xs={12}>
                交易GCD数量：{data.tradeGcd}
              </Col>
              <Col sm={8} xs={12}>
                交易时间：{data.createAt}
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>对方钱包地址：{data.relateAccount}</Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>交易备注：{data.tradeRemark}</Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={4} xs={8}>
                <Button type="primary">
                  返回钱包
                </Button> 
              </Col>
            </Row>
          </Card>



      </PageHeaderWrapper>
    );
  }
}

export default WalletLog;
