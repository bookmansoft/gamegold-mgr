import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({ 
  submitting: loading.effects['walletpay/add'],
}))
@Form.create()
class WalletPay extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        dispatch({
          type: 'walletpay/add',
          payload: values,
        }).then((ret) => {
          console.log(ret);
          if (ret==null) {
            router.push('/wallet/walletpayerror');
          } else {
            //此处的id表示交易id
            let txid=ret.hash;//此处的hash才是交易流水（即交易哈希值）
            router.push(`/wallet/walletpaysuccess?id=${txid}`);
          };
         }
        );
      }
    });
  };

  //转出
  handleCancel = () => {
    history.back();
    // router.push('/wallet/walletpay');
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
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
      <PageHeaderWrapper
        title="钱包管理"
        content=""
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>
            <br/>
            <h2><b>转出</b></h2>
            <br/>
            <FormItem {...formItemLayout} label="接收人地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: "请输入接收人游戏金地址",
                  },
                ],
              })(<Input placeholder="请输入接收人游戏金地址" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="发送金额Kg:">
              {getFieldDecorator('value', {
                rules: [
                  {
                    required: true,
                    message: "请输入发送金额(单位Kg)",
                  },
                ],
              })(<Input placeholder="请输入发送金额(单位Kg)" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="发送说明">
              {getFieldDecorator('gameDesc', {
                rules: [
                  {
                    required: false,
                    message: "请输入发送说明",
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入发送说明"
                  rows={4}
                />
              )}
            </FormItem>


 
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                确认发送
              </Button>
              <Button style={{ marginLeft: 8 }}  onClick={() => this.handleCancel()}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WalletPay;
