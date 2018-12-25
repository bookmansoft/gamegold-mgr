import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import {
  Form,
  Select,
  Button,
  Card, Modal, Col
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Option } = Select;


@connect(({ gameprops, loading }) => ({
  gameprops,
  loading: loading.models.gameprops,
}))

/*@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))*/

@Form.create()
class PropsPresent extends PureComponent {
  state = {
    visible: false,
    currentAddr: [],
    selectedRowKeys: [],
    stock: 0,
    confirmed: 0,
    currentPropDetail: {},
    totalPrice: 0
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
      type: 'gameprops/getwalletinfo',
      payload: {}
    }).then((ret) => {
      if (ret.code === 0) {
        this.setState({
          confirmed: JSON.stringify(ret.list.state.confirmed / 1000000),
        });
      }
    });

  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let addr = this.state.currentAddr;
      let id = values.belongProps;
      if (id == '') {
        Modal.error({
          title: '错误',
          content: '道具选择失败，请重试！',
        });
        return;
      }
      if (addr.length == 0) {
        Modal.error({
          title: '错误',
          content: '请选择用户！',
        });
        return;
      }
      if (id != '' && addr.length > 0) {
        //调用道具上链
        dispatch({
          type: 'gameprops/sendlistremote',
          payload: { id: id, addr: addr }
        }).then((ret) => {
          if (ret.code == 1) {
            confirm({
              title: '赠送成功',
              content: '道具赠送成功！',
              okText: '返回道具列表',
              okType: 'primary',
              cancelText: '赠送道具',
              cancelType: 'primary',
              onOk() {
                router.push('/gameprops/list');
              },
              onCancel() {
                router.push('/usermgr/userlist');
              },
            });
            return;
          } else {
            Modal.error({
              title: '错误',
              content: ret.msg || '赠送失败请重试！',
            });
            return;
          }
        });

      } else {
        Modal.error({
          title: '错误',
          content: '赠送失败请重试！',
        });
        return;
      }

    });
  };
  handleGameChange = (value) => {
    const { form,dispatch } = this.props;
    //清空当前道具选项
    form.setFieldsValue({
      belongProps: '',
    });
    //获取已经创建的本地道具库
    if (typeof value != 'undefined' && value != '') {
      dispatch({
        type: 'gameprops/getAllPropsByParams',
        payload: { cid: value }
      });
    }
  };
  onPropsChange = (value) => {
    const { dispatch } = this.props;
    let id = value;
    if (!!id) {
      dispatch({
        type: 'gameprops/propsDetailReturn',
        payload: { id: id }
      }).then((ret) => {
        if (ret.code === 0) {
          let addr = this.state.currentAddr;
          let detail = ret.data;
          let totalPrice = addr.length * detail.props_price;
          totalPrice = Math.round(totalPrice / 1000000 * 100) / 100;
          console.log(totalPrice);
          this.setState({
            currentPropDetail: detail,
            totalPrice: totalPrice
          });
        }
      });

    }
  };
  render() {
    const { submitting, gameprops: { gameList, propByParams }, form: { getFieldDecorator } } = this.props;
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

          <Card title="已选择赠送对象" bordered={false} headStyle={{ fontWeight: 600 }}>
            <FormItem {...formItemLayout} label="已添加接收人数量">
              {currentAddr.length} 人
          </FormItem>
          </Card>

          <Card title="选择道具" bordered={false} headStyle={{ fontWeight: 600 }}>
            <FormItem {...formItemLayout} label="选择游戏及道具">
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
                    >
                      {gameList.map(game => <Option key={game.cp_id} value={game.cp_id}>{game.cp_text}</Option>)}
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
                      {propByParams.map(propbyparams => <Option key={propbyparams.id} >{propbyparams.props_name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </FormItem>
          </Card>

          <Card title="结算" bordered={false} headStyle={{ fontWeight: 600 }}>
            <FormItem {...formItemLayout} label="道具商城标价">
              {currentPropDetail.props_price / 1000000 || ''} 吨/件
            </FormItem>
            <FormItem {...formItemLayout} label="道具含金等级">
              {currentPropDetail.props_rank || ''}橙
            </FormItem>
            <FormItem {...formItemLayout} label="本次赠送将消耗">
              {totalPrice} 吨
            </FormItem>
            <FormItem {...formItemLayout} label="账户备用金余额">
              {Math.round(confirmed / 1000000 * 100) / 100}吨
            </FormItem>
          </Card>


          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {`确定赠送`}
            </Button>
            <Button style={{ marginLeft: 8 }}>
              <FormattedMessage id="form.cancel" />
            </Button>
          </FormItem>
        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default PropsPresent;
