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
  Modal
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const { Option } = Select;



@connect(({ gameprops, loading }) => ({
  gameprops,
  loading: loading.models.gameprops,
}))

@Form.create()
class PropsProduce extends PureComponent {
  state = {
    proNum: 0,
    gold_num: 0,
    allNum: 0,
    confirmed: 0,
    defaultDetail: {},
    defaultPropList: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    let id = this.props.match.params.id || '';
    dispatch({
      type: 'gameprops/getAllGameList',
      payload: {}
    });
    if (id != '') {
      dispatch({
        type: 'gameprops/propsDetailReturn',
        payload: { id: id }
      }).then((ret) => {
        if (ret.code === 0) {
          this.setState({
            defaultDetail: ret.data,
            gold_num: ret.data.gold_num,
          });
          dispatch({
            type: 'gameprops/getAllPropsByParamsReturn',
            payload: { cid: ret.data.cid }
          }).then((ret) => {
            this.setState({
              defaultPropList: ret,
            });
          });
        }
      });

    }
    dispatch({
      type: 'gameprops/getwalletinfo',
      payload: {}
    }).then((ret) => {
      if (ret.code === 0) {
        this.setState({
          confirmed: JSON.stringify(ret.list.state.confirmed),
        });
      }
    });

  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let requestData = new Array();

      let belongProps = values.belongProps;
      console.log(belongProps);
      return;
      let belongPropsArr = belongProps.split("|");
      let oid = belongPropsArr[0] || '';
      let gold_num = belongPropsArr[1] || '';
      if (oid == '' || gold_num == '') {
        Modal.error({
          title: '错误',
          content: '装备选择失败，请重试！',
        });
        return;
      }
      let allCoinNum = gold_num * values.proNum;
      if (allCoinNum > this.state.confirmed) {
        Modal.error({
          title: '错误',
          content: '生产消耗的游戏金总量不得高于钱包余额',
        });
        return;
      }
      if (typeof values.proNum == 'undefined' || values.proNum == '') {
        Modal.error({
          title: '错误',
          content: '请输入生产数量！',
        });
        return;
      }

      requestData['id'] = id;
      //requestData['cid'] = values.belongGame;
      requestData['cid'] = 'e26f7a20-fcef-11e8-af9c-9f3accf37b7f';//TODO 后期根据cp调整删除这个
      requestData['oid'] = oid;
      requestData['num'] = values.proNum;
      console.log(requestData);
      return;

      if (requestData) {
        //调用道具上链
        dispatch({
          type: 'gameprops/propcreatelistremote',
          payload: requestData,
        }).then((ret) => {
          if (ret.code == 1) {
            Modal.success({
              title: '恭喜',
              content: '道具生产成功！',
            });
          } else {
            Modal.error({
              title: '错误',
              content: ret.msg || '道具生产失败，请重试！',
            });
          }
        })
      }

    });
  };
  handleGameChange = (value) => {
    const { dispatch } = this.props;
    //获取已经创建的本地道具库，未生产
    if (typeof value != 'undefined' && value != '') {
      dispatch({
        type: 'gameprops/getAllPropsByParams',
        payload: { cid: value }
      });
    }

  };

  onPropsChange = (value) => {
    let belongPropsArr = value.split("|");
    let gold_num = belongPropsArr[1] || '';
    gold_num = parseInt(gold_num);
    if(gold_num > 0){
      this.setState({
        gold_num: gold_num,
      });
    }

    
  };

  handleProNum = (value) => {

    this.setState(
      {
        proNum: parseInt(value),
        allNum: this.state.gold_num * parseInt(value)
      }
    );
  };


  render() {
    const { gameprops: { gameList, propByParams }, submitting, form: { getFieldDecorator } } = this.props;
    let defaultDetail = this.state.defaultDetail;
    let defaultPropList = this.state.defaultPropList;
    let showDefaultProp = 0;
    if (defaultDetail != '' && defaultPropList == '') {
      showDefaultProp = 1;
    }
    console.log(defaultPropList);
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
      <PageHeaderWrapper title="" >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Card title="生产道具" bordered={false} headStyle={{ fontWeight: 600 }}>
            <FormItem {...formItemLayout} label="选择游戏及道具">
              <Col span={11}>
                <FormItem>
                  {getFieldDecorator('belongGame', {
                    initialValue: typeof defaultDetail.cid != 'undefined' ? defaultDetail.cid : '',
                    rules: [
                      {
                        required: true,
                        message: "请选择游戏",
                      },
                    ],
                  })(
                    <Select
                      onSelect={this.handleGameChange}
                    >
                      {gameList.map(game => <Option key={game.cp_id} value={game.cp_id}>{game.cp_text}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={11}>
                <FormItem>
                  {getFieldDecorator('belongProps', {
                    initialValue: typeof defaultDetail.id != 'undefined' && typeof defaultDetail.gold_num != 'undefined' ? defaultDetail.id + '|' + defaultDetail.gold_num : '',
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
                      {showDefaultProp == 1 ? defaultPropList.map(defaultProp => <Option key={defaultProp.id + '|' + defaultProp.gold_num} >{defaultProp.props_name}</Option>) : propByParams.map(propbyparams => <Option key={propbyparams.oid + '|' + propbyparams.gold_num} >{propbyparams.props_name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </FormItem>
            <FormItem {...formItemLayout} label="生产数量">
              {getFieldDecorator('proNum', {
                rules: [
                  {
                    required: true,
                    message: "请输入数量",
                  }
                ],
              })(
                <InputNumber placeholder={formatMessage({ id: 'form.weight.placeholder' }) + '数量'} onChange={this.handleProNum} min={1} style={{ width: "50%" }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="单件道具含游戏金量">
              <InputNumber value={this.state.gold_num} disabled={true} style={{ width: "50%" }} />
            </FormItem>
            <FormItem {...formItemLayout} label="本次生产消耗游戏金总量">
              {this.state.allNum} GGD （当前钱包余额 {this.state.confirmed} GDD）
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
