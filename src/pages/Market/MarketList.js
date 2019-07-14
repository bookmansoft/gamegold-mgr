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
import styles from './MarketList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

/**
 * 如果链接多个数据仓库，要在 connect 内外两处通知指明
 */
@connect(({ stocklist, gamelist, loading }) => ({
  stocklist, 
  gamelist,
  loading: loading.models.stocklist && loading.models.gamelist,
}))
@Form.create()
class MarketList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    purchase: {
      loading: false,
      visible: false,
    },
    current: {},
  };

  columns = [
    {
      title: '游戏编号',
      dataIndex: 'cpid',
    },
    {
      title: '游戏名称',
      dataIndex: 'cpname',
    },
    {
      title: '历史销售总量',
      dataIndex: 'hisSum',
    },
    {
      title: '单价(千克)',
      dataIndex: 'price',
      render: val => <span>{parseInt(val/100)/1000}</span>,
    },
    {
      title: '出售时限',
      dataIndex: 'sell_limit_date',  //此字段需计算获得
      render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '众筹状态',
      dataIndex: 'audit_state_id',
      render: val =><span>{this.renderAuditState(val)}</span>
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleView(record)}>详情</a>&nbsp;|&nbsp;
          <a onClick={() => this.handleStockView(record)}>行情</a>&nbsp;|&nbsp;
          <a onClick={() => this.handlePurchase(record)}>购买</a>
        </Fragment>
      ),
    },
  ];

  handleOk(e) {
    const { dispatch, form } = this.props;
    e.preventDefault();

    this.setState({purchase: {loading: true, visible: true}});
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'stocklist/purchase',
          payload: {cid: this.state.current.cpid, num: values['stockNum']},
        }).then(ret=>{
          dispatch({
            type: 'stocklist/getStockExchange',
          });
          this.setState({purchase: {visible: false, loading: false}});
        }).catch(e=>{
          this.setState({purchase: {visible: false, loading: false}});
        });
      } else {
        this.setState({purchase: {visible: false, loading: false}});
      }
    });
  }

  handleCancel() {
    this.setState({purchase: {visible: false}});
  }

  /**
   * 加载初始数据
   */
  componentDidMount() {
    const { 
      dispatch,
      stocklist: { stockMap, },
      gamelist: { cp_type_list, }
     } = this.props;

    dispatch({
      type: 'stocklist/getStockExchange',
    });

    if(!cp_type_list) {
      dispatch({
        type: 'gamelist/fetchCpType'
      });
    }
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
      type: 'stocklist/getStockExchange',
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
      type: 'stocklist/getStockExchange',
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
        type: 'stocklist/getStockExchange',
        payload: values,
      });
    });
  };

  //查看页面
  handleView = record => {
    this.props.history.push("./marketview?id=" + record.cpid);
  };

  //查看页面
  handleStockView = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'stocklist/getStockOri',
    }).then(ret=>{
      this.props.history.push("/stock/stockview?id=" + record.cpid);
    });
  };

  handlePurchase = record => {
    this.setState({current: record, purchase: {visible: true}});
  }

  //赠送道具
  handleDeal = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  //显示下拉框
  renderOptions = () => {
    const { 
      gamelist: { cp_type_list, }
     } = this.props;

    if (!!cp_type_list) {
      return cp_type_list.map(element =>
        <Option key={element.id} value={element.cp_type_id}> {element.cp_type_id}</Option>);
    }
    else {
      return "";
    }
  };

  renderAuditState(audit_state_id) {
    switch (parseInt(audit_state_id)) {
      case 1:
        return '未审核';//不该出现
      case 2:
        return '销售中';
      case 3:
        return '审核不通过';//不该出现
      case 4:
        return '已屏蔽';
      case 5:
        return '已结束';
    }
  }

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  render() {
    const {
      stocklist: { stockList },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    const getModalContent = record => {
      record = record || {cpname: '', cpid: '', sum: 0, price: 0}
      return (
        <Form onSubmit={this.handleOk.bind(this)}>
          <FormItem label="购买数量" {...this.formLayout}>
            {getFieldDecorator('stockNum', {
              rules: [{ required: true, message: '请输入购买数量' }],
              initialValue: 0,
            })(
              <Input addonAfter="件" style={{ width: "50%" }} />
            )}
          </FormItem>
          <FormItem label="归属游戏" {...this.formLayout}>{`${record.cpname}/${record.cpid}`}</FormItem>
          <FormItem label="库存和售价" {...this.formLayout}>{`共 ${record.sum} 件 ${record.price/100/1000} 千克 / 件`}</FormItem>
        </Form>
      );
    };

    return (
      <PageHeaderWrapper title={formatMessage({id:'menu.stock.marketlist'})}>
      <Modal 
        ref="modal"
        width={800}
        destroyOnClose
        onCancel={this.handleCancel.bind(this)}
        visible={this.state.purchase.visible}
        title="购买游戏凭证" 
        footer={[
          <button key="back" className="ant-btn ant-btn-primary" onClick={this.handleCancel.bind(this)}>返 回</button>,
          <button key="submit" className={'ant-btn ant-btn-primary ' + (this.state.purchase.loading?'ant-btn-loading':'')} onClick={this.handleOk.bind(this)}>提 交</button>
        ]}>
        {getModalContent(this.state.current)}
      </Modal>
      <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={16}>
                  <Col span={6}>
                    <FormItem label="游戏全名：">
                      {getFieldDecorator('cp_text')(<Input placeholder="请输入" />)}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="众筹状态：">
                      {getFieldDecorator('audit_state_id')(
                        <Select placeholder="请选择" style={{ width: '100%' }}>
                          <Option value="">全部</Option>
                          <Option value="2">销售中</Option>
                          <Option value="4">已屏蔽</Option>
                          <Option value="5">已结束</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">搜索</Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={styles.tableListOperator} />
            <SimpleTable
              selectedRows={selectedRows}
              loading={loading}
              data={stockList}
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

export default MarketList;
