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

import styles from './MarketList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ marketlist, loading }) => ({
  marketlist,
  loading: loading.models.marketlist,
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
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '游戏全名',
      dataIndex: 'cp_text',
    },
    // {
    //   title: '提交时间',
    //   dataIndex: 'modify_date',
    //   render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>,
    // },
    {
      title: '发行凭证总量',
      dataIndex: 'stock_num',
    },
    {
      title: '现金单价(元)',
      dataIndex: 'stock_rmb',
    },
    {
      title: '游戏金单价(千克)',
      dataIndex: 'stock_amount',
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
          <a onClick={() => this.handleView(true, record)}>详情</a>&nbsp;
          {/*由于详情页有屏蔽功能，此处考虑去掉 <a onClick={() => this.handleView(true, record)}>屏蔽</a>&nbsp; */}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketlist/fetch',
    });
    dispatch({
      type: 'marketlist/fetchCpType'
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
      type: 'marketlist/fetch',
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
      type: 'marketlist/fetch',
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
        type: 'marketlist/fetch',
        payload: values,
      });
    });
  };

  //查看页面
  handleView = (flag, record) => {
    console.log(record);
    // this.props.history.push("./marketview?id="+record.cp_id);
    this.props.history.push("./marketview?id=" + record.id);
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
    // console.log(this.props.marketlist.data);
    if (this.props.marketlist.cp_type_list != null) {
      return this.props.marketlist.cp_type_list.map(element =>
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
      marketlist: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <PageHeaderWrapper title="众筹管理列表">
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

export default MarketList;
