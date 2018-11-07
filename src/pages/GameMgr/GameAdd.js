import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
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

@connect(({ loading }) => ({
  submitting: loading.effects['game/add'],
}))
@Form.create()
class GameAdd extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'game/add',
          payload: values,
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper
        title="添加新游戏"
        content=""
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>
            <br/>
            <h2><b>游戏信息</b></h2>
            <br/>
            <FormItem {...formItemLayout} label="游戏名称">
              {getFieldDecorator('gameName', {
                rules: [
                  {
                    required: true,
                    message: "请输入游戏名称",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="游戏类型（多选）：">
              {getFieldDecorator('gameType')(
                <Select placeholder="请选择">
                  <Option value="0">全部</Option>
                  <Option value="1">休闲益智</Option>
                  <Option value="2">角色扮演</Option>
                  <Option value="3">战争策略</Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="开发者名称">
              {getFieldDecorator('developerName', {
                rules: [
                  {
                    required: true,
                    message: "请输入开发者名称",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="游戏URL链接">
              {getFieldDecorator('gameUrl', {
                rules: [
                  {
                    required: true,
                    message: "请输入游戏URL链接",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="游戏简介">
              {getFieldDecorator('gameDesc', {
                rules: [
                  {
                    required: true,
                    message: "请输入游戏简介，不超过300字",
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入游戏简介，不超过300字"
                  rows={4}
                />
              )}
            </FormItem>
            <br/>
            <h2><b>版本信息</b></h2>
            <br/>
            <FormItem {...formItemLayout} label="当前版本">
              {getFieldDecorator('currentVersion', {
                rules: [
                  {
                    required: false,
                    message: "请输入当前版本",
                  },
                ],
              })(<Input placeholder="V 请输入" />)}
            </FormItem>
            <br/>
            <h2><b>素材信息</b></h2>
            <br/>
            <FormItem {...formItemLayout} label="ICON链接">
              {getFieldDecorator('iconLink', {
                rules: [
                  {
                    required: true,
                    message: "请输入ICON链接",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="ICON预览">
              <label>ICON建议尺寸：100*100</label>
            </FormItem>

            <FormItem {...formItemLayout} label="封面图链接">
              {getFieldDecorator('faceLink', {
                rules: [
                  {
                    required: true,
                    message: "请输入封面图链接",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="封面图预览">
              <label>封面图建议尺寸：800*600</label>
            </FormItem>

            <FormItem {...formItemLayout} label="游戏截图1链接">
              {getFieldDecorator('picture1Link', {
                rules: [
                  {
                    required: true,
                    message: "请输入游戏截图1链接",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="游戏截图2链接">
              {getFieldDecorator('picture2Link', {
                rules: [
                  {
                    required: true,
                    message: "请输入游戏截图2链接",
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="截图预览">
              <label>游戏截图1</label>
              <label>游戏截图2</label>
            </FormItem>


 
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}  htmlType="reset">
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default GameAdd;
