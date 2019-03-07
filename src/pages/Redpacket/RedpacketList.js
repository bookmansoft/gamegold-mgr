import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './RedpacketList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ redpacketlist, loading }) => ({
  redpacketlist,
  loading: loading.models.redpacketlist,
}))
@Form.create()
class RedpacketList extends PureComponent {
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
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '活动名称',
      dataIndex: 'act_name',
    },
    {
      title: '活动详情',
      dataIndex: 'act_desc',
    },
    {
      title: '活动序号',
      dataIndex: 'act_sequence',
    },
    {
      title: '总共支出游戏金',
      dataIndex: 'total_gamegold',
    },
    {
      title: '每个红包抽中游戏金',
      dataIndex: 'each_gamegold',
    },
    {
      title: '红包总数量',
      dataIndex: 'total_num',
    },
    {
      title: '每个用户红包数量',
      dataIndex: 'each_num',
    },
    {
      title: '活动开始时间',
      dataIndex: 'act_start_at',
      render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },


    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleDeal(true, record)}>
            编辑
          </a>&nbsp;
          <a onClick={() => router.push('/redpacket/redpacketadd')}>详情</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'redpacketlist/fetch',
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
      type: 'redpacketlist/fetch',
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
      type: 'redpacketlist/fetch',
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
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'redpacketlist/fetch',
        payload: values,
      });
    });
  };

  //更改操作员状态
  handleDeal = (flag, record) => {
    const { dispatch,form } = this.props;
    dispatch({
      type: 'redpacketlist/change',
      payload: { id:record.id,state: (record.state == 1 ? 0 : 1) },
    }).then((ret) => {
      if (ret.code === 0) {
        //以重新提交页面的方式实现状态的更新
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const values = {
            ...fieldsValue,
          };
          this.setState({
            formValues: values,
          });
          dispatch({
            type: 'redpacketlist/fetch',
            payload: values,
          });
        });
      };
    }
    );
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 16, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="操作员登录名：">
              {getFieldDecorator('login_name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态：">
              {getFieldDecorator('state')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">正常</Option>
                  <Option value="0">作废</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      redpacketlist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <PageHeaderWrapper title="积分抽奖活动">
        <Card bordered={false}>
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

export default RedpacketList;
