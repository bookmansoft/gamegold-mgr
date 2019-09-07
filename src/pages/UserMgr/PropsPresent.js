import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import {
  Form,
  Select,
  Button,
  Card, Modal, Col,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;

import DescriptionList from '@/components/DescriptionList';
const { Description } = DescriptionList;

@connect(({ gameprops, loading }) => ({
  gameprops,
  loading: loading.models.gameprops,
}))

@Form.create()
class PropsPresent extends PureComponent {
  state = {
    visible: false,
    currentAddr: [],
    confirmed: 0,
    currentGame: {},
    currentPropDetail: {},
    totalPrice: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    let addr = this.props.match.params.addr || '';
    if (addr != '') {
      addr = JSON.parse(addr);
      this.setState({
        currentAddr: addr
      })
    }

    dispatch({
      type: 'gameprops/getAllGameList',
      payload: {}
    });
    dispatch({
      type: 'gameprops/getBalanceAll',
      payload: {}
    }).then((ret) => {
      if (ret.code === 0) {
        this.setState({
          confirmed: JSON.stringify(ret.data.confirmed),
        });
      }
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let addr = this.state.currentAddr;

      if (!values.belongProps) {
        Modal.error({ title: '错误', content: '道具选择失败，请重试！' });
        return;
      }

      if (addr.length == 0) {
        Modal.error({ title: '错误', content: '请选择用户！' });
        return;
      }

      let prop = JSON.parse(values.belongProps);
      prop.cid = this.state.currentGame.cp_id,

      dispatch({
        type: 'gameprops/sendlistremote',
        payload: { 
          prop: prop, 
          addr: addr,
        },
      }).then((ret) => {
        if (!!ret && ret.code == 0) {
          confirm({
            title: '赠送成功',
            content: '道具赠送成功！',
            okText: '返回道具列表',
            okType: 'primary',
            onOk() {
              router.push('/usermgr/userlist');
            },
          });
        } else {
          Modal.error({ title: '错误', content: !!ret ? ret.msg : '赠送失败请重试！' });
        }
      }).catch(e=>{
        Modal.error({ title: '错误', content: e.message });
      });
    });
  };
  
  handleGameChange = (value) => {
    value = JSON.parse(value);

    this.setState({
      currentGame: value,
    });

    const { form, dispatch } = this.props;
    
    //清空当前道具选项
    form.setFieldsValue({
      belongProps: '',
    });

    //获取已经创建的本地道具库
    if (!!value) {
      dispatch({
        type: 'gameprops/getPropsByGame',
        payload: {
          cp_url: value.cp_url,
        },
      });
    }
  };

  onPropsChange = (value) => {
    /**
     * 道具品质分为白绿蓝紫橙, 分别对应于1-5%,2-10%,3-20%,4-50%,5-80%
     */

    this.setState({
      currentPropDetail: JSON.parse(value),
      totalPrice: 0,
    });
  };

  //"props_rank": "{props_rank}", //白绿蓝紫橙,对应于1-5%,2-10%,3-20%,4-50%,5-80%
  getRankNote(rank) {
    let rankNote = '';
    switch (parseInt(rank)) {
      case 1:
        rankNote = '5%(白)';
        break;
      case 2:
        rankNote = '10%(绿)';
        break;
      case 3:
        rankNote = '20%(蓝)';
        break;
      case 4:
        rankNote = '50%(紫)';
        break;
      case 5:
        rankNote = '80%(橙)';
        break;
      default:
        rankNote = '';
        break;
    }
    return rankNote;
  };

  render() {
    const { submitting, gameprops: { gameList, gamePropsList }, form: { getFieldDecorator } } = this.props;
    const { currentAddr, currentPropDetail, totalPrice, confirmed } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
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
      <PageHeaderWrapper title="道具赠送" >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Card title={`赠送人数: ${currentAddr.length}`} bordered={false} headStyle={{ fontWeight: 600 }}>
            {currentAddr.map(it=><FormItem {...formItemLayout} key={it}>{it}</FormItem>)}
          </Card>
          <Card title="选择游戏道具" bordered={false} headStyle={{ fontWeight: 600 }}>
            <Col span={5}>
              <span>选取游戏</span>
              <FormItem>
                {getFieldDecorator('belongGame', {
                  rules: [
                    {
                      required: true,
                      message: "请选择游戏",
                    },
                  ],
                })(
                  <Select onChange={this.handleGameChange}>
                    {gameList.map(game => <Option key={game.cp_id} value={JSON.stringify(game)}>{game.cp_text}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={1}></Col>
            <Col span={5}>
            <span>选取道具</span>
              <FormItem>
                {getFieldDecorator('belongProps', {
                  rules: [
                    {
                      required: true,
                      message: "请选择道具",
                    },
                  ],
                })(
                  <Select onChange={this.onPropsChange}>
                    {gamePropsList.map(propbyparams => <Option key={propbyparams.id} value={JSON.stringify(propbyparams)}>{propbyparams.props_name}</Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Card>

          <Card bordered={false} headStyle={{ fontWeight: 600 }} title="道具信息预览">
            <DescriptionList size="large" style={{ marginBottom: 32 }}>
              <Description term="道具ID">{currentPropDetail.id || ''}</Description>
              <Description term="道具名称">{currentPropDetail.props_name || ''}</Description>
              <Description term="道具属性">{currentPropDetail.props_type || ''}</Description>
              <Description term="所属游戏">{this.state.cp_text || ''}</Description>
              <Description term="添加时间">{currentPropDetail.props_createtime || ''}</Description>
              <Description term="销售状态">{currentPropDetail.props_status || ''}</Description>
              <Description term="商城标价">{currentPropDetail.props_price || ''}</Description>
              <Description term="含金等级">{this.getRankNote(currentPropDetail.props_rank)}</Description>
            </DescriptionList>
            <DescriptionList size="large">
              <Description term="道具描述">{currentPropDetail.props_desc || ''}</Description>
              <Description span={24} style={{ marginTop: 32 }}>
                <img width={120} src={currentPropDetail.icon || ''} />
              </Description>
            </DescriptionList>
          </Card>            

          <Card title="结算" bordered={false} headStyle={{ fontWeight: 600 }}>
            <FormItem {...formItemLayout} label="单 价">{parseFloat(currentPropDetail.props_price/100000).toFixed(3)}千克/件</FormItem>
            <FormItem {...formItemLayout} label="含 金 量">{this.getRankNote(currentPropDetail.props_rank)}</FormItem>
            <FormItem {...formItemLayout} label="费 用">{totalPrice}千克</FormItem>
            <FormItem {...formItemLayout} label="备 用 金">{ parseFloat(confirmed / 100000).toFixed(3)}千克</FormItem>
          </Card>

          <Card bordered={false} headStyle={{ fontWeight: 600 }}>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {`确定赠送`}
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

export default PropsPresent;
