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
  Row,
  Col,
  Divider,
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

@connect(({ operatoradd, loading }) => ({
  operatoradd,
  loading: loading.models.operatoradd,
  submitting: loading.effects['operatoradd/add'],
}))
@Form.create()
class OperatorAdd extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;


  }

  //获取URL内容的操作
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'operatoradd/add',
          payload: values,
        }).then((ret) => {
          console.log("B 执行完成！");
          if (ret.code === 0) {
            router.push('/operator/operatoraddsuccess');
          } else {
            router.push('/operator/operatoradderror');            
          };
        }
        );
      };
    });
  }
  render() {
    const { submitting } = this.props;
    const {
      operatoradd: { data },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 12 },
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
        title="添加操作员"
        content=""
      >
        <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>
          <Card bordered={false}>
            <Row style={{ marginBottom: 32 }}>
              <FormItem {...formItemLayout} label="登录名">
                {getFieldDecorator('login_name', {
                  rules: [
                    {
                      required: true,
                      message: "请输入操作员登录名",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="密码">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: "请输入密码",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="备注">
                {getFieldDecorator('remark', {
                  rules: [
                    {
                      required: true,
                      message: "请输入备注",
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>

            </Row>
            <br />
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                验证
              </Button>
            </FormItem>
          </Card>
        </Form>

      </PageHeaderWrapper>
    );
  }
}

export default OperatorAdd;
