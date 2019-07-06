import React, { PureComponent } from 'react';
import { Card, Button, List, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Link from 'umi/link';

const { Description } = DescriptionList;
@connect(({ gameprops, loading }) => ({
  gameprops,
  loading: loading.models.gameprops,
}))
class PropsDetail extends PureComponent {

  state = {
    id: '',
    propsDetail: {},
  };
  componentDidMount() {
    this.state.id = this.props.match.params.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'gameprops/propsDetail',
      payload: { id: this.state.id }
    });
  }
  mainButton() {
    return (
      <div>
        <Link to={`/usermgr/userlist`} className="ant-btn ant-btn-primary">批量赠送</Link>
      </div>
    );
  }
  propsButton() {
    return (
      <div><Button type="primary" onClick={e => this.propsEdit(this.state.id)}>刷新道具</Button></div>
    );
  }
  propsEdit = (id) => {
    //TODO 获取道具信息并修改
    const { dispatch } = this.props;
    dispatch({
      type: 'gameprops/cpPropsDetailById',
      payload: { id: id }
    }).then((cpPropsDetail) => {
      if (cpPropsDetail != '') {
        let param = {};
        param.id = id;
        param.props_id = cpPropsDetail.id;
        param.props_name = cpPropsDetail.props_name;
        param.props_type = cpPropsDetail.props_type;
        param.props_desc = cpPropsDetail.props_desc;
        param.icon_url = cpPropsDetail.icon;
        param.icon_preview = cpPropsDetail.more_icon;
        param.status = cpPropsDetail.props_status;
        param.propsAt = cpPropsDetail.props_createtime;
        //本地道具编辑刷新
        dispatch({
          type: 'gameprops/editproplocal',
          payload: param,
        }).then((ret) => {
          if (ret.code == 0) {
            dispatch({
              type: 'gameprops/propsDetail',
              payload: { id: this.state.id }
            });

            Modal.success({
              title: '刷新成功',
              content: '道具基本信息更新成功！',
            });
          } else {

            Modal.error({
              title: '错误',
              content: ret.msg || '道具更新失败，请重试！',
            });

          };
        });
      }
    });
  };
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
    const {
      gameprops: { propsDetail },
    } = this.props;
    let detail = propsDetail.data || [];
    let iconPreview = detail.icon_preview;
    if(!!iconPreview && typeof iconPreview == 'string') {
      iconPreview = JSON.parse(iconPreview);
    }
    return (
      <PageHeaderWrapper title={detail.name}>
        <Card bordered={false} headStyle={{ fontWeight: 600 }} title="生产信息" /* extra={this.mainButton()} */>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="生产总量">{detail.pro_num || 0}</Description>
            <Description term="销售数量">{detail.pro_num || 0}</Description>
            <Description term="赠送数量">{detail.pro_num || 0}</Description>
          </DescriptionList>
        </Card>
        <Card bordered={false} headStyle={{ fontWeight: 600 }} title="道具信息" extra={this.propsButton()}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="道具ID">{detail.id}</Description>
            <Description term="道具名称">{detail.props_name || ''}</Description>
            <Description term="道具类型">{detail.props_type || ''}</Description>
            <Description term="所属游戏">{detail.cp_name || ''}</Description>
            <Description term="创建时间">{moment(detail.createdAt).format('YYYY-MM-DD HH:mm')}</Description>
            <Description term="销售状态">{detail.status == 1 ? '在售' : '下架'}</Description>
            <Description term="商城标价">{detail.props_price / 100000 || ''}千克</Description>
            <Description term="含金等级">{this.getRankNote(detail.props_rank)}</Description>
          </DescriptionList>
          <DescriptionList size="large">
            <Description term="道具描述">{detail.props_desc || ''}</Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="道具图标 " span="24" style={{ marginTop: 32 }}>
              <img width={120} src={detail.icon_url || ''} />
            </Description>
            <Description term="道具说明图">
              <List
                grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={iconPreview || []}
                renderItem={item =>
                  <List.Item>
                    <img width={120} src={item} />
                  </List.Item>
                }
              />
            </Description>
          </DescriptionList>
        </Card>
      </PageHeaderWrapper >
    );
  }
}

export default PropsDetail;
