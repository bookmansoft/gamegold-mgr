import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';
import router from 'umi/router';
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
import styles from './FundingAuditView.less';
import { Pie } from '@/components/Charts';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ fundingauditview, loading }) => ({
  fundingauditview,
  loading: loading.models.fundingauditview,
}))
@Form.create()
class FundingAuditView extends Component {
  state = {
    visible: false, //发布更新表单可见性
    operationkey: 'tab1',
    stepDirection: 'horizontal',
    // 自定义的state
    id: 0,
    stock_rmb: 10,
    audit_state_id:1,//审核状态，按下按钮后改为指定的值。
    audit_text: '',
    cid:'', //链cid
  };
  renderImg = (text) => {
    if (text && text.length) {
      const imgs = text.map((item, index) =>
        <div><img width={300} src={item} key={index} /><br /></div>
      )
      return imgs;
    }
  }
  // 本页确定是“2-等待审核”状态
  getCurrentStep() {
    return 1;
  }

  // //显示发布更新表单
  // showModal = () => {
  //   this.setState({ visible: true });
  // }
  // //隐藏发布更新表单
  // handleCancel = () => {
  //   this.setState({ visible: false });
  // }
  //审核通过
  handleAuditPass = (theState,theData) => {
    this.state.audit_state_id = 2;
    this.state.cid=theData.cid;
    //以下代码与审核不通过相同
    const { dispatch, form } = this.props;
    console.log(theState);
    dispatch({
      type: 'fundingauditview/audit',
      payload: {
        state: theState
      },
    }).then((ret) => {
      console.log(ret);
      if (ret.code === 0) {
        router.push('/funding/fundingauditviewsuccess');
      } else {
        router.push('/funding/fundingauditviewerror');
      };
    }
    );
  };

  //审核不通过
  handleAuditNoPass =  (theState,theData) => {
    this.state.audit_state_id = 3;
    this.state.cid=theData.cid;
    //以下代码与审核通过相同
    const { dispatch, form } = this.props;
    console.log(theState);
    dispatch({
      type: 'fundingauditview/audit',
      payload: {
        state: theState
      },
    }).then((ret) => {
      console.log(ret);
      if (ret.code === 0) {
        router.push('/funding/fundingauditviewsuccess');
      } else {
        router.push('/funding/fundingauditviewerror');
      };
    }
    );
  }

  handleStockRmbChange = e => {
    this.state.stock_rmb = parseInt(e.target.value);
  }
  handleAuditTextChange = e => {
    this.state.audit_text = e.target.value;
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

    this.state.id=parseInt(this.props.location.query.id);//设置到本页的state中备用
    dispatch({
      type: 'fundingauditview/fetch',
      payload: { id: this.state.id },
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  };

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
      fundingauditview: { data },
      form: { getFieldDecorator, getFieldValue },
      loading
    } = this.props;
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper
        title="众筹审核详情"
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

        <Card style={null} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>申请众筹内容</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={8}>
              发行凭证总数(份)：{data.stock_num}
            </Col>
            <Col span={8}>
              发行价(千克/份)：{data.stock_amount}
            </Col>
            <Col span={8}>
              众筹总金额(千克)：{data.total_amount}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={24}>
              提交申请时间：{moment(data.modify_date * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
        </Card>

        <Card style={null} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>基本信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={8}>
              游戏中文名：{data.cp_text}
            </Col>
            <Col span={8}>
              游戏类型：{data.cp_type}
            </Col>
            <Col span={8}>
              开发者：{data.develop_name}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={24}>游戏详情页：{data.cp_url}</Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>开发团队介绍</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={24}>
              {data.develop_text}
            </Col>
          </Row>


          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={3}>
              <div align="right" style={{ fontWeight: 'bold', marginTop: 5 }}>审核意见:</div>
            </Col>
            <Col span={13}>
              <FormItem >
                {getFieldDecorator('audit_text', {
                  rules: [
                    {
                      required: true,
                      message: "请输入审核意见",
                    },
                  ],
                })(<TextArea placeholder="请输入" style={{ width: '100%' }} onChange={this.handleAuditTextChange} />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={3}>
              <div align="right" style={{ fontWeight: 'bold', marginTop: 5 }}>上架众筹金额:</div>
            </Col>
            <Col span={13}>
              <FormItem >
                {getFieldDecorator('stock_rmb', {
                  rules: [
                    {
                      required: true,
                      message: "请输入上架众筹金额",
                    },
                  ],
                })(<Input placeholder="请输入" onChange={this.handleStockRmbChange} />)}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" onClick={() => this.handleAuditPass(this.state, data)}>通过</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.handleAuditNoPass(this.state, data)}>不通过</Button>
          </FormItem>
        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default FundingAuditView;
