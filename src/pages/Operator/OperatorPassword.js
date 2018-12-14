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
  submitting: loading.effects['operator/operatorpassword'],
}))
@Form.create()
class OperatorPassword extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        dispatch({
          type: 'operatorpassword/change',
          payload: values,
        });
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
        title="修改密码"
        content=""
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>
            <br/>
            <h2><b>修改密码</b></h2>
            <br/>
            <FormItem {...formItemLayout} label="原密码">
              {getFieldDecorator('oldpassword', {
                rules: [
                  {
                    required: true,
                    message: "请输入操作员原密码",
                  },
                ],
              })(<Input placeholder="请输入操作员原密码" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator('newpassword', {
                rules: [
                  {
                    required: true,
                    message: "请输入操作员新密码",
                  },
                ],
              })(<Input placeholder="请输入操作员新密码" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="发送说明">
              {getFieldDecorator('newpassword2', {
                rules: [
                  {
                    required: false,
                    message: "请再次输入操作员新密码",
                  },
                ],
              })(<Input placeholder="请再次输入操作员新密码" />)}
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

export default OperatorPassword;
