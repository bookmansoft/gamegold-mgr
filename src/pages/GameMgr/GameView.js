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
} from 'antd';
import classNames from 'classnames';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './GameView.less';

const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;



const action = (
  <Fragment>
    <Button type="primary">主操作一</Button>
    <Button type="primary">主操作二</Button>
    <Button type="primary">主操作</Button>
  </Fragment>
);



const desc1 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    2016-12-12 12:32
  </div>
);
const desc2 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
  </div>
);
const desc3 = (
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


const columns = [
  {
    title: '操作类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '操作人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '执行结果',
    dataIndex: 'status',
    key: 'status',
    render: text =>
      text === 'agree' ? (
        <Badge status="success" text="成功" />
      ) : (
        <Badge status="error" text="驳回" />
      ),
  },
  {
    title: '操作时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '备注',
    dataIndex: 'memo',
    key: 'memo',
  },
];

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
        action={action}
        content={null}
        extraContent={null}
        tabList={null}
      >
        <Card title="流程状态（审核中）" style={{ marginBottom: 24 }} bordered={false}>
          <Steps direction={stepDirection} progressDot={customDot} current={1}>
            <Step title="提交发布" description={desc1} />
            <Step title="审核中" description={desc2} />
            <Step title="上线" description={desc3}/>
          </Steps>
        </Card>
        <Card style={null} bordered={false}>
          <Row style={{ marginBottom: 16 }}>
              <Col sm={24} xs={24}><h3><b>游戏信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={8} xs={12}>
              游戏类型：休闲益智 角色扮演 射击
            </Col>
            <Col sm={8} xs={12}>
              开发者：张祖钦工作室
            </Col>
            <Col sm={8} xs={12}>
              发布时间：2018-11-4 21:05:26
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>联系地址：显示完整简介内容，支持换行。显示完整简介内容，支持换行。显示完整简介内容，支持换行。显示完整简介内容，支持换行。显示完整简介内容，支持换行。显示完整简介内容，支持换行。显示完整简介内容，支持换行。显示完整简介内容，支持换行。</Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
              <Col sm={24} xs={24}><h3><b>版本信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={8} xs={12}>
              当前版本：V2.0.0
            </Col>
            <Col sm={8} xs={12}>
              更新时间：2018-11-4 21:05:26
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>更新内容：显示完整简介内容，支持换行。显示完整简介内容，支持换行。显示完整简介内容，支持换行。</Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />
          <Row style={{ marginBottom: 16 }}>
              <Col sm={24} xs={24}><h3><b>素材信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              游戏图标：
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col sm={24} xs={24}>
              封面图片：
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
