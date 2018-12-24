import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Select,
  Button,
  Input,
  Card, Modal, Col, Row
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import PropsSelectUser from '@/components/PropsSelectUser';
const FormItem = Form.Item;
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
    selectedRows: [],
    selectedRowKeys: [],
    stock: 0,
    confirmed: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    let address = this.props.match.params.address || '';
    console.log('address is');
    console.log(address);
    console.log('address is end');
    dispatch({
      type: 'gameprops/getAllGameList',
      payload: {}
    });
    /* if (id != '') {
      dispatch({
        type: 'gameprops/propsDetail',
        payload: { id: id }
      });
    } */

    dispatch({
      type: 'gameprops/getwalletinfo',
      payload: {}
    }).then((ret) => {
      if (ret.code === 0) {
        this.setState({
          confirmed: JSON.stringify(ret.list.state.confirmed/1000000),
        });
      }
    });

  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {


      let addrObject = this.state.selectedRows;
      let belongProps = values.belongProps;
      let belongPropsArr = belongProps.split("|");
      let id = belongPropsArr[0] || '';
      let stock = belongPropsArr[2] || 0;
      if (id == '') {
        Modal.error({
          title: '错误',
          content: '道具选择失败，请重试！',
        });
        return;
      }
      if (addrObject.length == 0) {
        Modal.error({
          title: '错误',
          content: '请选择用户！',
        });
        return;
      }
      if (stock < addrObject.length) {
        Modal.error({
          title: '错误',
          content: '赠送数量超过了道具库存！',
        });
        return;
      }
      let addr = new Array();
      let $idx = 0;
      for (let $value of addrObject) {
        addr[$idx] = $value.addr;
        $idx++;
      }
      if (id != '' && addr.length > 0) {
        //调用道具上链
        dispatch({
          type: 'gameprops/sendlistremote',
          payload: { id: id, addr: addr }
        }).then((ret) => {
          if (ret.code == 1) {
            Modal.success({
              title: '恭喜',
              content: '赠送成功！',
            });
          } else {
            Modal.error({
              title: '错误',
              content: ret.msg || '赠送失败请重试！',
            });
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
    const { dispatch } = this.props;
    //获取已经创建的本地道具库，未生产
    if (typeof value != 'undefined' && value != '') {
      dispatch({
        type: 'gameprops/getAllPropsByParams',
        payload: { cid: value, status: 1 }
      });
    }
  };
  onPropsChange = (value) => {
    const { form } = this.props;
    let propsArr = value.split("|");
    let id = propsArr[0] || '';
    let oid = propsArr[1] || '';
    let stock = propsArr[2] || '';
    form.setFieldsValue({
      stock: stock || 0,
    });
  };
  render() {
    const { submitting, gameprops: { gameList, propByParams, propsDetail }, form: { getFieldDecorator } } = this.props;
    const { visible, selectedRows, selectedRowKeys } = this.state;
    let detail = propsDetail.data || [];
    let showDefaultProp = 0;
    if (detail != '' && propByParams == '') {
      showDefaultProp = 1;
    }

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
              {selectedRows.length} 人
          </FormItem>
          </Card>

          <Card title="选择道具" bordered={false} headStyle={{ fontWeight: 600 }}>
            <FormItem {...formItemLayout} label="选择游戏及道具">
              <Col span={11}>
                <FormItem>
                  {getFieldDecorator('belongGame', {
                    initialValue: detail.cid,
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
                    initialValue: typeof detail.id != 'undefined' && typeof detail.oid != 'undefined' ? detail.id + '|' + detail.oid + '|' + detail.stock : '',
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
                      {showDefaultProp == 1 ? <Option value={detail.id + '|' + detail.oid + '|' + detail.stock}>{detail.props_name}</Option> : propByParams.map(propbyparams => <Option key={propbyparams.id + '|' + propbyparams.oid + '|' + propbyparams.stock} >{propbyparams.props_name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </FormItem>
          </Card>

          <Card title="结算" bordered={false} headStyle={{ fontWeight: 600 }}>
            <FormItem {...formItemLayout} label="道具商城标价">
              100 吨/件
            </FormItem>
            <FormItem {...formItemLayout} label="道具含金等级">
              橙
            </FormItem>
            <FormItem {...formItemLayout} label="本次赠送将消耗">
              10000 吨
            </FormItem>
            <FormItem {...formItemLayout} label="账户备用金余额">
            this.state.confirmed}吨
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
