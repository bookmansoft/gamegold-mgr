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
@connect(({ walletmgr, loading }) => ({
  walletmgr,
  loading: loading.models.walletmgr,
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
      title: '分类',
      dataIndex: 'category',
    },
    {
      title: '金额(GDD)',
      dataIndex: 'amount',
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
      type: 'walletmgr/fetch',
      payload: { address: '' }
    });
    dispatch({
      type: 'walletmgr/fetchBalanceAll',
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
      address: { adress },
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'walletmgr/fetch',
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
      type: 'walletmgr/fetch',
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
        type: 'walletmgr/fetch',
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

  //查看钱包信息
  handleViewWallet = () => {
    router.push('/wallet/walletinfo');
  };

  //备份钱包信息
  handleBackupWallet = () => {
    router.push('/wallet/step-form');
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
          <Col md={11} sm={9}>
            <label>收支流水</label>
          </Col>
          <Col md={11} sm={15}>
            <FormItem {...formItemLayout} label='选择日期'>
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.date.required' }),
                  },
                ],
              })(
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={[
                    formatMessage({ id: 'form.date.placeholder.start' }),
                    formatMessage({ id: 'form.date.placeholder.end' }),
                  ]}
                />
              )}
            </FormItem>
          </Col>
          <Col md={2} sm={4}>
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
      walletmgr: { data, info },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <PageHeaderWrapper title="钱包管理">
        <Card bordered={false}>
          <Row>
            <Col sm={18} xs={12}>
              钱包管理
              </Col>
            <Col sm={6} xs={12}>
              {localStorage.currentAuthority == 'admin' && <Button type="primary" onClick={() => this.handleBackupWallet()}>
                备份钱包</Button>}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={() => this.handleViewWallet()}>
                查看钱包信息
                </Button>
            </Col>
          </Row>
          <Divider style={{ marginBottom: 16 }} />
          <Row>
            <Col sm={24} xs={24}>可用余额</Col>
          </Row>
          <Row>
            <Col sm={4} xs={8}>
              {(info.data != null) && JSON.stringify(info.data.confirmed / 100000000)} GDD
              </Col>
            <Col sm={4} xs={8}>
              <Button type="primary">
                转入
                </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => this.handlePay()}>
                转出
                </Button>
            </Col>
          </Row>
        </Card>

        <Card bordered={false} style={{ marginTop: 24 }}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator} />
            <SimpleTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={null}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default WalletMgr;
