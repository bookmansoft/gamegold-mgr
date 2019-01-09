import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Icon,
  List,
  Col,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import router from 'umi/router';
const FormItem = Form.Item;
const { Description } = DescriptionList;
const { Option } = Select;
const confirm = Modal.confirm;
@connect(({ gameprops }) => ({
  gameprops
}))

@Form.create()
class PropsCreate extends PureComponent {
  state = {
    cid: '',
    pid: '',
    cp_url: '',
    cp_text: '',
    propsSearchList: [],
    statePropsDetail: {},
    cpPropsDetail: {}
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'gameprops/getAllGameList',
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (typeof values.belongGame == 'undefined' || typeof values.belongProps == 'undefined') {
        Modal.error({
          title: '错误',
          content: '请选择游戏以及道具！',
        });
        return;
      }
      let cpPropsDetail = this.state.cpPropsDetail;
      if (cpPropsDetail == null || typeof cpPropsDetail == 'undefined' || cpPropsDetail.length == 0) {
        Modal.error({
          title: '错误',
          content: '请选择游戏以及道具！',
        });
        return;
      }
      //含金量进行一次判断
      let rank = parseInt(cpPropsDetail.props_rank);
      if(rank != 1 && rank != 2 && rank != 3 && rank != 4 && rank != 5){
        Modal.error({
          title: '错误',
          content: '道具含金量数值错误！',
        });
        return;
      }
      let param = {};
      param.props_id = cpPropsDetail.id;
      param.props_name = cpPropsDetail.props_name;
      param.props_type = cpPropsDetail.props_type;
      param.cid = this.state.cid;
      param.props_desc = cpPropsDetail.props_desc;
      param.icon_url = cpPropsDetail.icon;
      param.icon_preview = cpPropsDetail.more_icon;
      param.oid = '';
      param.status = cpPropsDetail.props_status || 1;
      param.props_price = cpPropsDetail.props_price;
      param.props_rank = cpPropsDetail.props_rank;
      param.propsAt = cpPropsDetail.props_createtime;
      //本地道具创建
      dispatch({
        type: 'gameprops/createproplocal',
        payload: param,
      }).then((ret) => {
        if (ret.code == 0) {
          confirm({
            title: '创建成功',
            content: '道具创建成功，您可以前往道具列表查看！',
            okText: '返回列表',
            okType: 'primary',
            cancelText: '查看详情',
            cancelType: 'primary',
            onOk() {
              router.push('/gameprops/list');
            },
            onCancel() {
              router.push(`/gameprops/detail/${ret.data.id}`);
            },
          });
        } else {

          Modal.error({
            title: '错误',
            content: ret.msg || '道具创建失败，请重试！',
          });

        };
      });

    });

  };
  handleGameChange = (value) => {
    const { dispatch } = this.props;
    //获取游戏对应的道具列表
    //option key唯一用id|cp_id格式
    if (typeof value != 'undefined' && value != '') {
      let valueArr = value.split("|");
      let cp_id = valueArr[0] || '';
      let cp_url = valueArr[1] || '';
      let cp_text = valueArr[2] || '';
      if (cp_url == '') {
        Modal.error({
          title: '错误',
          content: '游戏厂商地址错误！无法获取道具',
        });

      }
      this.setState({
        cid: cp_id,
        cp_url: cp_url,
        cp_text: cp_text,
      });
      dispatch({
        type: 'gameprops/getPropsByGame',
        payload: {
          cp_url: cp_url
        },
      });


    }
  };

  onPropsChange = (value) => {
    this.setState({
      pid: value,
    });
  };

  //道具预览 请求游戏厂商
  previewProp = () => {
    const { dispatch } = this.props;
    let cp_url = this.state.cp_url;
    let pid = this.state.pid;
    if (pid != '') {
      dispatch({
        type: 'gameprops/cpPropsDetail',
        payload: {
          cp_url: cp_url,
          pid: pid,
        },
      }).then((ret) => {
        if (ret != '') {
          this.setState({
            cpPropsDetail: ret,
          });
        }
      });
    }
  }
  //"props_rank": "{props_rank}", //白绿蓝紫橙,对应于1-5%,2-10%,3-20%,4-50%,5-80%
  getRankNote(rank) {
    let rankNote = '';
    switch (parseInt(rank)) {
      case 1:
        rankNote = '5%(白)';
        break;
      case 2:
        rankNote = '10%(绿)';
        break;
      case 3:
        rankNote = '20%(蓝)';
        break;
      case 4:
        rankNote = '50%(紫)';
        break;
      case 5:
        rankNote = '80%(橙)';
        break;
      default:
        rankNote = '5%(白)';
        break;
    }
    return rankNote;
  }

  render() {
    const { gameprops: { gameList, gamePropsList }, submitting } = this.props;
    let cpPropsDetail = this.state.cpPropsDetail;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
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
        title="创建新道具"
        content="在这里您可以创建全新的道具品类"
      >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>

          <Card title="道具信息" bordered={false} headStyle={{ fontWeight: 600 }}>
            <FormItem {...formItemLayout} label="从游戏中选择道具">
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('belongGame', {
                    rules: [
                      {
                        required: true,
                        message: "请选择游戏",
                      },
                    ],
                  })(
                    <Select
                      setFieldsValue={0}
                      onChange={this.handleGameChange}
                    >
                      {gameList.map(game => <Option key={game.cp_id + '|' + game.cp_url + '|' + game.cp_text}>{game.cp_text}</Option>)}
                    </Select>

                  )}
                </FormItem>
              </Col>
              <Col span={8} style={{ marginLeft: 32 }}>
                <FormItem>
                  {getFieldDecorator('belongProps', {
                    rules: [
                      {
                        required: true,
                        message: "请选择装备",
                      },
                    ],
                  })(
                    <Select
                      setFieldsValue={0}
                      onChange={this.onPropsChange}
                    >
                      {gamePropsList.map(props => <Option key={props.id}>{props.props_name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4} style={{ marginLeft: 32 }}>
                <FormItem style={{ marginLeft: 32 }}>
                  <Button type="primary" onClick={this.previewProp} > <FormattedMessage id="form.preview" /></Button>
                </FormItem>
              </Col>
            </FormItem>

          </Card>

          <Card bordered={false} headStyle={{ fontWeight: 600 }} title="道具信息预览">
            <DescriptionList size="large" style={{ marginBottom: 32 }}>
              <Description term="道具ID">{cpPropsDetail.id || ''}</Description>
              <Description term="道具名称">{cpPropsDetail.props_name || ''}</Description>
              <Description term="道具属性">{cpPropsDetail.props_type || ''}</Description>
              <Description term="所属游戏">{this.state.cp_text || ''}</Description>
              <Description term="添加时间">{cpPropsDetail.props_createtime || ''}</Description>
              <Description term="销售状态">{cpPropsDetail.props_status || ''}</Description>
              <Description term="商城标价">{cpPropsDetail.props_price || ''}</Description>
              <Description term="含金等级">{this.getRankNote(cpPropsDetail.props_rank)}</Description>
            </DescriptionList>
            <DescriptionList size="large">
              <Description term="道具描述">{cpPropsDetail.props_desc || ''}</Description>
            </DescriptionList>
            <DescriptionList size="large" style={{ borderTop: '1px solid #ddd', marginTop: 32 }}>
              <Description term="道具图标 " span="24" style={{ marginTop: 32 }}>
                <img width={120} src={cpPropsDetail.icon || ''} />
              </Description>
              <Description term="道具说明图">
                <List
                  grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                  dataSource={cpPropsDetail.more_icon || ''}
                  renderItem={item =>
                    <List.Item>
                      <img width={120} src={item} />
                    </List.Item>
                  }
                />
              </Description>
            </DescriptionList>
          </Card>
          <Card>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="form.cancel" />
              </Button>
            </FormItem>
          </Card>

        </Form>


      </PageHeaderWrapper>
    );
  }
}

export default PropsCreate;
