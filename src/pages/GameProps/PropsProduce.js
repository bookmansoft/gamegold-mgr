import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Select,
  Button,
  InputNumber,
  Col,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const gameData = ['游戏1', '游戏2'];
const propsData = {
  '游戏1': ['套装1', '套装2', '套装3'],
  '游戏2': ['套装4', '套装5', '套装6'],
};
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))

@Form.create()
class PropsProduce extends PureComponent {
  state = {
    game: propsData[gameData[0]],
    gameProps: propsData[gameData[0]][0]
  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      /*if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }*/
    });
  };
  handleGameChange = (value) => {
    this.setState({
      game: propsData[value],
      gameProps: propsData[value][0],
    });
  };

  onPropsChange = (value) => {
    this.setState({
      gameProps: value,
    });
  };


  render() {
    const { submitting } = this.props;
    const { game } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
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
      <PageHeaderWrapper title= "生产道具" >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label= "选择游戏及道具">
            <Col span={11}>
              <FormItem>
                {getFieldDecorator('belongGame', {
                  rules: [
                    {
                      required: true,
                      message: "请选择游戏",
                    },
                  ],
                })(
                  <Select
                    setFieldsValue={gameData[0]}
                    onChange={this.handleGameChange}
                  >
                    {gameData.map(game => <Option key={game}>{game}</Option>)}
                  </Select>

                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem>
                {getFieldDecorator('belongProps', {
                  rules: [
                    {
                      required: true,
                      message: "请选择装备",
                    },
                  ],
                })(
                  <Select
                    setFieldsValue={this.state.gameProps}
                    onChange={this.onPropsChange}
                  >
                    {game.map(props => <Option key={props}>{props}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
          </FormItem>
            <FormItem {...formItemLayout} label= "生产数量">
              {getFieldDecorator('proNum', {
                rules: [
                  {
                    required: true,
                    message: "请输入数量",
                  },
                ],
              })(
                <InputNumber placeholder={formatMessage({ id: 'form.weight.placeholder' })} min={1}  addonAfter="件" style={{ width: "50%" }} />
              )}
            </FormItem>
          <FormItem {...formItemLayout} label= "单件道具含游戏金量">
            {getFieldDecorator('coinNum', {
              rules: [
                {
                  required: true,
                  message: "请输入游戏金量",
                },
              ],
            })(
              <InputNumber placeholder={formatMessage({ id: 'form.weight.placeholder' })} min={1}  addonAfter="单位" style={{ width: "50%" }}/>
            )}
            </FormItem>
            <FormItem {...formItemLayout} label= "本次生产消耗游戏金总量">
              50 GGD （当前钱包余额 60 GGD）
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {`开始生产`}
              </Button>
            </FormItem>
        </Form>


      </PageHeaderWrapper>
    );
  }
}

export default PropsProduce;
