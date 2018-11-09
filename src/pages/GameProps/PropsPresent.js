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
import PropsListUserTable from '@/components/PropsListUserTable';
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
  };
  columns = [
    {
      title: '用户钱包地址',
      dataIndex: 'walletAddr',
    },
    {
      title: '玩过的游戏类型',
      dataIndex: 'gameType',
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      sorter: true,
      align: 'right',
    }
  ];
  componentDidMount() {
    const {dispatch } = this.props;
    dispatch({
      type: 'gameprops/getAllGameList',
      payload: {}
    });
    dispatch({
      type: 'gameprops/getAllUser',
      payload: {}
    });
  }
  handlePresentSubmit = e => {
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
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'gameprops/getAllUser',
        payload: values,
      });
    });
  };
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{margin:"10px 0"}}>
          <Col md={24} sm={24}>
            <FormItem label="搜索钱包地址">
              {getFieldDecorator('walletAddress')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={{ md: 8, lg: 24, xl: 48 }} style={{margin:"10px 0"}}>
          <Col md={24} sm={24}>
            <FormItem label="按所玩游戏搜索">
            {getFieldDecorator('gameType')(
                <Select placeholder="请选择" style={{ width: '200px' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('game')(
                <Select placeholder="请选择" style={{ width: '200px' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row  gutter={{ md: 8, lg: 24, xl: 48 }} style={{margin:"10px 0"}}>
          <Col md={24} sm={24}>
            <span className={styles.createButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
    console.log(this.state.selectedRows);

  };
  handlePropsListUserTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'gameprops/getAllUser',
      payload: params,
    });
  };
  render() {
    const { submitting,loading, gameprops: { userAllList }} = this.props;
    const { visible,selectedRows} = this.state;
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

    const getUserModealContent = () => {
      return (
        <PageHeaderWrapper title="添加接收人">
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <PropsListUserTable
                selectedRows={selectedRows}
                loading={loading}
                data={userAllList}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handlePropsListUserTableChange}
              />
            </div>
          </Card>
        </PageHeaderWrapper>

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
