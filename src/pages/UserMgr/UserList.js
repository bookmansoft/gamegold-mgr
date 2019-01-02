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
import UserListStandardTable from '@/components/UserListStandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import styles from './UserList.less';

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
@connect(({ userlist, loading }) => ({
  userlist,
  loading: loading.models.userlist,
}))
@Form.create()
class UserList extends PureComponent {
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
      title: '用户钱包地址',
      dataIndex: 'addr',
    },
    {
      title: '玩过的游戏类型',
      dataIndex: 'game',
      render(val) {
        if (!!val) {
          return val;
        } else {
          return 0;
        }
      },
    },
    {
      title: '消费金额(吨)',
      dataIndex: 'sum',
      render: val => <span>{val / 100000000}</span>,
    },
    {
      title: '最后消费时间',
      dataIndex: 'lastBuy',
      render(val) {
        if (!!val) {
          return val;
        } else {
          return '-';
        }
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userlist/fetch',
    });
    dispatch({
      type: 'userlist/fetchCpType'
    });
  }
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

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
      type: 'userlist/fetch',
      payload: params,
    });
  };

  handlePropsSend = () => {
    const { dispatch } = this.props;
    let allRows = this.state.selectedRows;
    if(allRows.length > 0){
      let addr = new Array();
      let $idx = 0;
      for (let $value of allRows) {
        addr[$idx] = $value.addr;
        $idx++;
      }
      addr = JSON.stringify(addr);
      router.push('/gameprops/present/'+addr);

    }else{
      Modal.error({
        title: '错误',
        content: '请选择用户！',
      });
      return;
    }
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'userlist/fetch',
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
        type: 'userlist/fetch',
        payload: values,
      });
    });
  };

  //赠送道具
  handleDeal = (flag, record) => {
    console.log(record.addr);
    this.props.history.push("../gameprops/present?address=" + record.addr);
  };
  //显示下拉框
  renderOptions = () => {
    if (this.props.userlist.cp_type_list != null) {
      return this.props.userlist.cp_type_list.map(element =>
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
        <Row gutter={{ md: 16, lg: 24, xl: 48 }}>

          <Col md={16} sm={24}>
            <FormItem label="选择游戏类型：">
              {getFieldDecorator('cp_type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  {this.renderOptions()}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} />
          <Col md={16} sm={24}>
            <FormItem label="最小游戏金：">
              {getFieldDecorator('amount')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24} />
          <Col md={16} sm={24}>
            <FormItem label="有效期（天）：">
              {getFieldDecorator('max_second')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
      userlist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <PageHeaderWrapper title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator} />
            <UserListStandardTable
              selectedRows={selectedRows}
              rowKey={'rank'}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              handlePropsSend={this.handlePropsSend}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
