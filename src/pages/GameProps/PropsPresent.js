import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Select,
  Button,
  Input,
  Table , Card, Modal
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const gameData = ['游戏1', '游戏2'];
const propsData = {
  '游戏1': ['套装1', '套装2', '套装3'],
  '游戏2': ['套装4', '套装5', '套装6'],
};
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))

@Form.create()
class PropsPresent extends PureComponent {
  state = {
    visible: false,
    game: propsData[gameData[0]],
    gameProps: propsData[gameData[0]][0]
  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      /*if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }*/
    });
  };
  handleGameChange = (value) => {
    this.setState({
      game: propsData[value],
      gameProps: propsData[value][0],
    });
  };

  onPropsChange = (value) => {
    this.setState({
      gameProps: value,
    });
  };
  showEditModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { submitting } = this.props;
    const { game,visible } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

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
    const modalFooter = { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };
    const dataSource = [{
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    }, {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    }];

    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    }];
    const getModalContent = () => {

      return (
        <Table dataSource={dataSource} columns={columns} />
      );
    };

    return (
      <PageHeaderWrapper title= "道具赠送" >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <Card title="素材信息" bordered={false}>
            <FormItem {...formItemLayout} label= "选择道具">
              <Select
                defaultValue={gameData[0]}
                style={{ width: "50%" }}
                onChange={this.handleGameChange}
              >
                {gameData.map(game => <Option key={game}>{game}</Option>)}
              </Select>
              <Select
                style={{ width: "50%" }}
                value={this.state.gameProps}
                onChange={this.onPropsChange}
              >
                {game.map(props => <Option key={props}>{props}</Option>)}
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label= "剩余库存">
              {getFieldDecorator('proNum')(
                <Input disabled style={{ width: "50%" }} />
              )}
            </FormItem>
          </Card>
          <Card title="选择赠送对象" bordered={false}>
          <FormItem {...formItemLayout} label= "选择赠送对象">

            <Button type="primary" onClick={e => {
              e.preventDefault();
              this.showEditModal();
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
          {getModalContent()}
        </Modal>

      </PageHeaderWrapper>
    );
  }
}

export default PropsPresent;
