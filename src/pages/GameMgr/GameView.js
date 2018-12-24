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
import styles from './GameView.less';

const FormItem = Form.Item;
const { Step } = Steps;

const PublishForm = Form.create()(
  class extends React.Component {

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="发布更新"
          okText="提交"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="更新版本">
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入版本号!' }],
              })(
                <Input placeholder="请输入版本号!" />
              )}
            </FormItem>
            <FormItem label="更新内容">
              {getFieldDecorator('description', {
                rules: [{ required: true, max: 300, message: '请输入更新内容，不超过300字!' }],
              }
              )(<Input placeholder="请输入更新内容，不超过300字!" type="textarea" />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const popoverContent = (
  <div style={{ width: 160 }}>
    审核细节内容
  </div>
);

const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
      {dot}
    </Popover>
  ) : (
      dot
    );


@connect(({ gameview, loading }) => ({
  gameview,
  loading: loading.models.gameview,
}))

class GameView extends Component {

  renderImg = (text) => {
    if (text && text.length) {
      const imgs = text.map((item, index) =>
        <img width={120} src={item} key={index} />
      )
      return imgs;
    }
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
      type: 'gameview/fetch',
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
      gameview: { data },
      loading
    } = this.props;


    return (
      <PageHeaderWrapper
        title={data.cp_name}
        action={null}
        content={null}
        extraContent={null}
        tabList={null}
      >
        <Card style={null} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
            <Col sm={24} xs={24}><h3><b>基本信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={8} xs={12}>
              游戏类型：{data.cp_type}
            </Col>
            <Col sm={8} xs={12}>
              开发者：{data.develop_name}
            </Col>
            <Col sm={8} xs={12}>
              发布时间：{moment(data.publish_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={8} xs={12}>
              游戏状态：{data.cp_state=='0'?'未上线':'正常运营'}
            </Col>
            <Col sm={8} xs={12}>
              启用邀请奖励：{parseInt(data.invite_share) == 0 ? '否' : '是'}
            </Col>

            <Col sm={8} xs={12}>
              {parseInt(data.invite_share) != 0 && (
                `邀请奖励：${data.invite_share}%`
              )}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>URL地址：{data.cp_url}</Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
            <Col sm={24} xs={24}><h3><b>版本信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={8} xs={12}>
              当前版本：{data.cp_version}
            </Col>
            <Col sm={8} xs={12}>
              更新时间：{moment(data.update_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>更新内容：{data.cp_desc}</Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
            <Col sm={24} xs={24}><h3><b>素材信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              游戏图标：<img width={120} src={data.icon_url} />
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              封面图片：<img width={120} src={data.face_url} />
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              游戏截图：{this.renderImg(data.pic_urls)}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={4} xs={8}>
              <Button type="primary" onClick={this.handleBack}>
                返回游戏列表
                </Button>
            </Col>
          </Row>
        </Card>
        <PublishForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </PageHeaderWrapper>
    );
  }
}

export default GameView;
