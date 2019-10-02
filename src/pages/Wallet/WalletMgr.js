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
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './WalletMgr.less';

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
class WalletMgr extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '时间',
      dataIndex: 'time',
      render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '描述',
      dataIndex: 'label',
    },
    {
      title: '类型',
      dataIndex: 'category',
    },
    {
      title: '金额(千克)',
      dataIndex: 'amount',
      render: val => <span>{parseInt(val * 1000000 + 0.5) / 1000}</span>
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleView(record)}>交易详情</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'walletinfo/fetchMgr',
      payload: { address: '' }
    });
    dispatch({
      type: 'walletinfo/fetchBalanceAll',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'walletinfo/fetchMgr',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'walletinfo/fetchMgr',
      payload: {},
    });
  };

  handleSearch = e => {
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
        type: 'walletinfo/fetchMgr',
        payload: values,
      });
    });
  };

  //赠送道具
  handleDeal = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  //查看详情
  handleView = (record) => {
    router.push('/wallet/walletlog?id=' + record.txid);
  };

  //备份钱包信息
  handleBackupWallet = () => {
    router.push('/wallet/step-form');
  };

  //转入
  handleReceive = () => {
    router.push('/wallet/walletinfo');
  };
  //转出
  handlePay = () => {
    router.push('/wallet/walletpay');
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 8 },
        md: { span: 6 },
      },
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 16, lg: 24, xl: 48 }}>
          <Col md={20} sm={20}>
            <label>收支流水</label>
          </Col>
          <Col md={4} sm={4}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      walletinfo: { data, info },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <PageHeaderWrapper title={formatMessage({id: 'menu.wallet.walletmgr'})}>
        <Card bordered={false}>
          <Row>
            <Col sm={6} xs={12}>
              { 
                checkPermissions('admin', JSON.parse(sessionStorage.getItem('currentAuthority')), 'ok', 'error') == 'ok' 
                && <Button type="primary" onClick={() => this.handleBackupWallet()}>备份钱包</Button>
              }&nbsp;&nbsp;
              <Button type="primary" onClick={() => this.handleReceive()}>转入</Button>&nbsp;&nbsp;
              <Button type="primary" onClick={() => this.handlePay()}>转出</Button>
            </Col>
          </Row>
          <Divider style={{ marginBottom: 16 }} />
          <Row>
            <Col sm={24} xs={24}>已确认交易余额:&nbsp;{!!info && !!info.data && JSON.stringify(info.data.confirmed / 100000)} 千克</Col>
          </Row>
          <Row>
            <Col sm={8} xs={8}>
              未确认交易余额:&nbsp;{!!info && !!info.data && JSON.stringify((info.data.unconfirmed - info.data.confirmed) / 100000)} 千克
            </Col>
          </Row>
        </Card>
        {!!data && !!data.list &&
          <Card bordered={false} style={{ marginTop: 24 }}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} />
              <SimpleTable
                selectedRows={selectedRows}
                loading={loading}
                data={data.list}
                columns={this.columns}
                onSelectRow={null}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>}

      </PageHeaderWrapper>
    );
  }
}

export default WalletMgr;
