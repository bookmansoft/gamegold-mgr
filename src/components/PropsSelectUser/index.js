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
import PropsListUserTable from '@/components/PropsListUserTable';
const FormItem = Form.Item;
const { Option } = Select;
import styles from './index.less';

@connect(({ gameprops, loading }) => ({
  gameprops,
  loading: loading.models.gameprops,
}))

@Form.create()
class PropsSelectUser extends PureComponent {

  state = {
    formValues: {},
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
      type: 'gameprops/getAllUser',
      payload: {}
    });
  }
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

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'gameprops/getAllUser',
      payload: {},
    });
  };


  renderForm() {
    const {
      form: { getFieldDecorator},
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
    const { loading, gameprops: { userAllList }, visible, selectedRows, handleSelectRows , handlePresentCancel , handlePresentSubmit  , selectedRowKeys    , SetSelectedRowKeys  } = this.props;
    const modalFooter = { okText: '保存', onOk: handlePresentSubmit, onCancel: handlePresentCancel };
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
                onSelectRow={handleSelectRows}
                onChange={this.handlePropsListUserTableChange}
                selectedRowKeys={selectedRowKeys}
                SetSelectedRowKeys={SetSelectedRowKeys}
              />
            </div>
          </Card>
        </PageHeaderWrapper>

      );
    };
    return(<Modal
      title="选择"
      className={styles.standardListForm}
      width={800}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getUserModealContent()}
    </Modal>);
  }
}

export default PropsSelectUser;
