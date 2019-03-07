import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import router from 'umi/router';
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
  DatePicker,
  TimePicker,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const FormItem = Form.Item;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ redpacketadd, loading }) => ({
  redpacketadd,
  loading: loading.models.redpacketadd,
}))
@Form.create()
class RedpacketAdd extends Component {

  renderImg = (text) => {
    if (text && text.length) {
      const imgs = text.map((item, index) =>
        <div><img width={300} src={item} key={index} /><br /></div>
      )
      return imgs;
    }
  }

  handleBack = () => {
    history.back();
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'redpacketadd/add',
      payload: { id: this.props.location.query.id },//这里
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'redpacketadd/add',
          payload: values,
        }).then((ret) => {
          console.log("B 执行完成！");
          if (ret.code === 0) {
            router.push('/redpacket/redpacketaddsuccess');
          } else {
            router.push('/redpacket/redpacketadderror');
          };
        }
        );
      };
    });
  }
  render() {
    const {
      redpacketadd: { data },
      form: { getFieldDecorator, getFieldValue },
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
        <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>
          <Card style={null} bordered={false}>
            <Row style={{ marginBottom: 16 }}>
              <Col sm={24} xs={24}><h3><b>活动信息</b></h3></Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={2} xs={2}>
                <div align="right" style={{ marginTop: 5 }}>活动ID：</div>
              </Col>
              <Col sm={5} xs={5}>
                {getFieldDecorator('act_sequence', {
                  rules: [
                    {
                      required: true,
                      message: "请输入活动ID",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Col>
              <Col sm={1} xs={1}></Col>
              <Col sm={2} xs={2}>
                <div align="right" style={{ marginTop: 5 }}>活动名称：</div>
              </Col>
              <Col sm={5} xs={5}>
                {getFieldDecorator('act_name', {
                  initialValue: '积分抽奖',
                  rules: [
                    {
                      required: true,
                      message: "积分抽奖",

                    },
                  ],
                })(<Input placeholder="积分抽奖1" />)}
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={2} xs={2}><div align="right" style={{ marginTop: 5 }}>活动描述：</div></Col>
              <Col sm={22} xs={22}>
                <FormItem label="">
                  {getFieldDecorator('act_desc', {
                    rules: [
                      {
                        required: true,
                        message: "请输入活动描述",
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem></Col>
            </Row>

            <Divider style={{ margin: '20px 0' }} />
            <Row style={{ marginBottom: 16 }}>
              <Col sm={24} xs={24}><h3><b>活动内容设置</b></h3></Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={2} xs={2}>
                <div align="right" style={{ marginTop: 5 }}>红包总数：</div>
              </Col>
              <Col sm={5} xs={5}>
                {getFieldDecorator('total_num', {
                  rules: [
                    {
                      required: true,
                      message: "请输入红包总数",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Col>
              <Col sm={1} xs={1}></Col>

              <Col sm={2} xs={2}>
                <div align="right" style={{ marginTop: 5 }}>红包平均金额：</div>
              </Col>
              <Col sm={5} xs={5}>
                {getFieldDecorator('each_gamegold', {
                  rules: [
                    {
                      required: true,
                      message: "请输入红包平均金额",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Col>
              <Col sm={1} xs={1}></Col>

              <Col sm={2} xs={2}>
                <div align="right" style={{ marginTop: 5 }}>本次活动预算：</div>
              </Col>
              <Col sm={5} xs={5}>
                {getFieldDecorator('total_gamegold', {
                  rules: [
                    {
                      required: true,
                      message: "请输入本次活动预算",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Col>
              <Col sm={1} xs={1}></Col>

            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={2} xs={2}>
                <div align="right" style={{ marginTop: 5 }}>每个用户红包数量：</div>
              </Col>
              <Col sm={5} xs={5}>
                {getFieldDecorator('each_num', {
                  rules: [
                    {
                      required: true,
                      message: "请输入每个用户红包数量",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Col>
              <Col sm={1} xs={1}></Col>

              <Col sm={2} xs={2}>
                <div align="right" style={{ marginTop: 5 }}>设置开始日期：</div>
              </Col>
              <Col sm={5} xs={5}>
                {getFieldDecorator('act_start_at', {
                  rules: [
                    {
                      required: true,
                      message: "请输入活动开始日期",
                    },
                  ],
                })(<DatePicker locale={locale} />)}
              </Col>
              <Col sm={1} xs={1}></Col>

              <Col sm={2} xs={2}>
                <div align="right" style={{ marginTop: 5 }}>设置结束日期：</div>
              </Col>
              <Col sm={5} xs={5}>
                {getFieldDecorator('act_end_at', {
                  rules: [
                    {
                      required: true,
                      message: "请输入活动结束日期",
                    },
                  ],
                })(<DatePicker locale={locale} />)}
              </Col>
              <Col sm={1} xs={1}></Col>


            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>说明：请认真核对活动内容设置</Col>
            </Row>


            <Row style={{ marginBottom: 32 }}>
              <Col sm={8} xs={8}>
              </Col>
              <Col sm={4} xs={4}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Col>
              <Col sm={4} xs={4}>
                <Button type="primary" onClick={this.handleBack}>
                  取消
                </Button>
              </Col>
            </Row>
          </Card>

        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default RedpacketAdd;
