import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider,Row,Col } from 'antd';
import router from 'umi/router';
import { digitUppercase } from '@/utils/utils';
import styles from './style.less';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ walletinfo, loading }) => ({
  submitting: loading.effects['wallet/submitStepForm'],
  data: walletinfo,
}))
@Form.create()
class WalletStep2 extends React.PureComponent {
  appendText(theText) {
    this.props.dispatch({
      type: 'walletinfo/appendText',
      payload: {
        theText,
      },
    })
    // alert(theText);
  }
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
          if (data.checkRememberWord!=data.rememberWord) {
            console.log("不匹配");
            router.push('/wallet/step-form/info');
            return;
          }
          dispatch({
            type: 'walletinfo/submitStepForm',
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
          message="请按顺序点击下方助记词，确保你的助记词备份正常"
          style={{ marginBottom: 24 }}
        />
            <FormItem>
              {getFieldDecorator('gameName', {
                initialValue: data.checkRememberWord,
                rules: [
                  {
                    required: true,
                    message: "请顺序选择所有助记词",
                  },
                ],
              })(<Input style={{fontSize:24,letterSpacing:10,textAlign:"center"}} />)}
            </FormItem>

        
        <br/><br/>


        <Row>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[6])}>{data.rememberWord[6]}</Button></Col>
          <Col sm={1} xs={1}></Col>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[7])}>{data.rememberWord[7]}</Button></Col>
          <Col sm={1} xs={1}></Col>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[8])}>{data.rememberWord[8]}</Button></Col>
          <Col sm={1} xs={1}></Col>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[9])}>{data.rememberWord[9]}</Button></Col>
          <Col sm={1} xs={1}></Col>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[10])}>{data.rememberWord[10]}</Button></Col>
          <Col sm={1} xs={1}></Col>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[11])}>{data.rememberWord[11]}</Button></Col>
        </Row>
        <Row>
          <Col sm={1} xs={1}>&nbsp;</Col>
        </Row>
        <Row>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[0])}>{data.rememberWord[0]}</Button></Col>
          <Col sm={1} xs={1}></Col>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[1])}>{data.rememberWord[1]}</Button></Col>
          <Col sm={1} xs={1}></Col>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[2])}>{data.rememberWord[2]}</Button></Col>
          <Col sm={1} xs={1}></Col>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[3])}>{data.rememberWord[3]}</Button></Col>
          <Col sm={1} xs={1}></Col>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[4])}>{data.rememberWord[4]}</Button></Col>
          <Col sm={1} xs={1}></Col>
          <Col sm={2} xs={2}><Button onClick={()=>this.appendText(data.rememberWord[5])}>{data.rememberWord[5]}</Button></Col>
        </Row>
        <Row>
          <Col sm={1} xs={1}>&nbsp;</Col>
        </Row>
        <Button type="primary" onClick={onValidateForm} loading={submitting}>
          提交
        </Button>
      
        <Button onClick={onPrev} style={{ marginLeft: 8 }}>
          上一步
        </Button>
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
