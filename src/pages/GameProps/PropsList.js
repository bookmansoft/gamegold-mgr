import React, { Fragment, PureComponent } from 'react';
import styles from './style.less';
import { Table, Form, Row, Col , Input , Select , Button  , Divider   } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';

const FormItem = Form.Item;
@connect(({ gameprops, loading }) => ({
  gameprops,
  loading: loading.models.gameprops,
}))
@Form.create()
class PropsList extends PureComponent {
  columns = [
    {
      title: '道具ID',
      dataIndex: 'id',
    },
    {
      title: '道具名',
      dataIndex: 'name',
    },
    {
      title: '道具类型',
      dataIndex: 'type_cap',
    },
    {
      title: '所属游戏',
      dataIndex: 'game',
    },
    {
      title: '制作总量',
      dataIndex: 'num',
    },
    {
      title: '库存数量',
      dataIndex: 'stock',
    },
    {
      title: '操作',
      render: (e, record) => (
        <Fragment>
          <Link to={`/gameprops/detail/${record.id}`}>详情</Link>
          <Divider type="vertical" />
          <Link to={`/gameprops/produce/${record.id}`}>生产</Link>
          <Divider type="vertical" />
          <Link to={`/gameprops/present/${record.id}`}>赠送</Link>
          <Divider type="vertical" />
          <a onClick={e => this.handleEdit(e, record)}>上架</a>
        </Fragment>
      ),
    },
  ];
  state = {
    formValues: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'gameprops/propsList',
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

    dispatch({
      type: 'gameprops/propsList',
      payload: params,
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'gameprops/propsList',
        payload: values,
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
      payload: {},
    });
  };
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={4}>
            <FormItem label="ID">
              {getFieldDecorator('id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={4}>
            <FormItem label="道具名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={4}>
            <FormItem label="所在游戏">
              {getFieldDecorator('game')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">游戏A</Option>
                  <Option value="1">游戏B</Option>
                  <Option value="2">游戏C</Option>
                  <Option value="3">游戏D</Option>
                  <Option value="4">游戏E</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={8}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
            <span className={styles.createButtons}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                创建新道具
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const {
      gameprops: { data },
      loading,
      rowKey,
    } = this.props;
    const list = data.list;
    const pagination = data.pagination;
    const showTotal = () => `共 ${pagination.total} 条记录`;
    pagination.showTotal = showTotal;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    return (
        <PageHeaderWrapper
          title={<FormattedMessage id="app.gameprops.list" />}
        >
        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>

        <Table
          loading={loading}
          rowKey={rowKey || 'id'}
          dataSource={list}
          columns={this.columns}
          pagination={paginationProps}
          onChange={this.handleStandardTableChange}
        />
        </PageHeaderWrapper>
    );
  }
}

export default PropsList;
