import React, { Fragment, PureComponent } from 'react';
import styles from './style.less';
import { Card, Badge, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { FormattedMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

@connect(({ gameprops, loading }) => ({
  gameprops,
  loading: loading.models.gameprops,
}))
class PropsEdit extends PureComponent {

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

  render() {
    const {
      gameprops: { detail },
    } = this.props;
    const id = this.state.id;
    return (
        <PageHeaderWrapper title= "修改道具" content= "在这里您可以修改道具">

            <Card bordered={false} headStyle={{fontWeight:600}} title={detail.name}>
              <DescriptionList size="large" title="生产信息" style={{ marginBottom: 32 }}>
                <Description term="生产总量">{detail.num}</Description>
                <Description term="已上架出售/赠送">{detail.unstock}</Description>
                <Description term="剩余库存">{detail.stock}</Description>
                <Description term="最后生产时间">{moment(detail.updatedAt).fromNow()}</Description>
              </DescriptionList>
            </Card>

        </PageHeaderWrapper>
    );
  }
}

export default PropsEdit;
