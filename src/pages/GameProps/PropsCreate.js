import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Icon ,
  List,
  Col,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import moment from 'moment';
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
    propsSearchList:[],
    statePropsDetail:{},
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'gameprops/getAllGameList',
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { gameprops: { cpPropsDetail } ,dispatch} = this.props;
    if(cpPropsDetail == null || typeof cpPropsDetail == 'undefined' || cpPropsDetail.length == 0){
      Modal.error({
        title: '错误',
        content: '请选择游戏以及道具！',
      });
      return ;
    }
    //TODO 请求一次CP信息
    let param = {};
    param.props_name = cpPropsDetail.name;
    param.props_type = cpPropsDetail.type;
    param.cid = this.state.cid;
    param.props_desc = cpPropsDetail.desc;
    param.icon_url = cpPropsDetail.iconImg;
    param.icon_preview = cpPropsDetail.moreImg;
    param.pid = cpPropsDetail.oid +'-'+moment().unix().toString();//TODO 搞个唯一id处理
    param.oid = cpPropsDetail.oid;
    param.oper = '';
    param.prev = '';
    param.current = '';
    param.gold = 0;
    param.status = 1;
    param.stock = 0;
    param.pro_num = 0;
    param.cp = '';
    param.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    param.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    //本地道具创建
    dispatch({
      type: 'gameprops/createproplocal',
      payload:param,
    }).then((ret) => {
      console.log(ret);

      if (ret.code == 0) {
          confirm({
            title: '创建成功',
            content: '道具创建成功，您可以前往道具列表查看！',
            okText: '返回列表',
            okType: 'primary',
            cancelText: '道具生产',
            cancelType: 'primary',
            onOk() {
              router.push('/gameprops/list');
            },
            onCancel() {
              router.push(`/gameprops/produce`);
            },
          });
      } else {

        Modal.error({
          title: '错误',
          content: '道具创建失败，请重试！',
        });
          
     }; 
    //调用道具上链
   /*  dispatch({
      type: 'gameprops/createpropremote',
      payload: {
        'pid': 123,
        'cid': 123,
        'gold': 123,
      },
    }).then((ret) => {
      console.log(ret);
      if (ret.code === 0 && ret.data===null) {
        router.push('/gamemgr/gameadderror');
      } else {
        router.push('/gamemgr/gameaddsuccess');
     };
    } */
  });
  };
  handleGameChange = (value) => {
    const { dispatch } = this.props;
    //获取游戏对应的道具列表
    //option key唯一用id|cp_id格式
    if(typeof value != 'undefined' && value != ''){
    console.log('选择游戏cid：'+ value);

      this.setState({
        cid: value,
      });
      dispatch({
        type: 'gameprops/getPropsByGame',
        payload: {
          id:value
        },
      });
      

    }
  };

  onPropsChange = (value) => {
    console.log('选择装备ID：'+ value);
    this.setState({
      pid: value,
    });
  };
  
  //道具预览 请求游戏厂商
  previewProp = () => {
    const { dispatch } = this.props;
    let curPropsId = this.state.pid;
    if(curPropsId > 0){
      dispatch({
        type: 'gameprops/cpPropsDetail',
        payload: {
          id:curPropsId
        },
      });
    }
  }
 

  render() {
    const { gameprops: { gameList,gamePropsList,cpPropsDetail },submitting } = this.props;
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
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const addIconPreviewItems = keys.map((k, index) => {
      return (
        <FormItem
          required={false}
          key={k}
        >
          {getFieldDecorator(`iconMore[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "请输入或者删除.",
            }],
          })(
            <Input placeholder={formatMessage({ id: 'form.input.placeholder' })} style={{ width: '60%', marginRight: 8 }} onChange={(e)=>this.iconMoreImgFun(e, k)}/>
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.removeInputIconPreview(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    return (
      <PageHeaderWrapper
        title= "创建新道具"
        content= "在这里您可以创建全新的道具品类"
      >
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>

        <Card title="道具信息" bordered={false} headStyle={{fontWeight:600}}>
          <FormItem {...formItemLayout} label= "从游戏中选择道具">
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
                    {gameList.map(game => <Option key={game.cp_id}>{game.cp_text}</Option>)}
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
                      {gamePropsList.map(props => <Option key={props.id}>{props.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
                </Col>
                <Col span={4}>
                <FormItem style={{ marginLeft: 32 }}>
                <Button type="primary" onClick={this.previewProp} > <FormattedMessage id="form.preview" /></Button>
                </FormItem>
                </Col>
            </FormItem>
            
        </Card>

        <Card bordered={false} headStyle={{fontWeight:600}} title="道具信息">
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="道具OID">{cpPropsDetail.oid || ''}</Description>
            <Description term="道具名称">{cpPropsDetail.name || ''}</Description>
            <Description term="道具类型">{cpPropsDetail.type || ''}</Description>
            <Description term="所属游戏">{this.state.cid || ''}</Description>
            <Description term="游戏简介">{cpPropsDetail.desc || ''}</Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ borderTop: '1px solid #ddd',marginTop: 32}}>
            <Description term="道具图标">
              <img width={120} src={cpPropsDetail.iconImg || ''} />
            </Description>
            <Description term="道具说明图">
              <List
                grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={cpPropsDetail.moreImg || ''}
                renderItem={item =>
                  <List.Item>
                    <img width={120} src={item}/>
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
