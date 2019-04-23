import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Steps,
  Radio,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './FundingList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ fundinglist, loading }) => ({
  fundinglist,
  loading: loading.models.fundinglist,
}))
@Form.create()
class FundingList extends PureComponent {
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
      title: '流水号',
      dataIndex: 'id',
    },
    {
      title: '游戏ID',
      dataIndex: 'cp_id',
    },
    {
      title: '游戏全名',
      dataIndex: 'cp_text',
    },
    {
      title: '游戏类型',
      dataIndex: 'cp_type',
    },
    {
      title: '游戏状态',
      dataIndex: 'cp_state',
      render: val => <span>{(val == '0') ? '未上线' : '正常运营'}</span>
    },
    {
      title: '添加时间',
      dataIndex: 'publish_time',
      render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleView(true, record)}>详情</a>&nbsp;
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fundinglist/fetch',
    });
    dispatch({
      type: 'fundinglist/fetchCpType'
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
      type: 'fundinglist/fetch',
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
      type: 'fundinglist/fetch',
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
        type: 'fundinglist/fetch',
        payload: values,
      });
    });
  };

  //查看页面
  handleView = (flag, record) => {
    console.log(record);
    // this.props.history.push("./fundingview?id="+record.cp_id);
    this.props.history.push("./fundingview?id=" + record.id);
  };

  //赠送道具
  handleDeal = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  //显示下拉框
  renderOptions = () => {
    // console.log(this.props.fundinglist.data);
    if (this.props.fundinglist.cp_type_list != null) {
      return this.props.fundinglist.cp_type_list.map(element =>
        <Option key={element.id} value={element.cp_type_id}> {element.cp_type_id}</Option>);
    }
    else {
      return "";
    }

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col span={6}>
            <FormItem label="游戏全名：">
              {getFieldDecorator('cp_text')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="游戏类型：">
              {getFieldDecorator('cp_type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  {this.renderOptions()}
                </Select>
              )}
            </FormItem>
          </Col>
          {/* <Col span={6}>
            <FormItem label="状态：">
              {getFieldDecorator('cp_state')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">待审核</Option>
                  <Option value="2">已上架</Option>
                  <Option value="3">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
          <Col span={6}>
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
      fundinglist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <PageHeaderWrapper title="游戏列表">
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

export default FundingList;
