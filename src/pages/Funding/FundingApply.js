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

  //获取cp内容的操作
  handleCpidChange = value => {
    console.log("69",value);
    const { dispatch, form } = this.props;
      dispatch({
        type: 'fundingapply/fetch',
        payload: value,
      });
  }
  handleStockNumChange = e => {
    console.log({ stock_num: e.target.value });
    this.props.dispatch({
      type: 'fundingapply/updateInfo_stock_num',
      payload: e.target.value,
    });
  }
  handleStockAmountChange = e => {
    console.log({ stock_amount: e.target.value });
    this.props.dispatch({
      type: 'fundingapply/updateInfo_stock_amount',
      payload: e.target.value,
    });
  }

  //参考复制自FundingAuditList的代码
  renderOptions= () => {
    return (this.props.cplist || []).map(element =>
      <Option key={element.id} value={element.id}> {element.address}</Option>);
  };

  // //显示下拉框
  // renderOptions = () => {
  //   if (this.props.fundingauditlist.cp_type_list != null) {
  //     return this.props.fundingauditlist.cp_type_list.map(element =>
  //       <Option key={element.id} value={element.cp_type_id}> {element.cp_type_id}</Option>);
  //   }
  //   else {
  //     return "";
  //   }
  // };

  render() {
    const { submitting } = this.props;
    const {
      fundingapply: { data, stock_amount, stock_num },
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
                      <Option value="1">游戏1</Option>
                      <Option value="2">游戏2</Option>
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
                  })(<Input placeholder="请输入" style={{ width: '100%' }} onChange={this.handleStockAmountChange} />)}
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
              <Col span={8}><div style={{ fontWeight: 'bold' }}>游戏名称：{data.cp_text}</div></Col>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>游戏类型：{data.cp_type}</div></Col>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>开发者：{data.develop_name}</div></Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>发行凭证总数(份)：{stock_num}</div></Col>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>发行价(千克/份)：{stock_amount}</div></Col>
              <Col span={8}><div style={{ fontWeight: 'bold' }}>众筹总金额：{parseInt(stock_amount) * parseInt(stock_num)}</div></Col>
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" onClick={() => this.handleCreate(this.props.game.data)}>
                提交
              </Button>
            </FormItem>
          </Card>
        </Form>

      </PageHeaderWrapper>
    );
  }
}

export default FundingApply;
