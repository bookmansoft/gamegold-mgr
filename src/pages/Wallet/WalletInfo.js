import { checkPermissions } from '../../components/Authorized/CheckPermissions';
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
  state = {
    formValues: {},
    account: 'default',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    console.log(location.protocol+'//'+location.host+'/qrcode/');
    dispatch({
      type: 'walletinfo/fetch',
      payload: {},
    });
  }

  handleBack = () => {
    router.push('/wallet/step-form');
  };

  handleRefresh = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'walletinfo/fetch',
        payload: values,
      });
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleRefresh} layout="inline">
        <Row gutter={{ md: 16, lg: 24, xl: 48 }}>
          <Col md={6} sm={9}>
            <FormItem label="">
              {getFieldDecorator('account')(<Input placeholder="指定账户名称" />)}
            </FormItem>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">刷新</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      walletinfo: { data },
      loading,
    } = this.props;

    return (
      <PageHeaderWrapper title="收款地址">
          <Card bordered={false}>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                收款地址：{data!=null && data.data}
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                <b>收款二维码：</b>
                {this.renderForm()}
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                <img src={data!=null && (location.protocol+'//'+location.hostname+':9701/qrcode/'+data.data)} width="300" height="300"/>
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={4} xs={8}>
                { checkPermissions('admin', JSON.parse(sessionStorage.getItem('currentAuthority')), 'ok', 'error') == 'ok' && <Button type="primary" onClick={this.handleBack}>立即备份</Button> }
              </Col>
            </Row>
          </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WalletInfo;
