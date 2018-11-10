import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

class PropsListUserTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;

    this.state = {
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow,SetSelectedRowKeys } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }
    SetSelectedRowKeys(selectedRowKeys)
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
      selectedRowKeys
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                本次搜索到 66666 位用户,
                已选择   <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 位用户&nbsp;&nbsp;
                最多可选择 1000 位。
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default PropsListUserTable;
