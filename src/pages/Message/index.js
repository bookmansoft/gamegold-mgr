import React, { Fragment, PureComponent } from 'react';
import styles from './index.less';
import { List, Alert, Table, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

@connect(({ message, loading }) => ({
  message,
  loading: loading.models.message,
}))
class MessagePage extends PureComponent {
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      render: (value, row, index) => {
        if (value > 0) {
          return '正常';
        } else {
          return <Icon type="arrow-down" theme="outlined" />;
        }
      },
    },
    {
      title: '操作',
      render: (e, record) => (
        <Fragment>
          <a onClick={e => this.handleEdit(e, record)}>配置</a>
        </Fragment>
      ),
    },
  ];
  state = {};
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'message/allmessageFetch',
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
      type: 'message/allmessageFetch',
      payload: params,
    });
  };
  render() {
    const {
      message: { data },
      loading,
      rowKey,
    } = this.props;
    const list = data.list;
    const pagination = data.pagination;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div>
        <Table
          loading={loading}
          rowKey={rowKey || 'id'}
          dataSource={list}
          columns={this.columns}
          pagination={paginationProps}
          onChange={this.handleStandardTableChange}
        />
      </div>
    );
  }
}

export default MessagePage;
