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

@connect(({ 
  stocklist, gamelist,
  loading 
}) => ({
  stocklist, gamelist,
  loading: loading.models.stocklist,
}))

class StockView extends Component {
  state = {
    operationkey: 'tab1',
    stepDirection: 'horizontal',
    recordType: 1,                //1代表一级市场条目，2代表二级市场条目
    detail: {},                   //代表当前浏览的凭证条目
    game: {},                     //代表当前凭证条目对应的CP对象
  };

  /**
   * 页面启动时，完成数据初始化
   */
  componentDidMount() {
    const {
      dispatch,
      stocklist: { records },
    } = this.props;

    this.setState({recordType: this.props.location.query.type || 1});

    dispatch({
      type: 'gamelist/getGameRecord',
      payload: { id: this.props.location.query.id },
    });

    //@warning 当前封装模式下， reducer 无论带不带星标，返回的都是 Promise
    dispatch({
      type: 'stocklist/queryDetail',
      payload: {
        id: this.props.location.query.id,
        type: this.props.location.query.type,
      }
    }).then(detail=>{
      if(!detail) {
        router.push('/stock/stocklist');
        return;
      }

      this.setState({detail: detail});
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  handleBack = () => {
    history.back();
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

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
    const { stepDirection, operationkey, detail, } = this.state;
    const {
      gamelist: { gameRecord },
      loading,
    } = this.props;

    /** 
      type = 1:
      addr: "tb1qz4aesprvtz36rhjml78ls5z4yx05lv7j25vz3s"
      cid: "628e5800-a585-11e9-8d3d-5b0483df26be"
      period: 1543
      price: 1000000
      sell_price: 20
      sell_sum: 200
      sum: 300 

      type = 2:
      audit_state_id: 2
      cpid: "628e5800-a585-11e9-8d3d-5b0483df26be"
      cpname: "cp010061"
      hisPrice: 1000000
      hisSum: 500
      price: 1000000
      sell_limit_date: 1564329724.861
      sum: 500
     */

    console.log('stockview', detail, gameRecord);
    /**
      cp_desc: "Supply elite soldiers with tons of equipment: hi-tech armor, deadly weapons, implants, and gadgets. ? Upgrade your base and research futuristic technology to gain access to advanced war"
      cp_id: "628e5800-a585-11e9-8d3d-5b0483df26be"
      cp_name: "cp010061"
      cp_state: 1
      cp_text: "Mercs of Boom(cp010061)"
      cp_type: "SHT"
      cp_url: "http://h5.gamegold.xin/mock/cp010061"
      cp_version: "V1.0"
      develop_name: "GAME INSIGHT UAB Strategy"
      face_url: "http://h5.gamegold.xin/image/1/large_img.jpg"
      icon_url: "http://h5.gamegold.xin/image/1/icon_img.jpg"
      id: 628
      invite_share: 15
      operator_id: 4026
      pic_urls: (3) ["http://h5.gamegold.xin/image/1/pic1.jpg", "http://h5.gamegold.xin/image/1/pic2.jpg", "http://h5.gamegold.xin/image/1/pic3.jpg"]
      picture_url: "{"icon_url":"http://h5.gamegold.xin/image/1/icon_img.jpg","face_url":"http://h5.gamegold.xin/image/1/large_img.jpg","pic_urls":["http://h5.gamegold.xin/image/1/pic1.jpg","http://h5.gamegold.xin/image/1/pic2.jpg","http://h5.gamegold.xin/image/1/pic3.jpg"]}"
      publish_time: 1545606613
      update_content: "更新了最新场景和新的地图"
      update_time: 1545706613
      wallet_addr: "tb1qpfcyzl3ck9wv2gfywjaf6pdtan0etkgvhc98qd"
     */

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
                <Col span={24}><h3><b>当前挂牌价</b></h3></Col>
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
                  当前流通市值(千克)
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
              <iframe src={"http://crm.vallnet.cn/echart/kline/index.html?cid="+detail.cid} frameBorder="0" width="100%" height="600px" scrolling="no" />
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
