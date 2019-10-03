import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';

import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Steps,
  Card,
  Popover,
  Divider,
  Modal,
  Form,
  Input,

} from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './FundingView.less';
import { Pie } from '@/components/Charts';



const FormItem = Form.Item;
const { Step } = Steps;


const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ fundinglist, loading }) => ({
  fundinglist,
  loading: loading.models.fundinglist,
}))

class FundingView extends Component {

  renderImg = (text) => {
    if (text && text.length) {
      const imgs = text.map((item, index) =>
        <div><img width={300} src={item} key={index} /><br /></div>
      )
      return imgs;
    }
  }

  getCurrentStep() {
    return this.props.fundinglist.record.audit_state_id;
  }

  state = {
    visible: false, //发布更新表单可见性
    operationkey: 'tab1',
    stepDirection: 'horizontal',
  };
  //显示发布更新表单
  showModal = () => {
    this.setState({ visible: true });
  }
  //隐藏发布更新表单
  handleCancel = () => {
    this.setState({ visible: false });
  }
  //提交发布更新表单
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('此处收到表单数据: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  //传递引用
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  handleBack = () => {
    history.back();
  };

  componentDidMount() {
    const { dispatch } = this.props;
    console.log(this.props.location.query.id);
    dispatch({
      type: 'fundinglist/record',
      payload: { id: this.props.location.query.id },//这里
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  render() {
    const { stepDirection, operationkey } = this.state;
    const {
      fundinglist: { record },
      loading
    } = this.props;


    return (
      <PageHeaderWrapper
        title="众筹游戏详情"
        action={null}
        content={null}
        extraContent={null}
        tabList={null}
      >

        <Card style={{ marginBottom: 16 }} bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="提交申请" />
              <Step title="等待审核" />
              <Step title="审核通过" />
            </Steps>
          </Fragment>
        </Card>

        <Card style={{ marginBottom: 16 }} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>认购情况</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
          <Col span={4}>
              <Pie percent={parseInt((record.stock_num-record.residue_num)*100/record.stock_num)} subTitle={null} total={parseInt((record.stock_num-record.residue_num)*100/record.stock_num)+'%'} height={120} />
            </Col>
            <Col span={8} style={{ marginBottom: 16 }}>
              凭证总数量：{record.stock_num}
            </Col>
            <Col span={8} style={{ marginBottom: 16 }}>
              未认购数量：{record.residue_num}
            </Col>
            <Col span={8}>
              截止时间：{moment(record.sell_limit_date * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
        </Card>
        <Card style={null} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>申请众筹内容</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={8}>
              发行凭证总数(份)：{record.stock_num}
            </Col>
            <Col span={8}>
              发行价(千克/份)：{parseFloat(record.stock_amount/100000).toFixed(3)}
            </Col>
            <Col span={8}>
              众筹总金额(千克)：{parseFloat(record.total_amount/100000).toFixed(3)}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={24}>
              提交申请时间：{moment(record.modify_date * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
        </Card>

        <Card style={null} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>基本信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
          <Col span={8}>
              游戏中文名：{record.cp_text}
            </Col>
            <Col span={8}>
              游戏类型：{record.cp_type}
            </Col>
            <Col span={8}>
              开发者：{record.develop_name}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={24}>游戏详情页：{record.cp_url}</Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>开发团队介绍</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={24}>
              {record.develop_text}
            </Col>
          </Row>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default FundingView;
