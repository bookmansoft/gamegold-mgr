import React, { Fragment, PureComponent } from 'react';
import styles from './PropsDetail.less';
import { Card, Badge, Button , Divider } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import router from 'umi/router';

const { Description } = DescriptionList;

@connect(({ gameprops, loading }) => ({
  gameprops,
  loading: loading.models.gameprops,
}))
class PropsDetail extends PureComponent {

  state = {
    id: '',
    detail: {},
  };
  componentDidMount() {
    this.state.id = this.props.match.params.id;
    const {dispatch } = this.props;
    dispatch({
      type: 'gameprops/propsDetail',
      payload: {id: this.state.id}
    });
  }
  mainButton (){
    return (
      <div>
        <Button type="primary" onClick={e => this.propsPro(this.state.id)} >生产道具</Button>
        <Divider type="vertical" style={{background:"none"}} />
        <Button type="primary" onClick={e => this.propsPresent(this.state.id)}>赠送道具</Button>
        <Divider type="vertical" style={{background:"none"}} />
        <Button type="primary" onClick={e => this.propsOnsale(this.state.id)}>上架出售</Button></div>
    );
  }
  propsButton (){
    return (
      <div><Button type="primary" onClick={e => this.propsEdit(this.state.id)}>修改信息</Button></div>
    );
  }
  propsEdit = (id) => {
    console.log(id);
    router.push(`/gameprops/propsEdit/${id}`)
  };
  propsPro = (id) => {
    console.log(id+'生产道具');
  };
  propsPresent = (id) => {
    console.log(id+'赠送道具');
  };
  propsOnsale = (id) => {
    console.log(id+'上架出售');
  };

  render() {
    const {
      gameprops: { detail },
    } = this.props;
    return (
        <PageHeaderWrapper title={detail.name}>
        <Card bordered={false} headStyle={{fontWeight:600}} title="生产信息"  extra={this.mainButton()}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="生产总量">{detail.num}</Description>
            <Description term="已上架出售/赠送">{detail.unstock}</Description>
            <Description term="剩余库存">{detail.stock}</Description>
            <Description term="最后生产时间">{moment(detail.updatedAt).fromNow()}</Description>
          </DescriptionList>
        </Card>
        <Card bordered={false} headStyle={{fontWeight:600}} title="道具信息" extra={this.propsButton()}>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="道具ID">{detail.num}</Description>
            <Description term="道具名称">{detail.unstock}</Description>
            <Description term="道具类型">{detail.stock}</Description>
            <Description term="所属游戏">{detail.game}</Description>
            <Description term="创建时间">{moment(detail.updatedAt).fromNow()}</Description>
            <Description term="游戏简介">{detail.desc}</Description>
            <Description term="道具图标">
              <Card
                hoverable style={{ width: 120 }}
                cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
              </Card>
            </Description>
          </DescriptionList>
        </Card>
        </PageHeaderWrapper>
    );
  }
}

export default PropsDetail;
