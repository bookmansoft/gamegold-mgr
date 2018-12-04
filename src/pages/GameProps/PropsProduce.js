import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Select,
  Button,
  InputNumber,
  Col,
  Card,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

/*
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
*/

@connect(({ gameprops, loading }) => ({
  gameprops,
  loading: loading.models.gameprops,
}))

@Form.create()
class PropsProduce extends PureComponent {
  state = {};
  componentDidMount() {
    const {dispatch } = this.props;
    dispatch({
      type: 'gameprops/getAllGameList',
      payload: {}
    });
  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      /*if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }*/
    });
  };
  handleGameChange = (value) => {
    const {dispatch } = this.props;
    //获取已经创建的本地道具库，未生产
    dispatch({
      type: 'gameprops/getPropsByGame',
      payload: {id:value.key, name:value.label}
    });
  };
  onPropsChange = (value) => {
    const { form } = this.props;
    let curGamePropsList = this.props.gameprops.gamePropsList;
    //根据id筛选当前选中的option 取其库存
    let selectCur = curGamePropsList.filter(val => val.id === value);
    form.setFieldsValue({
      propsNum: selectCur[0].stock || 0,
    });
  };


  render() {
    const { gameprops: { gameList,gamePropsList },submitting } = this.props;
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
      <PageHeaderWrapper title= "" >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Card title="生产道具" bordered={false} headStyle={{fontWeight:600}}>
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
                      onChange={this.handleGameChange}
                      labelInValue ={true}
                    >
                     {gameList.map(game => <Option key={game.id}>{game.cp_text}</Option>)}
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
                        message: "请选择道具",
                      },
                    ],
                  })(
                    <Select
                      onChange={this.onPropsChange}
                    >
                      {gamePropsList.map(props => <Option key={props.id}>{props.name}</Option>)}
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
            </Card>
        </Form>


      </PageHeaderWrapper>
    );
  }
}

export default PropsProduce;
