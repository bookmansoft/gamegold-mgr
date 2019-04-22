import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import moment from 'moment';
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

@connect(({ fundingapply, loading }) => ({
  fundingapply,
  loading: loading.models.fundingapply,
  submitting: loading.effects['fundingapply/add'],
}))
@Form.create()
class FundingApply extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;

  }
  //创建
  handleCreate = (theData) => {
    const { dispatch, form } = this.props;
    console.log(theData);
    dispatch({
      type: 'fundingapply/add',
      payload: theData,
    }).then((ret) => {
      console.log(ret);
      if (ret.code === 0) {
        router.push('/fundingapply/fundingapplysuccess');
      } else {
        router.push('/fundingapply/fundingapplyerror');
      };
    }
    );
  };

  renderImg = (text) => {
    if (text && text.length) {
      const imgs = text.map((item, index) =>
        <img width={120} src={item} key={index} />
      )
      return imgs;
    }
  }

  //获取URL内容的操作
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'fundingapply/fetch',
          payload: values,
        });
      };
    });
  }

  handleCpidChange = e => {
    this.setState({infoCpid: e.target.value});
  }
  handleStockNumChange = e => {
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'fundingapply/save',
          payload: values,
        });
      };
    });
  }
  handleStockAmountChange = e => {
    this.setState({infoStockAmount: e.target.value});
  }

  render() {
    const { submitting } = this.props;
    const {
      fundingapply: { data,infoStockNum },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;


    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderWrapper
        title="众筹申请"
        content=""
      >
        <Form onSubmit={this.handleSubmit} hideRequiredMark={false} style={{ marginTop: 8 }}>
          <Card bordered={false}>
            <Row>
              <br />
              <h3><b>众筹目标</b></h3>
              <br />
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={3}>
                <div align="right" style={{ fontWeight: 'bold', marginTop: 5 }}>选择发行游戏:</div>
              </Col>
              <Col span={5}>
                <FormItem >
                  {getFieldDecorator('cpid', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(
                    <Select placeholder="请选择" style={{ width: '100%', display: 'block', }}>
                      <Option value="1">游戏1</Option>
                      <Option value="2">游戏2</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={3}>
                <div align="right" style={{ fontWeight: 'bold', marginTop: 5 }}>发行凭证数量:</div>
              </Col>
              <Col span={5}>
                <FormItem >
                  {getFieldDecorator('stock_num', {
                    rules: [
                      {
                        required: true,
                        message: "请输入发行凭证数量",
                      },
                    ],
                  })(<Input placeholder="请输入" style={{ width: '100%' }} onChange={this.handleStockNumChange} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <div align="left" style={{ fontWeight: 'bold', marginTop: 5 }}>份（单次发行数量不得高于100万份）</div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={3}>
                <div align="right" style={{ fontWeight: 'bold', marginTop: 5 }}>发行价(游戏金):</div>
              </Col>
              <Col span={5}>
                <FormItem >
                  {getFieldDecorator('stock_amount', {
                    rules: [
                      {
                        required: true,
                        message: "请输入发行价(游戏金)",
                      },
                    ],
                  })(<Input placeholder="请输入" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <div align="left" style={{ fontWeight: 'bold', marginTop: 5 }}>千克/份（首次发行单价不得高于50千克）</div>
              </Col>
            </Row>
            <br />
            <h2><b>基本信息预览</b></h2>
            <br />
            <Row  gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><div style={{fontWeight:'bold'}}>游戏名称：{data.cp_text}</div></Col>
              <Col span={8}><div style={{fontWeight:'bold'}}>游戏类型：{data.cp_type}</div></Col>
              <Col span={8}><div style={{fontWeight:'bold'}}>开发者：{data.develop_name}</div></Col>
            </Row>
            <Row  gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}><div style={{fontWeight:'bold'}}>发行凭证总数(份)：{data.infoStockNum}</div></Col>
              <Col span={8}><div style={{fontWeight:'bold'}}>发行价(千克/份)：{data.infoStockAmount}</div></Col>
              <Col span={8}><div style={{fontWeight:'bold'}}>众筹总金额：{data.infoStockAmount*data.infoStockNum}</div></Col>
            </Row>

          </Card>
        </Form>

      </PageHeaderWrapper>
    );
  }
}

export default FundingApply;
