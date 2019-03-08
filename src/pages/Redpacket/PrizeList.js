import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import locale from 'antd/lib/date-picker/locale/zh_CN';
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

// let ret2;//全局返回参数使用

/* eslint react/no-multi-comp:0 */
@connect(({ prizelist, loading }) => ({
  prizelist,
  loading: loading.models.prizelist,
}))
@Form.create()
class PrizeList extends PureComponent {
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
      title: '中奖ID',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'nick_name',
    },
    {
      title: '接收openid',
      dataIndex: 're_openid',
    },
    {
      title: '红包金额',
      dataIndex: 'total_amount',
    },
    {
      title: '红包数量',
      dataIndex: 'total_num',
    },
    {
      title: '红包订单号',
      dataIndex: 'mch_billno',
    },


  ];

  componentDidMount() {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'prizelist/get',
      payload: { id: this.props.location.query.id },//这里
    }).then((ret) => {
      console.log("刷新完成" + JSON.stringify(ret));
      console.log(moment(ret.act_start_at * 1000).format('YYYY-MM-DD'));
      this.prize={...ret};//设置到全局对象中
    });
    //这行必须放在后面才会有数据
    dispatch({
      type: 'prizelist/fetch',
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
      type: 'prizelist/fetch',
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
      type: 'prizelist/fetch',
      payload: {},
    });
  };





  render() {
    const {
      prizelist: { data,prize },
      form: { getFieldDecorator, getFieldValue },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <PageHeaderWrapper title="中奖详情">
        <Card style={null} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
            <Col sm={24} xs={24}>
              <h3><b>活动信息</b></h3>
              {getFieldDecorator('id', {
                initialValue: this.props.location.query.id,
              })(<Input placeholder="ID" type="hidden" />)}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={2} xs={2}>
              <div align="right" >活动ID：</div>
            </Col>
            <Col sm={5} xs={5}>
              {this.props.location.query.id}
            </Col>
            <Col sm={1} xs={1}></Col>
            <Col sm={2} xs={2}>
              <div align="right" >活动名称：</div>
            </Col>
            <Col sm={5} xs={5}>
              {prize.act_name}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={2} xs={2}><div align="right" >活动描述：</div></Col>
            <Col sm={22} xs={22}>
                {prize.act_desc}
            </Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
            <Col sm={24} xs={24}><h3><b>活动内容设置</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={2} xs={2}>
              <div align="right" >红包总数：</div>
            </Col>
            <Col sm={5} xs={5}>
              {prize.total_num}
            </Col>
            <Col sm={1} xs={1}></Col>

            <Col sm={2} xs={2}>
              <div align="right" >红包平均金额：</div>
            </Col>
            <Col sm={5} xs={5}>
              {prize.each_gamegold}
            </Col>
            <Col sm={1} xs={1}></Col>

            <Col sm={2} xs={2}>
              <div align="right" >本次活动预算：</div>
            </Col>
            <Col sm={5} xs={5}>
              {prize.total_gamegold}
            </Col>
            <Col sm={1} xs={1}></Col>

          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={2} xs={2}>
              <div align="right" >每个用户红包数量：</div>
            </Col>
            <Col sm={5} xs={5}>
              {prize.each_num}
            </Col>
            <Col sm={1} xs={1}></Col>

            <Col sm={2} xs={2}>
              <div align="right" >设置开始日期：</div>
            </Col>
            <Col sm={5} xs={5}>
              {moment(prize.act_start_at * 1000).format('YYYY-MM-DD')}
            </Col>
            <Col sm={1} xs={1}></Col>

            <Col sm={2} xs={2}>
              <div align="right" >设置结束日期：</div>
            </Col>
            <Col sm={5} xs={5}>
                {moment(prize.act_end_at * 1000).format('YYYY-MM-DD')}
            </Col>
            <Col sm={1} xs={1}></Col>


          </Row>
        </Card>

        <Card bordered={false}>
          <div className={styles.tableList}>
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

export default PrizeList;
