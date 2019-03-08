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

/* eslint react/no-multi-comp:0 */
@connect(({ prizelist, loading }) => ({
  prizelist,
  loading: loading.models.prizelist,
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
    const { dispatch } = this.props;
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
      prizelist: { data },
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
              <div align="right" style={{ marginTop: 5 }}>活动ID：</div>
            </Col>
            <Col sm={5} xs={5}>
              {getFieldDecorator('act_sequence', {
                rules: [
                  {
                    required: true,
                    message: "请输入活动ID",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Col>
            <Col sm={1} xs={1}></Col>
            <Col sm={2} xs={2}>
              <div align="right" style={{ marginTop: 5 }}>活动名称：</div>
            </Col>
            <Col sm={5} xs={5}>
              {getFieldDecorator('act_name', {
                initialValue: '积分抽奖',
                rules: [
                  {
                    required: true,
                    message: "积分抽奖",

                  },
                ],
              })(<Input placeholder="积分抽奖1" />)}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={2} xs={2}><div align="right" style={{ marginTop: 5 }}>活动描述：</div></Col>
            <Col sm={22} xs={22}>
              <FormItem label="">
                {getFieldDecorator('act_desc', {
                  rules: [
                    {
                      required: true,
                      message: "请输入活动描述",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem></Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
            <Col sm={24} xs={24}><h3><b>活动内容设置</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={2} xs={2}>
              <div align="right" style={{ marginTop: 5 }}>红包总数：</div>
            </Col>
            <Col sm={5} xs={5}>
              {getFieldDecorator('total_num', {
                rules: [
                  {
                    required: true,
                    message: "请输入红包总数",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Col>
            <Col sm={1} xs={1}></Col>

            <Col sm={2} xs={2}>
              <div align="right" style={{ marginTop: 5 }}>红包平均金额：</div>
            </Col>
            <Col sm={5} xs={5}>
              {getFieldDecorator('each_gamegold', {
                rules: [
                  {
                    required: true,
                    message: "请输入红包平均金额",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Col>
            <Col sm={1} xs={1}></Col>

            <Col sm={2} xs={2}>
              <div align="right" style={{ marginTop: 5 }}>本次活动预算：</div>
            </Col>
            <Col sm={5} xs={5}>
              {getFieldDecorator('total_gamegold', {
                rules: [
                  {
                    required: true,
                    message: "请输入本次活动预算",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Col>
            <Col sm={1} xs={1}></Col>

          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={2} xs={2}>
              <div align="right" style={{ marginTop: 5 }}>每个用户红包数量：</div>
            </Col>
            <Col sm={5} xs={5}>
              {getFieldDecorator('each_num', {
                rules: [
                  {
                    required: true,
                    message: "请输入每个用户红包数量",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Col>
            <Col sm={1} xs={1}></Col>

            <Col sm={2} xs={2}>
              <div align="right" style={{ marginTop: 5 }}>设置开始日期：</div>
            </Col>
            <Col sm={5} xs={5}>
              {getFieldDecorator('act_start_at', {
                rules: [
                  {
                    required: true,
                    message: "请输入活动开始日期",
                  },
                ],
              })(<DatePicker locale={locale} />)}
            </Col>
            <Col sm={1} xs={1}></Col>

            <Col sm={2} xs={2}>
              <div align="right" style={{ marginTop: 5 }}>设置结束日期：</div>
            </Col>
            <Col sm={5} xs={5}>
              {getFieldDecorator('act_end_at', {
                rules: [
                  {
                    required: true,
                    message: "请输入活动结束日期",
                  },
                ],
              })(<DatePicker locale={locale} />)}
            </Col>
            <Col sm={1} xs={1}></Col>


          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>说明：请认真核对活动内容设置</Col>
          </Row>


          <Row style={{ marginBottom: 32 }}>
            <Col sm={8} xs={8}>
            </Col>
            <Col sm={4} xs={4}>
              <Button type="primary" htmlType="submit">
                提交
                </Button>
            </Col>
            <Col sm={4} xs={4}>
              <Button type="primary" onClick={this.handleBack}>
                取消
                </Button>
            </Col>
          </Row>
        </Card>

        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
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
