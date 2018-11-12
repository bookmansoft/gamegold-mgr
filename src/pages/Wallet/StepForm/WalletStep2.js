import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider } from 'antd';
import router from 'umi/router';
import { digitUppercase } from '@/utils/utils';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ walletstep, loading }) => ({
  submitting: loading.effects['wallet/submitStepForm'],
  data: walletstep.step,
}))
@Form.create()
class WalletStep2 extends React.PureComponent {
  render() {
    const { form, data, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      router.push('/wallet/step-form/info');
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'walletstep/submitStepForm',
            payload: {
              ...data,
              ...values,
            },
          });
        }
      });
    };
    return (
      <Fragment>
      <Form layout="horizontal" className={styles.stepForm}>
        <Alert
          closable
          showIcon
          message="确认转账后，资金将直接打入对方账户，无法退回。"
          style={{ marginBottom: 24 }}
        />
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="付款账户">
          {data.payAccount}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="收款账户">
          {data.receiverAccount}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="收款人姓名">
          {data.receiverName}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="转账金额">
          <span className={styles.money}>{data.amount}</span>
          <span className={styles.uppercase}>（{digitUppercase(data.amount)}）</span>
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        <Form.Item {...formItemLayout} label="支付密码" required={false}>
          {getFieldDecorator('password', {
            initialValue: '123456',
            rules: [
              {
                required: true,
                message: '需要支付密码才能进行支付',
              },
            ],
          })(<Input type="password" autoComplete="off" style={{ width: '80%' }} />)}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
        <Divider style={{ margin: '40px 0' }} />
        <div className={styles.desc}>
          <h4>为什么要备份钱包？</h4>
          <p>
            游戏金钱包基于区块链技术，是完全属于您个人的去中心化钱包，钱包备份是您恢复钱包的唯一途径，因此强烈建议您立即备份钱包，并妥善保管好您的备份，切勿丢失或告知他人。
          </p>
          <h4>如何备份钱包？</h4>
          <p>
            点击备份钱包，屏幕上会出现12个汉字作为助记词，您务必将12个汉字助记词用纸笔抄写下来，这是您将来恢复钱包的重要凭证。请勿将助记词告知他人或使用不安全的方式保存。
          </p>
          <h4>如何恢复钱包？</h4>
          <p>
            点击备份钱包，屏幕上会出现12个汉字作为助记词，您务必将12个汉字助记词用纸笔抄写下来，这是您将来恢复钱包的重要凭证。请勿将助记词告知他人或使用不安全的方式保存。
          </p>
        </div>
      </Fragment>
    );
  }
}

export default WalletStep2;
