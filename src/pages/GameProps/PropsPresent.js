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
    stock:0
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
  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(this.state.selectedRows);
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
    if(typeof value != 'undefined' && value != ''){
      dispatch({
        type: 'gameprops/getAllPropsByParams',
        payload: {cid:value, status:1}
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
  showPresentModal = () => {
    this.setState({
      visible: true,
    });
  };
  handlePresentCancel = () => {
    this.setState({
      visible: false,
    });
  };
  handlePresentSubmit = (e) => {
    //获取到选择的用户信息
    //console.log(this.state.selectedRows);
    //关闭选择弹窗
    this.setState({
      visible: false,
    });

  };
  SetSelectedRowKeys = (val) => {
    this.setState({
      selectedRowKeys : val
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };
  render() {
    const { submitting, gameprops: { gameList,propByParams,propsDetail },form: { getFieldDecorator }} = this.props;
    const { visible,selectedRows,selectedRowKeys} = this.state;
    let detail = propsDetail.data || [];
    let showDefaultProp = 0;
    if(detail !='' && propByParams == ''){
      showDefaultProp = 1;
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
      <PageHeaderWrapper title= "道具赠送" >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Card title="选择道具" bordered={false} headStyle={{fontWeight:600}}>
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
                      onChange={this.handleGameChange}
                    >
                     {gameList.map(game => <Option  key={game.cp_id} value={game.cp_id}>{game.cp_text}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={11}>
              <FormItem>
                  {getFieldDecorator('belongProps', {
                    initialValue: typeof detail.id != 'undefined' && typeof detail.oid != 'undefined' ? detail.id+'|'+detail.oid+'|'+detail.stock : '',
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
                      {showDefaultProp == 1 ? <Option value={detail.id+'|'+detail.oid+'|'+detail.stock}>{detail.props_name}</Option> : propByParams.map(propbyparams => <Option key={propbyparams.id+'|'+propbyparams.oid+'|'+propbyparams.stock} >{propbyparams.props_name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </FormItem>
            <FormItem {...formItemLayout} label= "剩余库存">
              {getFieldDecorator('stock',{
                initialValue: showDefaultProp == 1 ? detail.stock : 0,
              })(
                <Input disabled style={{ width: "100px" }} />
              )}
            </FormItem>
          </Card>
          <Card title="选择赠送对象" bordered={false} headStyle={{fontWeight:600}}>
          <FormItem {...formItemLayout} label= "选择赠送对象">

            <Button type="primary" onClick={e => {
              e.preventDefault();
              this.showPresentModal();
            }} style={{width: "30%"}}>
              {`添加接收人`}
            </Button>
          </FormItem>
          <FormItem {...formItemLayout} label= "已添加接收人数量">
            已添加接收人数量  {selectedRows.length} 人
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

        <PropsSelectUser
          visible={visible}
          selectedRows={selectedRows}
          selectedRowKeys={selectedRowKeys}
          SetSelectedRowKeys={this.SetSelectedRowKeys}
          handleSelectRows={this.handleSelectRows}
          handlePresentCancel={this.handlePresentCancel}
          handlePresentSubmit={this.handlePresentSubmit}
        />

      </PageHeaderWrapper>
    );
  }
}

export default PropsPresent;
