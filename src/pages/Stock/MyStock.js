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

import styles from './MyStock.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ 
  stocklist, gamelist,
  loading 
}) => ({
  stocklist, gamelist,
  loading: loading.models.stocklist,
}))
@Form.create()
class MyStock extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    current: {}, //代表当前选中项目
    //#region 控制模态框的显示状态
    purchase: {
      loading: false,
      visible: false,
    },
    bid: {
      loading: false,
      visible: false,
    }
    //#endregion
  };

  columns = [
    {
      title: '游戏编号',
      dataIndex: 'cid',
    },
    {
      title: '持有地址',
      dataIndex: 'addr',
    },
    {
      title: '持有总数',
      dataIndex: 'sum',
    },
    {
      title: '持有成本',
      dataIndex: 'price',
    },
    {
      title: '挂单数量',
      dataIndex: 'sell_sum',
    },
    {
      title: '挂单价格',
      dataIndex: 'sell_price',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleSend(true, record)}>赠送</a>&nbsp;
          <a onClick={() => this.handleBid(true, record)}>拍卖</a>&nbsp;
        </Fragment>
      ),
    },
  ];

  /**
   * 载入初始数据
   */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'stocklist/mystock',
    });
    dispatch({
      type: 'gamelist/fetchCpType'
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
      type: 'stocklist/mystock',
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
      type: 'stocklist/mystock',
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
        type: 'stocklist/mystock',
        payload: values,
      });
    });
  };

  /**
   * 向第三方赠送凭证
   */
  handleSend = (flag, record) => {
    this.setState({current: record, purchase: {visible: true}});
  };

  /**
   * 拍卖凭证
   */
  handleBid = (flag, record) => {
    this.setState({current: record, bid: {visible: true}});
  };

  handleOk(e) {
    const { dispatch, form } = this.props;
    e.preventDefault();

    this.setState({purchase: {loading: true, visible: true}});
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'stocklist/sendstock',
          payload: {cid: this.state.current.cid, srcAddr: this.state.current.addr, num: values['stockNum'], address: values['address']},
        }).then(ret=>{
          dispatch({
            type: 'stocklist/mystock',
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

  handleOkBid(e) {
    const { dispatch, form } = this.props;
    e.preventDefault();

    this.setState({bid: {loading: true, visible: true}});
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'stocklist/bidstock',
          payload: {cid: this.state.current.cid, srcAddr: this.state.current.addr, num: values['stockNum'], price: values['price']},
        }).then(ret=>{
          dispatch({
            type: 'stocklist/mystock',
          });
          form.resetFields();
          this.setState({bid: {visible: false, loading: false}});
        }).catch(e=>{
          form.resetFields();
          this.setState({bid: {visible: false, loading: false}});
        });
      } else {
        form.resetFields();
        this.setState({bid: {visible: false, loading: false}});
      }
    });
  }

  handleCancelBid() {
    this.setState({bid: {visible: false}});
  }

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
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      stocklist: { myStock },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    const getModalContent = record => {
      record = record || {};
      return (
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem label="赠送数量" {...this.formLayout}>
            {getFieldDecorator('stockNum', {
              rules: [{ required: false, message: '请输入赠送数量' }],
              initialValue: 0,
            })(
              <Input addonAfter="件" style={{ width: "50%" }} />
            )}
          </FormItem>
          <FormItem label="目标地址" {...this.formLayout}>
            {getFieldDecorator('address', {
              rules: [{ required: false, message: '请输入目标地址' }],
              initialValue: '',
            })(
              <Input style={{ width: "50%" }} />
            )}
          </FormItem>
          <FormItem label="归属游戏" {...this.formLayout}>{`${record.cid}`}</FormItem>
          <FormItem label="库存和成本" {...this.formLayout}>{`共 ${record.sum} 件 ${record.price/100/1000} 千克 / 件`}</FormItem>
        </Form>
      );
    };

    const getBidContent = record => {
      record = record || {};
      return (
        <Form onSubmit={this.handleOkBid.bind(this)}>
          <FormItem label="拍卖数量" {...this.formLayout}>
            {getFieldDecorator('stockNum', {
              rules: [{ required: false, message: '请输入拍卖数量' }],
              initialValue: 0,
            })(
              <Input addonAfter="件" style={{ width: "50%" }} />
            )}
          </FormItem>
          <FormItem label="拍卖价格" {...this.formLayout}>
            {getFieldDecorator('price', {
              rules: [{ required: false, message: '请输入拍卖价格' }],
              initialValue: '',
            })(
              <Input addonAfter="千克" style={{ width: "50%" }} />
            )}
          </FormItem>
          <FormItem label="归属游戏" {...this.formLayout}>{`${record.cid}`}</FormItem>
          <FormItem label="库存和成本" {...this.formLayout}>{`共 ${record.sum} 件 ${record.price/100/1000} 千克 / 件`}</FormItem>
        </Form>
      );
    };

    return (
      <PageHeaderWrapper title={formatMessage({id:'menu.stock.mystock'})}>
        <Modal 
          ref="modal"
          width={800}
          destroyOnClose
          onCancel={this.handleCancel.bind(this)}
          visible={this.state.purchase.visible}
          title="转让游戏凭证" 
          footer={[
            <button key="back" className="ant-btn ant-btn-primary" onClick={this.handleCancel.bind(this)}>返 回</button>,
            <button key="submit" className={'ant-btn ant-btn-primary ' + (this.state.purchase.loading?'ant-btn-loading':'')} onClick={this.handleOk.bind(this)}>提 交</button>
          ]}>
          {getModalContent(this.state.current)}
        </Modal>
        <Modal 
          ref="modal"
          width={800}
          destroyOnClose
          onCancel={this.handleCancelBid.bind(this)}
          visible={this.state.bid.visible}
          title="拍卖游戏凭证" 
          footer={[
            <button key="back" className="ant-btn ant-btn-primary" onClick={this.handleCancelBid.bind(this)}>返 回</button>,
            <button key="submit" className={'ant-btn ant-btn-primary ' + (this.state.bid.loading?'ant-btn-loading':'')} onClick={this.handleOkBid.bind(this)}>提 交</button>
          ]}>
          {getBidContent(this.state.current)}
        </Modal>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator} />
            <SimpleTable
              selectedRows={selectedRows}
              loading={loading}
              data={myStock}
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

export default MyStock;
