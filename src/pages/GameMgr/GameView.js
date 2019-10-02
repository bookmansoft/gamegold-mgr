import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  message,
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

/**
 * 二维码可视组件, 注意当前发现的一个问题：如果 value 未设置或设置为null ，将会抛出未捕获错误，打断页面的正常显示
 * @description
 * <QRCode value="http://www.vallnet.cn/" />
 *  [prop]      [type]              [default value]
 *  value       string              需要编码的内容，例如一个URL地址
 *  size        number              128
 *  bgColor     string (CSS color)  "#FFFFFF"
 *  fgColor     string (CSS color)  "#000000"
 *  level       string (L/M/Q/H)    'L'
 */
import QRCode from 'qrcode.react';

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
  <div style={{ width: 160 }}>审核细节内容</div>
);

const customDot = (dot, { status }) =>
  status === 'process' ? (
    <Popover placement="topLeft" arrowPointAtCenter content={popoverContent}>
      {dot}
    </Popover>
  ) : (
      dot
    );


@connect(({ gamelist, loading }) => ({
  gamelist,
  loading: loading.models.gamelist,
}))

class GameView extends Component {
  renderImg = (text) => {
    if (text && text.length) {
      const imgs = text.map((item, index) =>
        <div><img width={300} src={item} key={index} /><br/></div>
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
      type: 'gamelist/getGameRecord',
      payload: { id: this.props.location.query.id },
    }).then(record=>{
      dispatch({
        type: 'gamelist/guiderAddr',
        payload: { cid: record.cp_id },
      }).then(rt=>{
        this.setState({gaddr: rt.data});
      });
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
    const { gaddr, stepDirection, operationkey } = this.state;
    const {
      gamelist: { gameRecord },
      loading
    } = this.props;

    let qrPlatform = `http://wallet.gamegold.xin/?path=/guider/${encodeURIComponent(JSON.stringify({gaddr: gaddr}))}`;
    let qrGame = `http://wallet.gamegold.xin/?path=/guider/${encodeURIComponent(JSON.stringify({cid: gameRecord.cp_id, gaddr: gaddr}))}`;

    return (
      <PageHeaderWrapper
        title={gameRecord.cp_name}
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
              游戏类型：{gameRecord.cp_type}
            </Col>
            <Col sm={8} xs={12}>
              开发者：{gameRecord.develop_name}
            </Col>
            <Col sm={8} xs={12}>
              发布时间：{moment(gameRecord.publish_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={8} xs={12}>
              游戏状态：{gameRecord.cp_state=='0'?'未上线':'正常运营'}
            </Col>
            <Col sm={8} xs={12}>
              启用邀请奖励：{parseInt(gameRecord.invite_share) == 0 ? '否' : '是'}
            </Col>

            <Col sm={8} xs={12}>
              {parseInt(gameRecord.invite_share) != 0 && (
                `邀请奖励：${gameRecord.invite_share}%`
              )}
            </Col>
          </Row>

          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>官方地址:&nbsp;{gameRecord.cp_url}</Col>
            <Col sm={24} xs={24}>平台二维码
              <QRCode size={150} value={qrPlatform} />
            </Col>
            <Col sm={24} xs={24}>
              <CopyToClipboard text={qrPlatform} onCopy={()=>{message.success(`已成功拷贝至剪贴板`);}}>
                <Button block icon="copy">{'拷贝地址'}</Button>
              </CopyToClipboard>
            </Col>
            <Col sm={24} xs={24}>产品二维码
              <QRCode size={150} value={qrGame} />
            </Col>
            <Col sm={24} xs={24}>
              <CopyToClipboard text={qrGame} onCopy={()=>{message.success(`已成功拷贝至剪贴板`);}}>
                <Button block icon="copy">{'拷贝地址'}</Button>
              </CopyToClipboard>
            </Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
            <Col sm={24} xs={24}><h3><b>版本信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={8} xs={12}>
              当前版本：{gameRecord.cp_version}
            </Col>
            <Col sm={8} xs={12}>
              更新时间：{moment(gameRecord.update_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>更新内容：{gameRecord.cp_desc}</Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
            <Col sm={24} xs={24}><h3><b>素材信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              游戏图标：<img width={120} src={gameRecord.icon_url} />
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              封面图片：<img width={300} src={gameRecord.face_url} />
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              游戏截图：{this.renderImg(gameRecord.pic_urls)}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={4} xs={8}>
              <Button type="primary" onClick={this.handleBack}>返回游戏列表</Button>
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
