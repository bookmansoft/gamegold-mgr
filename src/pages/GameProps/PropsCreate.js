import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Icon ,
  List,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const gameData = ['游戏1', '游戏2'];
const propsData = {
  '游戏1': ['套装1', '套装2', '套装3'],
  '游戏2': ['套装4', '套装5', '套装6'],
};
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))

@Form.create()
class PropsCreate extends PureComponent {
  state = {
    game: propsData[gameData[0]],
    gameProps: propsData[gameData[0]][0],
    iconPreview : '',
    iconMoreImg : [],
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
  removeInputIconPreview = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
    let iconMoreImg = this.state.iconMoreImg;
    iconMoreImg[k] = '';
    this.setState({ iconMoreImg:  iconMoreImg});

  }

  addInputIconPreview = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    //按照最大值+1作为新的keys值
    let maxNum = 0;
    if(keys.length > 0){
      maxNum = Math.max.apply(0, keys) + 1;
    }else{
      maxNum = 0;
    }
    const nextKeys = keys.concat(maxNum);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  iconPreviewFun = e => {
    this.setState({ iconPreview: e.target.value });
  };
  iconMoreImgFun = (e, k) => {
    let moreImg = this.state.iconMoreImg;
    moreImg[k] = e.target.value;
    this.setState({ iconMoreImg: moreImg });
  };

  render() {
    const { submitting } = this.props;
    const { game,gameProps,iconPreview} = this.state;
    const iconMoreImg = this.state.iconMoreImg.filter(v => v !== '');
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
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const addIconPreviewItems = keys.map((k, index) => {
      return (
        <FormItem
          required={false}
          key={k}
        >
          {getFieldDecorator(`iconMore[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "请输入或者删除.",
            }],
          })(
            <Input placeholder={formatMessage({ id: 'form.input.placeholder' })} style={{ width: '60%', marginRight: 8 }} onChange={(e)=>this.iconMoreImgFun(e, k)}/>
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.removeInputIconPreview(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    return (
      <PageHeaderWrapper
        title= "创建新道具"
        content= "在这里您可以创建全新的道具品类"
      >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>

        <Card title="道具信息" bordered={false}>
            <FormItem {...formItemLayout} label= "从游戏中选择">
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
                  style={{ width: "50%" }}
                  onChange={this.handleGameChange}
                >
                  {gameData.map(game => <Option key={game}>{game}</Option>)}
                </Select>

              )}

              {getFieldDecorator('belongProps', {
                rules: [
                  {
                    required: true,
                    message: "请选择装备",
                  },
                ],
              })(
                <Select
                  style={{ width: "50%" }}
                  setFieldsValue={this.state.gameProps}
                  onChange={this.onPropsChange}
                >
                  {game.map(props => <Option key={props}>{props}</Option>)}
                </Select>
              )}


            </FormItem>

            <FormItem {...formItemLayout} label= "道具名称">
              {getFieldDecorator('propsName', {
                rules: [
                  {
                    required: true,
                    message: "道具名称必须填写",
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.input.placeholder' })} />)}
            </FormItem>
            <FormItem {...formItemLayout} label= "道具类型">
              {getFieldDecorator('propsType', {
                rules: [{ required: true, message: '请选择道具类型' }],
              })(
                <Select placeholder={formatMessage({ id: 'form.select.placeholder' })}>
                  <Option value="private">私密</Option>
                  <Option value="public">公开</Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label= "所属游戏">
              {getFieldDecorator('game', {
                rules: [{ required: true, message: '请选择所属游戏' }],
              })(
                <Select placeholder={formatMessage({ id: 'form.select.placeholder' })}>
                  <Option value="private">私密</Option>
                  <Option value="public">公开</Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="道具简介">
              {getFieldDecorator('desc', {
                rules: [
                  {
                    required: true,
                    message: "请输入道具简介",
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder= {formatMessage({ id: 'form.input.placeholder' })}
                  rows={4}
                />
              )}
            </FormItem>

        </Card>

          <Card title="素材信息" bordered={false}>
            <FormItem {...formItemLayout} label= "ICON链接">
              {getFieldDecorator('iconUrl', {
                rules: [
                  {
                    required: true,
                    message: "ICON链接必须填写",
                  },
                ],
              })(<Input placeholder={formatMessage({ id: 'form.input.placeholder' })} onChange={this.iconPreviewFun}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label= "ICON预览">
              <img width={120} src={iconPreview} />
            </FormItem>
            <FormItem {...formItemLayout} label= "道具说明图2链接">
              {addIconPreviewItems}
              <Button type="dashed" onClick={this.addInputIconPreview} style={{ width: '60%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </FormItem>
            <FormItem {...formItemLayout} label= "说明图预览">
              <List
                grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={iconMoreImg}
                renderItem={item =>
                  <List.Item>
                    <img width={120} src={item}/>
                  </List.Item>
                }
              />

            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="form.cancel" />
              </Button>
            </FormItem>

          </Card>

        </Form>


      </PageHeaderWrapper>
    );
  }
}

export default PropsCreate;
