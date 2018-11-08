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
} from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './GameView.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

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
//--发布更新
function doPublishChange() {
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
    operationkey: 'tab1',
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'gameview/fetch',
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
        title={data.gameName}
        action={null}
        content={null}
        extraContent={null}
        tabList={null}
      >
        <Card title="流程状态（审核中）" style={{ marginBottom: 24 }} bordered={false}>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              <div align="right">
                {data.gameState ==1 &&
                  <Button type="primary" style={{ marginRight: 24 }}>编辑</Button>
                }
                {data.gameState ==1 &&
                  <Button type="primary" style={{ marginRight: 24 }} onClick={doDeleteGame}>删除</Button>
                }
                {data.gameState ==2 &&
                  <Button type="primary"  style={{ marginRight: 24 }}  onClick={doEdit}>编辑</Button>
                }
                {data.gameState ==2 &&
                  <Button type="primary"  style={{ marginRight: 24 }} onClick={doPublishChange} >发布更新</Button>
                }
                {data.gameState ==2 &&
                  <Button type="primary"  style={{ marginRight: 24 }} onClick={doOffline} >下线</Button>
                }
                {data.gameState ==3 &&
                  <Button type="primary"  style={{ marginRight: 24 }} onClick={doReOnline}>重新上线</Button>
                }
              </div>
            </Col>
          </Row>
          <Steps direction={stepDirection} progressDot={customDot} current={data.gameState}>
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
              游戏类型：{data.gameTypeNames}
            </Col>
            <Col sm={8} xs={12}>
              开发者：{data.developerName}
            </Col>
            <Col sm={8} xs={12}>
              发布时间：{data.createAt}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>联系地址：{data.contactAddress}</Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
              <Col sm={24} xs={24}><h3><b>版本信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={8} xs={12}>
              当前版本：{data.currentVersion}
            </Col>
            <Col sm={8} xs={12}>
              更新时间：{data.updateAt}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>更新内容：{data.updateContent}</Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
              <Col sm={24} xs={24}><h3><b>素材信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              游戏图标：<img width={120} src={data.gameIcon} />
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              封面图片：<img width={120} src={data.gameFacePicture} />
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                游戏截图：
              </Col>
          </Row>
        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default GameView;
