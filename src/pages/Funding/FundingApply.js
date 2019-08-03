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

@connect(({ 
  fundinglist, gamelist,
  loading 
}) => ({
  fundinglist, gamelist,
  loading: loading.models.fundinglist,
  submitting: loading.effects['fundinglist/newFunding'],
}))
@Form.create()
class FundingApply extends PureComponent {
  state = {
    stock_num: 1,
    stock_amount: 1,
    develop_text: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fundinglist/fetchCp'
    });
  };

  //创建
  handleCreate = (theData, theState) => {
    const { dispatch, form } = this.props;
    console.log(theData, theState);
    dispatch({
      type: 'fundinglist/newFunding',
      payload: {
        data: theData, state: theState
      },
    }).then((ret) => {
      console.log(ret);
      if (ret.code === 0) {
        router.push('/funding/fundingapplysuccess');
      } else {
        router.push('/funding/fundingapplyerror');
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

  //获取cp内容的操作
  handleCpidChange = value => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'gamelist/getGameRecord',
      payload: { id: value },
    });
  }
  handleStockNumChange = e => {
    this.state.stock_num = parseInt(e.target.value);
  }
  handleStockAmountChange = e => {
    this.state.stock_amount = parseInt(e.target.value);
  }
  handleDevelopTextChange = e => {
    console.log(e.target.value);
    this.state.develop_text = e.target.value;
  }

  //显示下拉框
  renderOptions = () => {
    const {fundinglist: { cp_list }} = this.props;

    if (!!cp_list) {
      return cp_list.map(element =>
        <Option key={element.id} value={element.id}> {element.cp_text}</Option>);
    }
    else {
      return "";
    }

  };

  render() {
    const { submitting } = this.props;
    const {
      gamelist: { gameRecord },
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
                    <Select placeholder="请选择" style={{ width: '100%', display: 'block', }} onChange={this.handleCpidChange}>
                      <Option value="-1">请选择</Option>
                      {this.renderOptions()}
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
                <div align="right" style={{ fontWeight: 'bold', marginTop: 5 }}>发行价(千克):</div>
              </Col>
              <Col span={5}>
                <FormItem >
                  {getFieldDecorator('stock_amount', {
                    rules: [
                      {
                        required: true,
                        message: "请输入发行价",
                      },
                    ],
                  })(<Input addonAfter="千克" placeholder="请输入" style={{ width: '100%' }} onChange={this.handleStockAmountChange} />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <div align="left" style={{ fontWeight: 'bold', marginTop: 5 }}>千克/份（首次发行单价不得高于50千克）</div>
              </Col>
            </Row>
            <br />
            <h2><b>基本信息预览</b></h2>
            <br />
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>游戏名称：{gameRecord.cp_text}</div></Col>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>游戏类型：{gameRecord.cp_type}</div></Col>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>开发者：{gameRecord.develop_name}</div></Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>发行凭证总数(份)：{this.state.stock_num}</div></Col>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>发行价(千克/份)：{this.state.stock_amount}</div></Col>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>众筹总金额：{parseInt(this.state.stock_amount) * parseInt(this.state.stock_num)}</div></Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={3}>
                <div align="right" style={{ fontWeight: 'bold', marginTop: 5 }}>开发团队介绍:</div>
              </Col>
              <Col span={13}>
                <FormItem >
                  {getFieldDecorator('develop_text', {
                    rules: [
                      {
                        required: true,
                        message: "请输入开发团队介绍",
                      },
                    ],
                  })(<TextArea placeholder="请输入" style={{ width: '100%' }} onChange={this.handleDevelopTextChange} />)}
                </FormItem>
              </Col>
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" onClick={() => this.handleCreate(gameRecord, this.state)}>提交</Button>
            </FormItem>
          </Card>
        </Form>

      </PageHeaderWrapper>
    );
  }
}

export default FundingApply;
