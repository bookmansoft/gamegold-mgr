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
    proNum : 0,
    coinNum : 0,
    allNum: 0,
    confirmed : 0
  };
  componentDidMount() {
    const {dispatch } = this.props;
    let id = this.props.match.params.id || '';
    dispatch({
      type: 'gameprops/getAllGameList',
      payload: {}
    });
    if(id != ''){
      dispatch({
        type: 'gameprops/propsDetail',
        payload: {id: id}
      });
    }
    dispatch({
      type: 'gameprops/getwalletinfo',
      payload: {}
    }).then((ret) => {
      if (ret.code === 0 ) {
        this.setState({
          confirmed:JSON.stringify(ret.list.state.confirmed/100000000),
        });
      } 
    });
   
  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let requestData = new Array();
      let allCoinNum = values.coinNum * values.proNum;
      if(allCoinNum > this.state.confirmed){
        Modal.error({
          title: '错误',
          content: '生产消耗的游戏金总量不得高于钱包余额',
        });
        return;
      }
      let belongProps = values.belongProps;
      let belongPropsArr = belongProps.split("|");
      let oid = belongPropsArr[1] || '';

      if(oid == ''){
        Modal.error({
          title: '错误',
          content: '装备选择失败，请重试！',
        });
        return;
      }
      if(typeof values.proNum == 'undefined' ||  values.proNum== ''){
        Modal.error({
          title: '错误',
          content: '请输入生产数量！',
        });
        return;
      }
      if(typeof values.coinNum == 'undefined' ||  values.coinNum== ''){
        Modal.error({
          title: '错误',
          content: '请输入游戏金含量！',
        });
        return;
      }
      requestData['pid'] = values.belongGame;
      requestData['oid'] = oid;
      requestData['gold'] = values.coinNum;
      requestData['num'] = values.proNum;
      if(requestData){
            //调用道具上链
            dispatch({
              type: 'gameprops/propcreatelistremote',
              payload: requestData,
            }).then((ret) => {
              if (ret.code === 0 && ret.data===null) {
                Modal.success({
                  title: '恭喜',
                  content: '道具生产成功！',
                });
              } else {
                Modal.error({
                  title: '错误',
                  content: '道具生产失败，请重试！',
                });
              }
            })
      }
      
    });
  };
  handleGameChange = (value) => {
    const {dispatch } = this.props;
    //获取已经创建的本地道具库，未生产
    if(typeof value != 'undefined' && value != ''){
      dispatch({
        type: 'gameprops/getAllPropsByParams',
        payload: {cid:value, status:1}
      });
    }
    
  };
  
  handleProNum = (value) => {

    this.setState(
     {
      proNum: parseInt(value),
      allNum: this.state.coinNum * parseInt(value)
     }
    );
  };
  handleCoinNum = (value) => {
    this.setState(
      {
       coinNum: parseInt(value),
       allNum: this.state.proNum * parseInt(value)
      }
     );

  };


  render() {
    const { gameprops: { gameList,propByParams,propsDetail },submitting ,form: { getFieldDecorator }} = this.props;
    let walletInfo = this.state.walletInfo;
    let detail = propsDetail.data || [];
    let showDefaultProp = 0;
    if(detail !='' && propByParams == ''){
      showDefaultProp = 1
    }
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
                    initialValue:detail.cid,
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
                     {gameList.map(game => <Option  key={game.cp_id} value={game.cp_id}>{game.cp_text}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={11}>
                <FormItem>
                  {getFieldDecorator('belongProps', {
                    initialValue:detail.id+'|'+detail.oid,
                    rules: [
                      {
                        required: true,
                        message: "请选择道具",
                      },
                    ],
                  })(
                    <Select>
                      {showDefaultProp ? <Option value={detail.id+'|'+detail.oid}>{detail.props_name}</Option> : propByParams.map(proplist => <Option key={proplist.id+'|'+proplist.oid} >{proplist.props_name}</Option>)}
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
                  }
                ],
              })(
                <InputNumber placeholder={formatMessage({ id: 'form.weight.placeholder' })+'数量'} onChange = {this.handleProNum} min={1}  style={{ width: "50%" }} />
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
              <InputNumber placeholder={formatMessage({ id: 'form.weight.placeholder' })+'单位'} onChange = {this.handleCoinNum}  min={1}  style={{ width: "50%" }}/>
            )}
            </FormItem>
            <FormItem {...formItemLayout} label= "本次生产消耗游戏金总量">
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
