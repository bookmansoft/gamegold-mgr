import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { message, Input, Select, Button, Checkbox, Alert } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import Cookies from 'js-cookie'

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

const InputGroup = Input.Group;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    prefix: '86',
    openid: '',
    token: '',
    autoLogin: true,
  };

  componentDidMount() {
    let openid = Cookies.get('openid');
    let token = Cookies.get('token');

    const { dispatch } = this.props;
  
    if(!!openid && !!token) {
      sessionStorage.setItem('autoLogin', true);
      this.setState({autoLogin: true, openid, token});

      dispatch({
        type: 'login/login',
        payload: {
          type: 'cookie', 
          openid, 
          token,
        },
      });
    } else {
      sessionStorage.setItem('autoLogin', false);
    }
  }

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          const { prefix } = this.state;
          dispatch({
            type: 'login/login',
            payload: {
              ...values,
              prefix,
              type: 'captcha',
            },
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      const { prefix, type } = this.state;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          prefix, type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    sessionStorage.setItem('autoLogin', e.target.checked);
    this.setState({autoLogin: e.target.checked});
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  handleUserName = e=>{
    this.setState({openid: e.target.value,});
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };

  resetPassword = () => {
    const { openid } = this.state;

    if(!openid) {
      message.error('请输入有效邮件地址作为用户名');
    } else {
      message.info('密码已重置, 新的密码已发至邮箱, 敬请查收');
      const { dispatch } = this.props;
      dispatch({
        type: 'login/resetPassword',
        payload: {
          openid,
        },
      });
    }
  };

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName
              name="userName"
              onChange = {this.handleUserName}
              placeholder={`${formatMessage({ id: 'app.login.userName' })}: `}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}: `}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
            <div>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                  <FormattedMessage id="app.login.remember-me" />
              </Checkbox>
              <a style={{ float: 'right' }} onClick={this.resetPassword} href="javascript:;">
                <FormattedMessage id="app.login.forgot-password" />
              </a>
            </div>
          </Tab>
          <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'app.login.message-invalid-verification-code' })
              )}
            <InputGroup compact>
              <Select
                size="large"
                value={this.state.prefix}
                onChange={this.changePrefix}
                style={{ width: '20%' }}
              >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>
              <Mobile
                name="mobile"
                style={{ width: '100%' }}
                placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.phone-number.required' }),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                  },
                ]}
              />
            </InputGroup>
            <Captcha
              name="captcha"
              placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={formatMessage({ id: 'form.get-captcha' })}
              getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.verification-code.required' }),
                },
              ]}
            />
            <div>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                  <FormattedMessage id="app.login.remember-me" />
              </Checkbox>
            </div>
          </Tab>
          <div className={styles.other}>
            <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <FormattedMessage id="app.login.login" />
            </Button>
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
