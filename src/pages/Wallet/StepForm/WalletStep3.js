import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ walletstep }) => ({
  data: walletstep.step,
}))
class WalletStep3 extends React.PureComponent {
  render() {
    const { data } = this.props;
    const onFinish = () => {
      router.push('/wallet/walletmgr');
    };
    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={24}>
<b>为什么要备份钱包？</b><br />
游戏金钱包基于区块链技术，是完全属于您个人的去中心化钱包，钱包备份是您恢复钱包的唯一途径，因此强烈建议您立即备份钱包，并妥善保管好您的备份，切勿丢失或告知他人。
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={24}>
<b>如何备份钱包？</b><br />
点击备份钱包，屏幕上会出现12个汉字作为助记词，您务必将12个汉字助记词用纸笔抄写下来，这是您将来恢复钱包的重要凭证。请勿将助记词告知他人或使用不安全的方式保存。
          </Col>
        </Row>
        <Row>
        <Col xs={24} sm={24}>
<b>如何恢复钱包？</b><br />
恢复钱包时，按顺序输入您备份时产生的12个汉字助记词，即可恢复钱包。
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          返回钱包
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="备份完成"
        description="请务必保管好您的助记词"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default WalletStep3;
