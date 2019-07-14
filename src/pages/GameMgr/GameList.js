import { formatMessage } from 'umi/locale';
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
  Modal,
} from 'antd';
import SimpleTable from '@/components/SimpleTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './GameList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ gamelist, loading }) => ({
  gamelist,
  loading: loading.models.gamelist,
}))
@Form.create()
class GameList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    //#region 控制模态框的显示状态
    purchase: {
      loading: false,
      visible: false,
    },
    current: {},
    //#endregion
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'gamelist/fetch',
    });
    dispatch({
      type: 'gamelist/fetchCpType'
    });
  }

  //查看页面
  handleOrder = (flag, record) => {
    console.log(record);
    this.setState({current: record, purchase: {visible: true}});
  };

  handleOk(e) {
    const { dispatch, form } = this.props;
    e.preventDefault();

    this.setState({purchase: {loading: true, visible: true}});
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'gamelist/payOrder',
          payload: {cid: this.state.current.cp_id, amount: values['amount']*100000}, //转化为尘
        }).then(ret=>{
          dispatch({
            type: 'gamelist/fetch',
          });
          form.resetFields();
          this.setState({purchase: {visible: false, loading: false}});
        }).catch(e=>{
          form.resetFields();
          this.setState({purchase: {visible: false, loading: false}});
        });
      } else {
        form.resetFields();
        this.setState({purchase: {visible: false, loading: false}});
      }
    });
  }

  handleCancel() {
    this.setState({purchase: {visible: false}});
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
      type: 'gamelist/fetch',
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
      type: 'gamelist/fetch',
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
        type: 'gamelist/fetch',
        payload: values,
      });
    });
  };

  //查看页面
  handleView = (flag, record) => {
    this.props.history.push("./gameview?id=" + record.id);
  };

  //显示下拉框
  renderOptions = () => {
    // console.log(this.props.gamelist.data);
    if (this.props.gamelist.cp_type_list != null) {
      return this.props.gamelist.cp_type_list.map(element =>
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
          <Col md={6} sm={9}>
            <FormItem label="游戏全名：">
              {getFieldDecorator('cp_text')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={9}>
            <FormItem label="游戏ID：">
              {getFieldDecorator('cp_id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={9}>
            <FormItem label="游戏类型：">
              {getFieldDecorator('cp_type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  {this.renderOptions()}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={9}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

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
          <a onClick={() => this.handleView(true, record)}>详情</a>&nbsp; | &nbsp;
          <a onClick={() => this.handleOrder(true, record)}>消费</a>
        </Fragment>
      ),
    },
  ];

  render() {
    const {
      gamelist: { data },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    const getModalContent = record => {
      record = record || {};
      return (
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem label="消费金额" {...this.formLayout}>
            {getFieldDecorator('amount', {
              rules: [{ required: false, message: '请输入消费金额' }],
              initialValue: 0,
            })(
              <Input addonAfter="千克" style={{ width: "50%" }} />
            )}
          </FormItem>
          <FormItem label="归属游戏" {...this.formLayout}>{`${record.cp_id}`}</FormItem>
        </Form>
      );
    };

    return (
      <PageHeaderWrapper title="游戏列表">
        <Modal 
          ref="modal"
          width={800}
          destroyOnClose
          onCancel={this.handleCancel.bind(this)}
          visible={this.state.purchase.visible}
          title="游戏消费" 
          footer={[
            <button key="back" className="ant-btn ant-btn-primary" onClick={this.handleCancel.bind(this)}>返 回</button>,
            <button key="submit" className={'ant-btn ant-btn-primary ' + (this.state.purchase.loading?'ant-btn-loading':'')} onClick={this.handleOk.bind(this)}>提 交</button>
          ]}>
          {getModalContent(this.state.current)}
        </Modal>
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

export default GameList;
