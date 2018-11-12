import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select,Alert, Divider } from 'antd';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ walletstep }) => ({
  data: walletstep.step,
}))
@Form.create()
class WalletStep1 extends React.PureComponent {
  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'walletstep/saveStepFormData',
            payload: values,
          });
          router.push('/wallet/step-form/confirm');
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Alert
            closable
            showIcon
            message="请按仔细记下这些助记词。"
            style={{ marginBottom: 24 }}
          />
          <Input style={{fontSize:24,letterSpacing:10,textAlign:"center"}} value="东西南北中发梅兰竹菊葱蒜" />

          <br /><br />
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
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

export default WalletStep1;
