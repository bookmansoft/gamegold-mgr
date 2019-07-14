import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import moment from 'moment';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Row,
  Col,
  Divider,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ gamelist, loading }) => ({
  gamelist,
  loading: loading.models.gamelist,
  submitting: loading.effects['gamelist/addGame'],
}))
@Form.create()
class GameAdd extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
  }

  //创建
  handleCreate = (theData) => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'gamelist/addGame',
      payload: theData,
    }).then((ret) => {
      if (ret.code === 0) {
        router.push('/gamemgr/gameaddsuccess');
      } else {
        router.push('/gamemgr/gameadderror');
      };
    }
    );
  };

  renderImg = (text) => {
    if (text && text.length) {
      const imgs = text.map((item, index) =>
        <img width={120} src={item} key={index} />
      )
      return imgs;
    }
  }

  /**
   * 通过用户录入的URL地址，集采CP信息填充至页面
   */
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'gamelist/fetchGame',
          payload: values,
        });
      };
    });
  }
  render() {
    const { submitting } = this.props;
    const {
      gamelist: { record },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };

    const formItemLayout2 = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper title="添加新游戏" content="">
        <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>
          <Card bordered={false}>
            <Row style={{ marginBottom: 32 }}>
              <br />
              <h2><b>发布游戏</b></h2>
              <br />
            </Row>
            <Row>
              <FormItem {...formItemLayout} label="游戏名称">
                {getFieldDecorator('cp_name', {
                  rules: [
                    {
                      required: true,
                      message: "请输入游戏名称",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="游戏数据接口地址">
                {getFieldDecorator('cp_url', {
                  rules: [
                    {
                      required: true,
                      message: "请输入游戏URL链接",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout2} label="使用邀请奖励">
                  {getFieldDecorator('use_invite_share', {
                    initialValue: '1',
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(
                  <Select placeholder="请选择" style={{ width: '60px',display:'block', }}>
                    <Option value="1">是</Option>
                    <Option value="0">否</Option>
                  </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout2} label="邀请奖励比例">
                  {getFieldDecorator('invite_share', {
                    initialValue: '15',
                  })
                    (
                    <Select
                      placeholder='邀请奖励比例'
                      style={{
                        width: '100px',
                        // display: getFieldValue('use_invite_share') === '1' ? 'block' : 'none',
                      }}
                      disabled={getFieldValue('use_invite_share') === '0'}
                    >
                      <Option value="1">1%</Option>
                      <Option value="2">2%</Option>
                      <Option value="3">3%</Option>
                      <Option value="4">4%</Option>
                      <Option value="5">5%</Option>
                      <Option value="6">6%</Option>
                      <Option value="7">7%</Option>
                      <Option value="8">8%</Option>
                      <Option value="9">9%</Option>
                      <Option value="10">10%</Option>
                      <Option value="11">11%</Option>
                      <Option value="12">12%</Option>
                      <Option value="13">13%</Option>
                      <Option value="14">14%</Option>
                      <Option value="15">15%</Option>
                      <Option value="16">16%</Option>
                      <Option value="17">17%</Option>
                      <Option value="18">18%</Option>
                      <Option value="19">19%</Option>
                      <Option value="20">20%</Option>
                      <Option value="21">21%</Option>
                      <Option value="22">22%</Option>
                      <Option value="23">23%</Option>
                      <Option value="24">24%</Option>
                      <Option value="25">25%</Option>
                      <Option value="26">26%</Option>
                      <Option value="27">27%</Option>
                      <Option value="28">28%</Option>
                      <Option value="29">29%</Option>
                      <Option value="30">30%</Option>
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col md={4}>
                <Button type="primary" htmlType="submit" loading={submitting}>验证</Button>
              </Col>
            </Row>
            <br />
            <h2><b>基本信息预览</b></h2>
            <br />
            <Row style={{ marginBottom: 32 }}>
              <Col sm={8} xs={12}>游戏名称：{record.cp_text}</Col>
              <Col sm={8} xs={12}>游戏简称：{record.cp_name}</Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={8} xs={12}>
                游戏类型：{record.cp_type}
              </Col>
              <Col sm={8} xs={12}>
                开发者：{record.develop_name}
              </Col>
              <Col sm={8} xs={12}>
                发布时间：{!!record.publish_time && moment(record.publish_time * 1000).format('YYYY-MM-DD HH:mm:ss')}
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>URL地址：{record.cp_url}</Col>
            </Row>

            <Divider style={{ margin: '20px 0' }} />
            <Row style={{ marginBottom: 16 }}>
              <Col sm={24} xs={24}><h3><b>版本信息</b></h3></Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={8} xs={12}>
                当前版本：{record.cp_version}
              </Col>
              <Col sm={8} xs={12}>
                更新时间：{record.publish_time}
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>更新内容：{record.cp_desc}</Col>
            </Row>

            <Divider style={{ margin: '20px 0' }} />
            <Row style={{ marginBottom: 16 }}>
              <Col sm={24} xs={24}><h3><b>素材信息</b></h3></Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                游戏图标：<img width={120} src={record.icon_url} />
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                封面图片：<img width={120} src={record.face_url} />
              </Col>
            </Row>
            <Row style={{ marginBottom: 32 }}>
              <Col sm={24} xs={24}>
                游戏截图：{this.renderImg(record.pic_urls)}
              </Col>
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" onClick={() => this.handleCreate(record)}>提交</Button>
            </FormItem>
          </Card>
        </Form>

      </PageHeaderWrapper>
    );
  }
}

export default GameAdd;
