import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

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
  Badge,
  Table,
  Tooltip,
  Divider,
  Modal,
  Form, 
  Input,
  Radio,
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
                <Input placeholder="请输入版本号!"/>
              )}
            </FormItem>
            <FormItem label="更新内容">
              {getFieldDecorator('description', {
                rules: [{ required: true, max:300, message: '请输入更新内容，不超过300字!' }],
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

const desc1 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    todo:用自定义行列定位，可以任意渲染
  </div>
);
const desc2 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    2017-12-02 09:21:12
  </div>
);
const desc3 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    
  </div>
);
const desc4 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    
  </div>
);

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
//--编辑
function doEdit() {
  //没干啥
}

//--下线
function doOffline() {
  Modal.confirm({
    title: '确定要下线该游戏吗？',
    content: '下线后游戏将不会显示在游戏金客户端',
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      }).catch(() => console.log('Oops errors!'));
    },
    onCancel() {},
  });
}

//--删除
function doDeleteGame() {
  Modal.confirm({
    title: '确定要删除该游戏吗？',
    content: '删除后，该游戏的数据将不会保留',
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      }).catch(() => console.log('Oops errors!'));
    },
    onCancel() {},
  });
}

//--状态3已下线时，重新上线的提示框
function doReOnline() {
  Modal.confirm({
    title: '重新上线需要重新审核',
    content: '审核通过后将自动上线',
    onOk() {
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      }).catch(() => console.log('Oops errors!'));
    },
    onCancel() {},
  });
}


@connect(({ gameview, loading }) => ({
  gameview,
  loading: loading.models.gameview,
}))

class GameView extends Component {


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

  componentDidMount() {
    const { dispatch } = this.props;
    console.log(this.props.location.query.id);
    dispatch({
      type: 'gameview/fetch',
      payload: {id:this.props.location.query.id},//这里
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
        gameview:  {data },
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
      
        <Card title="流程状态（审核中）" style={{ marginBottom: 24 }} bordered={false}>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              <div align="right">
                {data.cp_state ==1 &&
                  <Button type="primary" style={{ marginRight: 24 }}>编辑</Button>
                }
                {data.cp_state ==1 &&
                  <Button type="primary" style={{ marginRight: 24 }} onClick={doDeleteGame}>删除</Button>
                }
                {data.cp_state ==2 &&
                  <Button type="primary"  style={{ marginRight: 24 }}  onClick={doEdit}>编辑</Button>
                }
                {data.cp_state ==2 &&
                  <Button type="primary"  style={{ marginRight: 24 }} onClick={this.showModal} >发布更新</Button>
                }
                {data.cp_state ==2 &&
                  <Button type="primary"  style={{ marginRight: 24 }} onClick={doOffline} >下线</Button>
                }
                {data.cp_state ==3 &&
                  <Button type="primary"  style={{ marginRight: 24 }} onClick={doReOnline}>重新上线</Button>
                }
              </div>
            </Col>
          </Row>
          <Steps direction={stepDirection} progressDot={customDot} current={data.cp_state}>
            <Step title="提交发布" description={desc1} />
            <Step title="审核中" description={desc2} />
            <Step title="上线" description={desc3}/>
            <Step title="下线" description={desc4}/>
          </Steps>  
        </Card>
        <Card style={null} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
              <Col sm={24} xs={24}><h3><b>游戏信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={8} xs={12}>
              游戏类型：{data.cp_type}
            </Col>
            <Col sm={8} xs={12}>
              开发者：{data.develop_name}
            </Col>
            <Col sm={8} xs={12}>
              发布时间：{data.publish_time}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>联系地址：{data.url}{data.wallet_addr}</Col>
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
              更新时间：{data.publish_time}
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
              游戏图标：<img width={120} src={data.pictureUrl} />
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              封面图片：<img width={120} src={data.pictureUrl} />
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                游戏截图：
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
