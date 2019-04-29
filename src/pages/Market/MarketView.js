import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Steps,
  Card,
  Popover,
  Divider,
  Modal,
  Form,
  Input,

} from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './MarketView.less';
import { Pie } from '@/components/Charts';
import SimpleTable from '@/components/SimpleTable';


const FormItem = Form.Item;
const { Step } = Steps;


const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ marketview, loading }) => ({
  marketview,
  loading: loading.models.marketview,
}))
@Form.create()
class MarketView extends Component {

  renderImg = (text) => {
    if (text && text.length) {
      const imgs = text.map((item, index) =>
        <div><img width={300} src={item} key={index} /><br /></div>
      )
      return imgs;
    }
  }
  state = {
    visible: false, //发布更新表单可见性
    operationkey: 'tab1',
    stepDirection: 'horizontal',
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
      title: '金额(Kg)',
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
  //显示发布更新表单
  showModal = () => {
    this.setState({ visible: true });
  }
  //隐藏发布更新表单
  handleCancel = () => {
    this.setState({ visible: false });
  }
  //提交发布更新表单
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('此处收到表单数据: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  //传递引用
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  handleBack = () => {
    history.back();
  };

  componentDidMount() {
    const { dispatch } = this.props;
    console.log(this.props.location.query.id);
    dispatch({
      type: 'marketview/fetch',
      payload: { id: this.props.location.query.id },//这里
    });
    dispatch({
      type: 'marketview/fetchTableData',
      payload: { address: '' }
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

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
    const { stepDirection, operationkey } = this.state;
    const {
      marketview: { data,tableData },
      loading
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <PageHeaderWrapper
        title="分销详情"
        action={null}
        content={null}
        extraContent={null}
        tabList={null}
      >
        <Card style={{ marginBottom: 16 }} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>基本信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
          <Col span={8}>
              游戏中文名：{data.cp_text}
            </Col>
            <Col span={8}>
              游戏类型：{data.cp_type}
            </Col>
            <Col span={8}>
              开发者：{data.develop_name}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={24}>游戏详情页：{data.cp_url}</Col>
          </Row>


        </Card>
        <Card style={{ marginBottom: 16 }} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>销售状态</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={4}>
              <Pie percent={10} subTitle={null} total="10%" height={120} />
            </Col>
            <Col span={8} style={{ marginBottom: 16 }}>
              已认购数量：
            </Col>
            <Col span={8} style={{ marginBottom: 16 }}>
              未认购数量：
            </Col>
            <Col span={8}>
              截止时间：{moment(data.sell_limit_date * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
        </Card>

        {tableData != null && tableData.list != null &&
          <Card bordered={false} style={{ marginTop: 24 }}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator} />
              <SimpleTable
                selectedRows={selectedRows}
                loading={loading}
                data={tableData.list}
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

export default MarketView;
