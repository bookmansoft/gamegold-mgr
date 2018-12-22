import React, { PureComponent } from 'react';
import { Card, Button, Divider, List } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import router from 'umi/router';
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
        <Link to={`/gameprops/produce/${this.state.id}`} className="ant-btn ant-btn-primary">生产道具</Link>
        <Divider type="vertical" style={{ background: "none" }} />
        <Link to={`/gameprops/present/${this.state.id}`} className="ant-btn ant-btn-primary">赠送道具</Link>
        {/* <Divider type="vertical" style={{background:"none"}} />
        <Button type="primary" onClick={e => this.propsOnsale(this.state.id)}>上架出售</Button> */}
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
      type: 'gameprops/propsDetail',
      payload: { id: id }
    }).then((ret) => {
      if (ret != '') {
        console.log(ret);
      }
    });
  };

  render() {
    const {
      gameprops: { propsDetail },
    } = this.props;
    let detail = propsDetail.data || [];
    let iconPreview = eval('(' + detail.icon_preview + ')');
    return (
      <PageHeaderWrapper title={detail.name}>
        <Card bordered={false} headStyle={{ fontWeight: 600 }} title="生产信息" extra={this.mainButton()}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="生产总量">{detail.pro_num}</Description>
            <Description term="已上架出售/赠送">{detail.pro_num - detail.stock}</Description>
            <Description term="剩余库存">{detail.stock}</Description>
            <Description term="最后生产时间">{moment(detail.updatedAt).format('YYYY-MM-DD HH:mm')}</Description>
          </DescriptionList>
        </Card>
        <Card bordered={false} headStyle={{ fontWeight: 600 }} title="道具信息" extra={this.propsButton()}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="道具ID">{detail.id}</Description>
            <Description term="道具名称">{detail.props_name}</Description>
            <Description term="道具类型">{detail.props_type}</Description>
            <Description term="所属游戏">{detail.cp_name}</Description>
            <Description term="创建时间">{moment(detail.createdAt).format('YYYY-MM-DD HH:mm')}</Description>
            <Description term="道具简介">{detail.props_desc}</Description>
            <Description term="道具图标">
              <img width={120} src={detail.icon_url} />
            </Description>
            <Description term="道具说明图">
              <List
                grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={iconPreview}
                renderItem={item =>
                  <List.Item>
                    <img width={120} src={item} />
                  </List.Item>
                }
              />
            </Description>
          </DescriptionList>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PropsDetail;
