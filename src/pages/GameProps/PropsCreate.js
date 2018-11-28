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
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
const FormItem = Form.Item;
const { Description } = DescriptionList;
const { Option } = Select;
@connect(({ gameprops }) => ({
  gameprops
}))
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))

@Form.create()
class PropsCreate extends PureComponent {
  state = {
    gameId: 0,
    gamePropsId: 0,
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
    console.log(this.state);
    e.preventDefault();
    
  };
  handleGameChange = (value) => {
    const { dispatch } = this.props;
    //获取游戏对应的道具列表
    console.log('选择游戏ID：'+ value);
    if(value > 0){
      
      this.setState({
        gameId: value,
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
      gamePropsId: value,
    });
  };
  
  //道具预览
  previewProp = () => {
    const { dispatch } = this.props;
    let curPropsId = this.state.gamePropsId;
    if(curPropsId > 0){
      dispatch({
        type: 'gameprops/propsDetail',
        payload: {
          id:curPropsId
        },
      });
    }
  }
 

  render() {
    const { gameprops: { gameList,gamePropsList,propsDetail },submitting } = this.props;
    this.setState({
      statePropsDetail:propsDetail
    })
    console.log(propsDetail);
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
                    {gameList.map(game => <Option key={game.id}>{game.cp_name}</Option>)}
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
            <Description term="道具ID">{propsDetail.id || ''}</Description>
            <Description term="道具名称">{propsDetail.name || ''}</Description>
            <Description term="道具类型">{propsDetail.type || ''}</Description>
            <Description term="所属游戏">{propsDetail.game || ''}</Description>
            <Description term="游戏简介">{propsDetail.desc || ''}</Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ borderTop: '1px solid #ddd',marginTop: 32}}>
            <Description term="道具图标">
              <img width={120} src={propsDetail.iconImg || ''} />
            </Description>
            <Description term="道具说明图">
              <List
                grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={propsDetail.moreImg || ''}
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
