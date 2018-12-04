import React, { Fragment, PureComponent } from 'react';
import styles from './style.less';
import { Table, Form, Row, Col, Input, Select, Button, Divider, Modal } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';
const { Option } = Select;
const FormItem = Form.Item;
@connect(({ gameprops, loading }) => ({
  gameprops,
  loading: loading.models.gameprops,
}))
@Form.create()
class PropsList extends PureComponent {
  state = {
    formValues: {},
    visible: false,
    current: undefined,
    proposPrice : 0,
    proposNum : 0,
  };

  columns = [
    {
      title: '道具ID',
      dataIndex: 'pid',
    },
    {
      title: '道具名',
      dataIndex: 'props_name',
     
    },
    {
      title: '道具类型',
      dataIndex: 'props_type',
      render(val) {
        return val;
      },
    },
    {
      title: '所属游戏',
      dataIndex: 'cp',
      render(val) {
       // val = eval('(' + val + ')');
        return val.name;
      },
    },
    {
      title: '制作总量',
      dataIndex: 'pro_num',
    },
    {
      title: '库存数量',
      dataIndex: 'stock',
    },
    {
      title: '操作',
      render: (e, record) => {
        console.log(record);
        if(record.status == 0){
          return (
            <Fragment>
              <Link to={`/gameprops/detail/${record.id}`}>详情</Link>
              <Divider type="vertical" />
              <Link to={`/gameprops/produce/${record.id}`}>生产</Link>
              <Divider type="vertical" />
            </Fragment>
          );
        }else{
          return (
            <Fragment>
              <Link to={`/gameprops/detail/${record.id}`}>详情</Link>
              <Divider type="vertical" />
              <Link to={`/gameprops/produce/${record.id}`}>生产</Link>
              <Divider type="vertical" />
              <Link to={`/gameprops/present/${record.id}`}>赠送</Link>
              <Divider type="vertical" />
              <a onClick={e => {
                e.preventDefault();
                this.showOnsaleModal(record);
              }}>上架</a>
            </Fragment>
          );
        }
        
      }
    },
  ];
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'gameprops/getAllGameList',
    });
    dispatch({
      type: 'gameprops/propsList',
      payload: {currentPage:1, pageSize: 10},
    });
  }
  handleEdit = (e, item) => {
    console.log(item);
    e.preventDefault();
  };
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
    params.pid = formValues.pid;
    params.props_name = formValues.name;
    params.cid = formValues.game;

    dispatch({
      type: 'gameprops/propsList',
      payload: params,
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {

      console.log(fieldsValue);
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      let searchParam = {};
      searchParam.currentPage = values.currentPage || 1;
      searchParam.pageSize = values.currentPage || 10;
      searchParam.pid = values.pid;
      searchParam.props_name = values.name;
      searchParam.cid = values.game;
      dispatch({
        type: 'gameprops/propsList',
        payload: searchParam,
      });
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'gameprops/propsList',
      payload: {currentPage:1, pageSize: 10},
    });
  };
  handleGamePropsCreate = () => {
    router.push('/gameprops/create')
  };
  showOnsaleModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };
  handleOnsaleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleOnsaleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    console.log(current);
    const id = current ? current.id : '';
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      /*if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'list/submit',
        payload: { id, ...fieldsValue },
      });*/
    });
  };
  renderSimpleForm() {
    const {
      gameprops: { gameList},
      form: { getFieldDecorator },
      } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="ID">
              {getFieldDecorator('pid')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="道具名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所在游戏">
              {getFieldDecorator('game')(
                  <Select
                  setFieldsValue={0}
                  style={{width:"200px"}}
                >
                  {gameList.map(game => <Option key={game.id+'|'+game.cp_id}>{game.cp_text}</Option>)}
                </Select>

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
            <span className={styles.createButtons}>
              <Button icon="plus" type="primary" onClick={() => this.handleGamePropsCreate()}>
                创建新道具
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const {
      gameprops: { data },
      loading,
      rowKey,
      form: { getFieldDecorator },
    } = this.props;
    const { visible, current = {} } = this.state;
    const list = data.list;
    const pagination = data.pagination;
    const showTotal = () => `共 ${pagination.total} 条记录`;
    pagination.showTotal = showTotal;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const modalFooter = { okText: '保存', onOk: this.handleOnsaleSubmit, onCancel: this.handleOnsaleCancel };
    const getModalContent = () => {
      return (
        <Form onSubmit={this.handleOnsaleSubmit}>
          <FormItem label="道具名称" {...this.formLayout}>
            {getFieldDecorator('proposName', {})(
              <Input  style={{ width: "50%" }} />
            )}

          </FormItem>
          <FormItem label="单个售价" {...this.formLayout}>
            {getFieldDecorator('proposPrice', {
              rules: [{ required: true, message: '请输入单个售价' }],
              initialValue: 0,
            })(
              <Input  style={{ width: "50%" }} addonAfter="GGD"/>
            )}
          </FormItem>

          <FormItem label="上架数量" {...this.formLayout}>
            {getFieldDecorator('proposNum', {
              rules: [{ required: true, message: '请输入上架数量' }],
              initialValue: 0,
            })(
              <Input  addonAfter="件" style={{ width: "50%" }} />
            )}
          </FormItem>
          <FormItem label="当前库存" {...this.formLayout}>
            500 件
          </FormItem>
        </Form>
      );
    };
    return (
        <PageHeaderWrapper
          title={<FormattedMessage id="app.gameprops.list" />}
        >
        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>

        <Table
          loading={loading}
          rowKey={rowKey || 'pid'}
          dataSource={list}
          columns={this.columns}
          pagination={paginationProps}
          onChange={this.handleStandardTableChange}
        />
          <Modal
            title={`上架出售道具${current.name || ''}`}
            className={styles.standardListForm}
            width={640}
            bodyStyle={{ padding: '28px 0 0' }}
            destroyOnClose
            visible={visible}
            {...modalFooter}
          >
            {getModalContent()}
          </Modal>
        </PageHeaderWrapper>
    );
  }
}

export default PropsList;
