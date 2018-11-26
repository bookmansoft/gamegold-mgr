import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import router from 'umi/router';
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
      payload: {id:this.props.location.query.id},//这里传入交易id值
    });
  }

  handleBack = () => {
    history.back();
  };

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
                <h3><b>交易详情</b></h3>
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                交易流水：{data.txid}
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={8} xs={12}>
                交易类型：{(data.details!=null) && (data.details[0].category)}
              </Col>
              <Col sm={8} xs={12}>
                交易GCD数量：{data.amount}
              </Col>
              <Col sm={8} xs={12}>
                交易时间：{moment(data.time).format('YYYY-MM-DD HH:mm:ss')}
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>对方钱包地址：{(data.details!=null) && (data.details[0].address)}</Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>交易备注：{(data.details!=null) && (data.details[0].label)}</Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={4} xs={8}>
                <Button type="primary" onClick={this.handleBack}>
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
