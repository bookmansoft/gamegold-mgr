import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
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

import styles from './WalletInfo.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ walletinfo, loading }) => ({
  walletinfo,
  loading: loading.models.walletinfo,
}))
@Form.create()
class WalletInfo extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'walletinfo/fetch',
    });
  }
  handleBack = () => {
    router.push('/wallet/step-form');
  };

  render() {
    const {
      walletinfo: { data },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper title="钱包信息">
          <Card bordered={false}>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                <b>钱包信息：</b>
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                收款地址：{data!=null && data.data}
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                钱包安全：未备份(todo)
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={4} xs={8}>
              {localStorage.currentAuthority == 'admin' &&<Button type="primary" onClick={this.handleBack}>
                  立即备份</Button>}
                
              </Col>
            </Row>
          </Card>



      </PageHeaderWrapper>
    );
  }
}

export default WalletInfo;
