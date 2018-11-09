import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Select,
  Button,
  Input,
  Table , Card, Modal, Col
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
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
  };
  componentDidMount() {
    const {dispatch } = this.props;
    dispatch({
      type: 'gameprops/getAllGameList',
      payload: {}
    });
  }
  handlePresentSubmit = e => {
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
  render() {
    const { submitting } = this.props;
    const { visible} = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const gameList = this.props.gameprops.gameList;
    const gamePropsList = this.props.gameprops.gamePropsList;


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
    const modalFooter = { okText: '保存', onOk: this.handlePresentSubmit, onCancel: this.handlePresentCancel };
    const dataSource = [{
      key: '1',
      moneyAddr: 'tb1qk879kgs5pl994fdnvrw66af26zvxvzqrlsrf4z',
      playGame: '休闲益智  角色扮演  射击',
      createAt: '2016-09-21  08:50:08'
    }, {
      key: '2',
      moneyAddr: 'tb1qk879kgs5pl994fdnvrw66af26zvxvzqrlsrf4z',
      playGame: '角色扮演  动作冒险',
      createAt: '2018-11-12'
    }];

    const columns = [{
      title: '用户钱包地址',
      dataIndex: 'moneyAddr',
      key: 'moneyAddr',
    }, {
      title: '玩过的游戏类型',
      dataIndex: 'playGame',
      key: 'playGame',
    }, {
      title: '注册时间',
      dataIndex: 'createAt',
      key: 'createAt',
    }];
    const getUserModealContent = () => {
      return (
        <Table dataSource={dataSource} columns={columns} />
      );
    };

    return (
      <PageHeaderWrapper title= "道具赠送" >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Card title="选择道具" bordered={false} headStyle={{fontWeight:600}}>
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
                    {gameList.map(game => <Option key={game.id}>{game.name}</Option>)}
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
                  onChange={this.onPropsChange}
                >
                  {gamePropsList.map(props => <Option key={props.id}>{props.name}</Option>)}
                </Select>
                )}
               </FormItem>
              </Col>
            </FormItem>
            <FormItem {...formItemLayout} label= "剩余库存">
              {getFieldDecorator('propsNum')(
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
            已添加接收人数量  100 人
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
        <Modal
          title="选择"
          className={styles.standardListForm}
          width={800}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getUserModealContent()}
        </Modal>

      </PageHeaderWrapper>
    );
  }
}

export default PropsPresent;
