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
import styles from './FundingAuditView.less';
import { Pie } from '@/components/Charts';



const FormItem = Form.Item;
const { Step } = Steps;

// const PublishForm = Form.create()(
//   class extends React.Component {

//     render() {
//       const { visible, onCancel, onCreate, form } = this.props;
//       const { getFieldDecorator } = form;
//       return (
//         <Modal
//           visible={visible}
//           title="发布更新"
//           okText="提交"
//           onCancel={onCancel}
//           onOk={onCreate}
//         >
//           <Form layout="vertical">
//             <FormItem label="更新版本">
//               {getFieldDecorator('title', {
//                 rules: [{ required: true, message: '请输入版本号!' }],
//               })(
//                 <Input placeholder="请输入版本号!" />
//               )}
//             </FormItem>
//             <FormItem label="更新内容">
//               {getFieldDecorator('description', {
//                 rules: [{ required: true, max: 300, message: '请输入更新内容，不超过300字!' }],
//               }
//               )(<Input placeholder="请输入更新内容，不超过300字!" type="textarea" />)}
//             </FormItem>
//           </Form>
//         </Modal>
//       );
//     }
//   }
// );

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

// const popoverContent = (
//   <div style={{ width: 160 }}>
//     审核细节内容
//   </div>
// );

// const customDot = (dot, { status }) =>
//   status === 'process' ? (
//     <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
//       {dot}
//     </Popover>
//   ) : (
//       dot
//     );


@connect(({ fundingauditview, loading }) => ({
  fundingauditview,
  loading: loading.models.fundingauditview,
}))

class FundingAuditView extends Component {

  renderImg = (text) => {
    if (text && text.length) {
      const imgs = text.map((item, index) =>
        <div><img width={300} src={item} key={index} /><br /></div>
      )
      return imgs;
    }
  }

  getCurrentStep() {
    return 1;
    // const { location } = this.props;
    // const { pathname } = location;
    // const pathList = pathname.split('/');
    // switch (pathList[pathList.length - 1]) {
    //   case 'info':
    //     return 0;
    //   case 'confirm':
    //     return 1;
    //   case 'result':
    //     return 2;
    //   default:
    //     return 0;
    // }
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
  //审核通过
  handleAuditPass = () => {

  }
  //审核不通过
  handleAuditNoPass = () => {

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
      type: 'fundingauditview/fetch',
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
      fundingauditview: { data },
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

        <Card style={{ marginBottom: 16 }} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>认购情况</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={4}>
              <Pie percent={10} subTitle={null} total="10%" height={120} />
            </Col>
            <Col span={8} style={{ marginBottom: 16 }}>
              已认购数量：
            </Col>
            <Col span={8} style={{ marginBottom: 16 }}>
              未认购数量：
            </Col>
            <Col span={8}>
              截止时间：{moment(data.sell_limit_date * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
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

        </Card>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" onClick={() => this.handleAuditPass()}>
            通过
          </Button>
          <Button type="primary" onClick={() => this.handleAuditNoPass()}>
            不通过
          </Button>
        </FormItem>
      </PageHeaderWrapper>
    );
  }
}

export default FundingAuditView;
