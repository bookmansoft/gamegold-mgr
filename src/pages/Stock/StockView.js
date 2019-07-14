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
import styles from './StockView.less';
import router from 'umi/router';

const FormItem = Form.Item;
const { Step } = Steps;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ stocklist, loading }) => ({
  stocklist,
  loading: loading.models.stocklist,
}))

class StockView extends Component {
  renderImg = (text) => {
    if (text && text.length) {
      const imgs = text.map((item, index) =>
        <div><img width={300} src={item} key={index} /><br /></div>
      )
      return imgs;
    }
  }

  state = {
    visible: false, //发布更新表单可见性
    operationkey: 'tab1',
    stepDirection: 'horizontal',
    detail: {},
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
    const {
      stocklist: { records },
    } = this.props;

    let detail = records[this.props.location.query.id];
    if(!detail) {
      router.push('/stock/stocklist');
      return;
    }

    this.setState({detail: detail});

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
      loading
    } = this.props;

    let detail = this.state.detail || {};

    return (
      <PageHeaderWrapper
        title="凭证详情页"
        action={null}
        content={null}
        extraContent={null}
        tabList={null}
      >
        <Card style={null} bordered={false}>
          <Row style={{ marginBottom: 32 }}>
            <Col span={6}>
              <Row style={{ marginBottom: 16 }}>
                <Col span={24}><h3><b>当前挂牌价（游戏金）</b></h3></Col>
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Col span={24}><h1 style={{color:'red'}}>{parseInt(detail.sell_price/100)/1000}千克</h1></Col>
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Col span={12}>
                  流通凭证总数(份)
                </Col>
                <Col span={12}>
                  {detail.sell_sum}
                </Col>
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Col span={12}>
                  当前流通市值(Kg)
                </Col>
                <Col span={12}>
                  {parseInt(detail.sell_sum*detail.sell_price/100)/1000}
                </Col>
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Col span={12}>
                  最新挂单价格
                </Col>
                <Col span={12}>
                {parseInt(detail.sell_price/100)/1000}
                </Col>
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Col span={12}>
                  挂单数量
                </Col>
                <Col span={12}>
                  {detail.sum}
                </Col>
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Col span={12}>
                  发行价格
                </Col>
                <Col span={12}>
                  {parseInt(detail.price/100)/1000}
                </Col>
              </Row>
              <Row style={{ marginBottom: 16 }}>
                <Col span={12}>
                  挂单价/发行价
                </Col>
                <Col span={12}>
                  {(detail.sum*100/detail.price)+'%'}
                </Col>
              </Row>

            </Col>
            <Col span={18}>
              <iframe src={"http://"+location.hostname+":9701/echart/kline/index.html?cid="+detail.cid} frameBorder="0" width="100%" height="600px" scrolling="no" />
            </Col>
          </Row>

          <Divider style={{ margin: '20px 0' }} />

          <Row style={{ marginBottom: 16 }}>
            <Col span={24}><h3><b>游戏信息</b></h3></Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={8}>
              游戏名称：
              {detail.cid}
            </Col>
            <Col span={8}>
              游戏类型：
              {/* {detail.cp_type} */}
            </Col>
            <Col span={8}>
              开发者：
              {/* {detail.develop_name} */}
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={8}>
              流通凭证总数：100000份
            </Col>
            <Col span={8}>
              持续分红时间：120天
            </Col>
            <Col span={8}>
              累计分红：1222千克
            </Col>
          </Row>
          <Row style={{ marginBottom: 32 }}>
            <Col span={8}>
              当前流通市值(千克)
            </Col>
            <Col span={8}>
              单份凭证收益
            </Col>
          </Row>

          <Row style={{ marginBottom: 32 }}>
            <Col sm={4} xs={8}>
              <Button type="primary" onClick={this.handleBack}>
                返回
                </Button>
            </Col>
          </Row>

        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default StockView;
