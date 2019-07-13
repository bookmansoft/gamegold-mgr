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

import styles from './StockList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ stocklist, loading }) => ({
  stocklist,
  loading: loading.models.stocklist,
}))
@Form.create()
class StockList extends PureComponent {
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
    //#endregion
  };

  columns = [
    {
      title: '凭证编号',
      dataIndex: 'cid',
    },
    {
      title: '凭证地址',
      dataIndex: 'addr',
    },
    {
      title: '挂单数量',
      dataIndex: 'sell_sum',
    },
    {
      title: '挂单价格(千克)',
      dataIndex: 'sell_price',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleAuction(true, record)}>购买</a>&nbsp;
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
      type: 'stocklist/fetch',
    });
    dispatch({
      type: 'stocklist/fetchCpType'
    });
  }

  handleOk(e) {
    const { dispatch, form } = this.props;
    e.preventDefault();

    this.setState({purchase: {loading: true, visible: true}});
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'stocklist/auctionstock',
          payload: {cid: this.state.current.cid, srcAddr: this.state.current.addr, num: values['stockNum'], price: this.state.current.sell_price},
        }).then(ret=>{
          dispatch({
            type: 'stocklist/fetch',
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
      type: 'stocklist/fetch',
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
      type: 'stocklist/fetch',
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
        type: 'stocklist/fetch',
        payload: values,
      });
    });
  };

  //查看页面
  handleAuction = (flag, record) => {
    this.setState({current: record, purchase: {visible: true}});
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
      stocklist: { data },
      form: { getFieldDecorator },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    const getModalContent = record => {
      record = record || {};
      return (
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem label="购买数量" {...this.formLayout}>
            {getFieldDecorator('stockNum', {
              rules: [{ required: false, message: '请输入购买数量' }],
              initialValue: 0,
            })(
              <Input addonAfter="件" style={{ width: "50%" }} />
            )}
          </FormItem>
          <FormItem label="归属游戏" {...this.formLayout}>{`${record.cid}`}</FormItem>
          <FormItem label="库存和成本" {...this.formLayout}>{`共 ${record.sum} 件 ${record.price/100/1000} 千克 / 件`}</FormItem>
        </Form>
      );
    };

    return (
      <PageHeaderWrapper title="待售列表">
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

export default StockList;
